import React, { useState, useEffect } from 'react';

export interface NotificationProps {
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
    onClose?: () => void;
}

const Notification: React.FC<NotificationProps> = ({
    message,
    type,
    duration = 3000,
    onClose
}) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            onClose?.();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    if (!isVisible) return null;

    const getTypeStyles = () => {
        switch (type) {
            case 'success':
                return 'bg-green-50 text-green-800 border-green-400';
            case 'error':
                return 'bg-red-50 text-red-800 border-red-400';
            case 'warning':
                return 'bg-yellow-50 text-yellow-800 border-yellow-400';
            case 'info':
                return 'bg-blue-50 text-blue-800 border-blue-400';
            default:
                return 'bg-gray-50 text-gray-800 border-gray-400';
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return '✓';
            case 'error':
                return '✕';
            case 'warning':
                return '⚠';
            case 'info':
                return 'ℹ';
            default:
                return '';
        }
    };

    return (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
            <div
                className={`flex items-center p-4 rounded-lg border-l-4 shadow-md ${getTypeStyles()}`}
                role="alert"
            >
                <div className="mr-3 text-xl">{getIcon()}</div>
                <div className="flex-1">{message}</div>
                <button
                    onClick={() => {
                        setIsVisible(false);
                        onClose?.();
                    }}
                    className="ml-4 text-gray-400 hover:text-gray-600"
                >
                    ✕
                </button>
            </div>
        </div>
    );
};

export default Notification;

// NotificationContext.tsx
export interface NotificationContextType {
    showNotification: (props: Omit<NotificationProps, 'onClose'>) => void;
}

export const NotificationContext = React.createContext<NotificationContextType>({
    showNotification: () => {}
});

// NotificationProvider.tsx
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Array<NotificationProps & { id: number }>>([]);
    const [counter, setCounter] = useState(0);

    const showNotification = (props: Omit<NotificationProps, 'onClose'>) => {
        const id = counter;
        setCounter(prev => prev + 1);

        setNotifications(prev => [...prev, { ...props, id, onClose: () => {
            setNotifications(current => current.filter(n => n.id !== id));
        }}]);
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            <div className="fixed top-4 right-4 z-50 space-y-4">
                {notifications.map(notification => (
                    <Notification key={notification.id} {...notification} />
                ))}
            </div>
        </NotificationContext.Provider>
    );
};

// useNotification.ts
export const useNotification = () => {
    const context = React.useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
}; 