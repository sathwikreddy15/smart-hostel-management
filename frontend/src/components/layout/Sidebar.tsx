import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface NavItem {
    label: string;
    path: string;
    icon: string;
    roles: ('admin' | 'student')[];
}

const navItems: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: '📊', roles: ['admin', 'student'] },
    { label: 'Profile', path: '/profile', icon: '👤', roles: ['admin', 'student'] },
    { label: 'Rooms', path: '/rooms', icon: '🏠', roles: ['admin', 'student'] },
    { label: 'Complaints', path: '/complaints', icon: '📝', roles: ['admin', 'student'] },
    { label: 'Leave Requests', path: '/leave-requests', icon: '📅', roles: ['admin', 'student'] },
    { label: 'Users', path: '/users', icon: '👥', roles: ['admin'] },
    { label: 'Settings', path: '/settings', icon: '⚙️', roles: ['admin'] },
];

const Sidebar: React.FC = () => {
    const { user } = useAuth();
    const location = useLocation();
    const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);
    const [isOpen, setIsOpen] = React.useState(!isMobile);

    React.useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            setIsOpen(!mobile);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const filteredNavItems = navItems.filter(item => 
        item.roles.includes(user?.role as 'admin' | 'student')
    );

    return (
        <>
            {isMobile && (
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="fixed top-4 left-4 z-50 p-2 bg-primary text-white rounded-md"
                >
                    {isOpen ? '✕' : '☰'}
                </button>
            )}
            <aside className={`
                fixed top-0 left-0 h-full bg-white shadow-lg transition-transform duration-300
                ${isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
                w-64 z-40
            `}>
                <div className="p-4 border-b">
                    <h2 className="text-xl font-bold text-primary">HMS</h2>
                    <p className="text-sm text-gray-600">
                        {user?.role === 'admin' ? 'Admin Panel' : 'Student Portal'}
                    </p>
                </div>
                <nav className="p-4">
                    {filteredNavItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`
                                flex items-center gap-3 p-3 rounded-md mb-2 transition-colors
                                ${location.pathname === item.path
                                    ? 'bg-primary text-white'
                                    : 'hover:bg-gray-100'
                                }
                            `}
                        >
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>
            </aside>
        </>
    );
};

export default Sidebar; 