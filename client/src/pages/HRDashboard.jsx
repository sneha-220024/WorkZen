import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import Button from '../components/common/Button.jsx';
import { useNavigate } from 'react-router-dom';

const HRDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const sidebarItems = [
        { label: 'Dashboard', icon: '📊' },
        { label: 'Employees', icon: '👥' },
        { label: 'Attendance', icon: '📅' },
        { label: 'Leave Management', icon: '✉️' },
        { label: 'Payroll', icon: '💰' },
        { label: 'Payslips', icon: '📄' },
        { label: 'Reports', icon: '📈' },
        { label: 'Notifications', icon: '🔔' },
    ];

    return (
        <div className="flex min-h-screen bg-background font-inter">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-border-color flex flex-col">
                <div className="p-6 border-b border-border-color">
                    <h1 className="font-sora font-bold text-2xl text-primary">WorkZen <span className="text-text-primary">HR</span></h1>
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
                        <h2 className="font-sora font-bold text-3xl text-text-primary">HR Dashboard</h2>
                        <p className="text-text-secondary">Welcome back, {user?.name}</p>
                    </div>
                    <Button variant="outline" onClick={handleLogout}>Logout</Button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-card border border-border-color">
                        <p className="text-text-secondary text-sm mb-1">Total Employees</p>
                        <h3 className="text-3xl font-bold text-text-primary">124</h3>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-card border border-border-color">
                        <p className="text-text-secondary text-sm mb-1">Leave Requests</p>
                        <h3 className="text-3xl font-bold text-text-primary">8</h3>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-card border border-border-color">
                        <p className="text-text-secondary text-sm mb-1">New Hires</p>
                        <h3 className="text-3xl font-bold text-text-primary">3</h3>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-card border border-border-color">
                        <p className="text-text-secondary text-sm mb-1">Pending Payroll</p>
                        <h3 className="text-3xl font-bold text-text-primary">5</h3>
                    </div>
                </div>

                <div className="mt-10 bg-white p-8 rounded-2xl shadow-card border border-border-color">
                    <h4 className="font-sora font-bold text-xl mb-4">Quick Actions</h4>
                    <div className="flex gap-4">
                        <Button>Add Employee</Button>
                        <Button variant="outline">Generate Reports</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HRDashboard;
