import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import Button from '../components/common/Button.jsx';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';

const EmployeeDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const location = useLocation();

    const sidebarItems = [
        { label: 'Dashboard', icon: '🏠', path: '/dashboard/employee' },
        { label: 'My Attendance', icon: '⏰', path: '/dashboard/employee/attendance' },
        { label: 'Leave Management', icon: '🏖️', path: '/dashboard/employee/leave' },
        { label: 'My Payslips', icon: '💸', path: '/dashboard/employee/payslips' },
        { label: 'Notifications', icon: '🔔', path: '/dashboard/employee/notifications' },
        { label: 'Profile', icon: '👤', path: '/dashboard/employee/profile' },
    ];

    return (
        <div className="flex min-h-screen bg-background font-inter">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-border-color flex flex-col">
                <div className="p-6 border-b border-border-color">
                    <h1 className="font-sora font-bold text-2xl text-primary">WorkZen</h1>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {sidebarItems.map((item, idx) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <div
                                key={idx}
                                onClick={() => navigate(item.path)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors ${isActive
                                    ? 'bg-primary text-white font-semibold'
                                    : 'text-text-secondary hover:bg-primary-light hover:text-primary font-medium'
                                    }`}
                            >
                                <span>{item.icon}</span>
                                <span>{item.label}</span>
                            </div>
                        );
                    })}
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="font-sora font-bold text-3xl text-text-primary">Employee Dashboard</h2>
                        <p className="text-text-secondary">Welcome back, {user?.name}</p>
                    </div>
                    <Button variant="outline" onClick={handleLogout}>Logout</Button>
                </header>

                <Outlet />
            </div>
        </div>
    );
};

export default EmployeeDashboard;
