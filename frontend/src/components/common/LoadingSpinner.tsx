import React from 'react';

interface LoadingSpinnerProps {
    size?: 'small' | 'medium' | 'large';
    fullScreen?: boolean;
    text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'medium',
    fullScreen = false,
    text
}) => {
    const getSizeClasses = () => {
        switch (size) {
            case 'small':
                return 'h-6 w-6 border-2';
            case 'large':
                return 'h-16 w-16 border-4';
            default:
                return 'h-12 w-12 border-3';
        }
    };

    const spinner = (
        <div className="flex flex-col items-center justify-center">
            <div
                className={`animate-spin rounded-full border-t-transparent border-primary ${getSizeClasses()}`}
                role="status"
                aria-label="loading"
            />
            {text && (
                <p className="mt-4 text-gray-600">{text}</p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
                {spinner}
            </div>
        );
    }

    return spinner;
};

export default LoadingSpinner; 