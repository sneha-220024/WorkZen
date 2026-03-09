import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import Button from '../components/common/Button.jsx';
import { useNavigate } from 'react-router-dom';

const EmployeeDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const sidebarItems = [
        { label: 'Dashboard', icon: '🏠' },
        { label: 'My Attendance', icon: '⏰' },
        { label: 'My Leaves', icon: '🏖️' },
        { label: 'My Payslips', icon: '💸' },
        { label: 'Profile', icon: '👤' },
    ];

    return (
        <div className="flex min-h-screen bg-background font-inter">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-border-color flex flex-col">
                <div className="p-6 border-b border-border-color">
                    <h1 className="font-sora font-bold text-2xl text-primary">WorkZen</h1>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {sidebarItems.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 px-4 py-3 text-text-secondary hover:bg-primary-light hover:text-primary rounded-xl cursor-not-allowed transition-colors">
                            <span>{item.icon}</span>
                            <span className="font-semibold">{item.label}</span>
                        </div>
                    ))}
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-card border border-border-color flex flex-col items-center">
                        <p className="text-text-secondary text-sm mb-4 font-semibold uppercase">Daily Attendance</p>
                        <div className="flex gap-4">
                            <Button>Check In</Button>
                            <Button variant="outline">Check Out</Button>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-card border border-border-color">
                        <p className="text-text-secondary text-sm mb-1 font-semibold uppercase">Leaves Remaining</p>
                        <h3 className="text-3xl font-bold text-primary">12 Days</h3>
                        <p className="text-xs text-text-secondary mt-2">Annual Leave quota</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-card border border-border-color">
                        <p className="text-text-secondary text-sm mb-1 font-semibold uppercase">Last Payslip</p>
                        <h3 className="text-xl font-bold text-text-primary">February 2026</h3>
                        <p className="text-primary text-sm font-bold mt-2 cursor-pointer hover:underline">View Details →</p>
                    </div>
                </div>

                <div className="mt-10 bg-white p-8 rounded-2xl shadow-card border border-border-color">
                    <h4 className="font-sora font-bold text-xl mb-6">Quick Actions</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 border border-border-color rounded-xl text-center hover:bg-primary/5 transition-colors cursor-not-allowed">
                            <span className="block text-2xl mb-2">🏖️</span>
                            <span className="font-semibold text-text-primary">Apply Leave</span>
                        </div>
                        <div className="p-4 border border-border-color rounded-xl text-center hover:bg-primary/5 transition-colors cursor-not-allowed">
                            <span className="block text-2xl mb-2">👤</span>
                            <span className="font-semibold text-text-primary">Edit Profile</span>
                        </div>
                        <div className="p-4 border border-border-color rounded-xl text-center hover:bg-primary/5 transition-colors cursor-not-allowed">
                            <span className="block text-2xl mb-2">📄</span>
                            <span className="font-semibold text-text-primary">View Documents</span>
                        </div>
                        <div className="p-4 border border-border-color rounded-xl text-center hover:bg-primary/5 transition-colors cursor-not-allowed">
                            <span className="block text-2xl mb-2">⚙️</span>
                            <span className="font-semibold text-text-primary">Account Settings</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;
