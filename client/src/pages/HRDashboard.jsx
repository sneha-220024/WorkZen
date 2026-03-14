import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import Button from '../components/common/Button.jsx';
import { useNavigate } from 'react-router-dom';
import HRNotificationsPanel from '../components/notifications/HRNotificationsPanel.jsx';
import { 
    LayoutDashboard, 
    Users, 
    Calendar, 
    ClipboardList, 
    BadgeDollarSign, 
    FileText, 
    Bell, 
    Search,
    User as UserIcon,
    Plus,
    CheckCircle,
    Play,
    UserPlus,
    BarChart3,
    MoreVertical
} from 'lucide-react';
import axios from 'axios';

const HRDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);
    const [stats, setStats] = useState({
        totalEmployees: 0,
        todayAttendance: '85%',
        pendingLeaves: 12,
        payrollSummary: '$45,200'
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/employees');
                setStats(prev => ({ ...prev, totalEmployees: response.data.length }));
            } catch (error) {
                console.error("Error fetching employee count", error);
            }
        };
        fetchStats();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const sidebarItems = [
        { label: 'Dashboard', icon: LayoutDashboard, active: true, path: '/dashboard/hr' },
        { label: 'Employees', icon: Users, path: '/dashboard/hr/employees' },
        { label: 'Attendance', icon: Calendar, path: '/dashboard/hr/attendance' },
        { label: 'Leave Management', icon: ClipboardList, path: '/dashboard/hr/leaves' },
        { label: 'Payroll', icon: BadgeDollarSign, path: '/dashboard/hr/payroll' },
        { label: 'Payslip', icon: FileText, path: '/dashboard/hr/payslips' },
        { label: 'Notifications', icon: Bell, path: '/dashboard/hr/notifications' },
    ];

    const recentActivities = [
        { id: 1, name: 'Sarah Johnson', action: 'Submitted leave request', time: '2 hours ago', initial: 'SJ', color: 'bg-blue-100 text-blue-600' },
        { id: 2, name: 'Mike Chen', action: 'Checked in', time: '4 hours ago', initial: 'MC', color: 'bg-green-100 text-green-600' },
        { id: 3, name: 'Emily Davis', action: 'Payslip generated', time: 'Yesterday', initial: 'ED', color: 'bg-purple-100 text-purple-600' },
        { id: 4, name: 'Alex Kim', action: 'Onboarding completed', time: '2 days ago', initial: 'AK', color: 'bg-orange-100 text-orange-600' },
    ];

    const quickActions = [
        { label: 'Add Employee', icon: UserPlus, onClick: () => navigate('/dashboard/hr/employees') },
        { label: 'Approve Leave', icon: CheckCircle, onClick: () => {} },
        { label: 'Run Payroll', icon: Play, onClick: () => {} },
        { label: 'New Recruitment', icon: Plus, onClick: () => {} },
        { label: 'View Reports', icon: BarChart3, onClick: () => {} },
    ];

    return (
        <>
            <div className="mb-8">
                <h2 className="text-[28px] font-semibold text-slate-900 mb-1">HR Dashboard</h2>
                <p className="text-slate-500 text-sm">Overview of your organization's performance</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard 
                    title="Total Employees" 
                    value={stats.totalEmployees} 
                    icon={Users} 
                    color="blue" 
                />
                <StatCard 
                    title="Today's Attendance" 
                    value={stats.todayAttendance} 
                    icon={Calendar} 
                    color="green" 
                />
                <StatCard 
                    title="Pending Leaves" 
                    value={stats.pendingLeaves} 
                    icon={ClipboardList} 
                    color="red" 
                    isUrgent={true}
                />
                <StatCard 
                    title="Payroll Summary" 
                    value={stats.payrollSummary} 
                    icon={BadgeDollarSign} 
                    color="purple" 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-[24px] p-8 shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-slate-900">Recent Activity</h3>
                        <button className="text-blue-600 text-sm font-semibold hover:underline">View All</button>
                    </div>
                    <div className="space-y-6">
                        {recentActivities.map((activity) => (
                            <div key={activity.id} className="flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl ${activity.color} flex items-center justify-center font-bold text-sm shadow-sm`}>
                                        {activity.initial}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">
                                            {activity.name} <span className="font-normal text-slate-500">— {activity.action}</span>
                                        </p>
                                        <p className="text-xs text-slate-400 mt-0.5">{activity.time}</p>
                                    </div>
                                </div>
                                <button className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-slate-600 transition-all">
                                    <MoreVertical size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100 flex flex-col">
                    <h3 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h3>
                    <div className="space-y-3">
                        {quickActions.map((action, idx) => (
                            <button 
                                key={idx}
                                onClick={action.onClick}
                                className="w-full flex items-center gap-3 px-5 py-4 bg-slate-50 hover:bg-blue-600 hover:text-white rounded-2xl transition-all duration-200 group border border-transparent"
                            >
                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-600 group-hover:text-blue-600 shadow-sm transition-colors">
                                    <action.icon size={20} />
                                </div>
                                <span className="font-bold text-sm">{action.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

const StatCard = ({ title, value, icon: Icon, color, isUrgent }) => {
    const colors = {
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
        red: 'bg-red-100 text-red-600',
        purple: 'bg-purple-100 text-purple-600'
    };

    return (
        <div className="bg-white p-7 rounded-[24px] shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-2xl ${colors[color]} flex items-center justify-center mb-5`}>
                <Icon size={24} />
            </div>
            <p className="text-sm font-medium text-slate-500 mb-2 uppercase tracking-wide">{title}</p>
            <h3 className={`text-[26px] font-bold ${isUrgent ? 'text-red-600' : 'text-slate-900'}`}>
                {value}
            </h3>
        </div>
    );
};

export default HRDashboard;

