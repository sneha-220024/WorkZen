import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { 
    Users, 
    Calendar, 
    ClipboardList, 
    BadgeDollarSign, 
    Plus,
    CheckCircle,
    Play,
    UserPlus,
    BarChart3,
    MoreVertical,
    MessageSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HRDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalEmployees: 0,
        todayAttendance: '0%',
        pendingLeaves: 0,
        pendingRequests: 0,
        payrollSummary: '$0'
    });
    const [activities, setActivities] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);
                const token = user?.token || JSON.parse(localStorage.getItem('user'))?.token;
                
                if (!token) return;

                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };

                const response = await axios.get('http://localhost:5005/api/hr/dashboard', config);
                
                if (response.data.success) {
                    const data = response.data.data;
                    setStats({
                        totalEmployees: data.totalEmployees || 0,
                        todayAttendance: `${data.todaysAttendancePercentage || 0}%`,
                        pendingLeaves: data.pendingLeaveRequests || 0,
                        pendingRequests: data.pendingRequestsCount || 0,
                        payrollSummary: `$${(data.totalPayrollForCurrentMonth || 0).toLocaleString()}`
                    });
                }
            } catch (error) {
                console.error("Error fetching dashboard data", error);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchActivities = async (expand = false) => {
            try {
                const token = user?.token || JSON.parse(localStorage.getItem('user'))?.token;
                if (!token) return;

                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };

                const limit = expand ? 50 : 5;
                const response = await axios.get(`http://localhost:5005/api/hr/activities?limit=${limit}`, config);
                if (response.data.success) {
                    setActivities(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching activities", error);
            }
        };

        if (user) {
            fetchDashboardData();
            fetchActivities(isExpanded);
        }
    }, [user, isExpanded]);

    const handleViewAll = () => {
        setIsExpanded(!isExpanded);
    };

    const getInitials = (name) => {
        if (!name) return '??';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    const getActivityColor = (type) => {
        const colors = {
            leave_approved: 'bg-green-100 text-green-600',
            leave_rejected: 'bg-red-100 text-red-600',
            leave_applied: 'bg-blue-100 text-blue-600',
            employee_added: 'bg-purple-100 text-purple-600',
            payroll_generated: 'bg-orange-100 text-orange-600',
            payroll_paid: 'bg-emerald-100 text-emerald-600',
            payslip_generated: 'bg-indigo-100 text-indigo-600',
            check_in: 'bg-cyan-100 text-cyan-600',
            check_out: 'bg-slate-100 text-slate-600'
        };
        return colors[type] || 'bg-slate-100 text-slate-600';
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        
        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        if (diffInSeconds < 172800) return 'Yesterday';
        return date.toLocaleDateString();
    };


    const quickActions = [
        { label: 'Add Employee', icon: UserPlus, onClick: () => navigate('/dashboard/hr/employees') },
        { label: 'Approve Leave', icon: CheckCircle, onClick: () => navigate('/dashboard/hr/leaves') },
        { label: 'Review Requests', icon: MessageSquare, onClick: () => navigate('/dashboard/hr/requests') },
        { label: 'Run Payroll', icon: Play, onClick: () => navigate('/dashboard/hr/payroll') },
    ];

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-[28px] font-semibold text-slate-900 mb-1">HR Dashboard</h2>
                <p className="text-slate-500 text-sm">Overview of your organization's performance</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
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
                <StatCard 
                    title="Employee Requests" 
                    value={stats.pendingRequests} 
                    icon={MessageSquare} 
                    color="blue" 
                    isUrgent={stats.pendingRequests > 0}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-[24px] p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col">
                    <div className="flex justify-between items-center mb-6 shrink-0">
                        <h3 className="text-xl font-bold text-slate-900">Recent Activity</h3>
                        <button 
                            onClick={handleViewAll}
                            className="text-blue-600 text-sm font-semibold hover:underline"
                        >
                            {isExpanded ? 'Show Less' : 'View All'}
                        </button>
                    </div>
                    <div className={`space-y-6 ${isExpanded ? 'max-h-[500px] overflow-y-auto pr-2 custom-scrollbar' : ''}`}>
                        {activities.length > 0 ? (
                            activities.map((activity) => (
                                <div key={activity._id} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl ${getActivityColor(activity.type)} flex items-center justify-center font-bold text-sm shadow-sm`}>
                                            {getInitials(activity.employeeName || 'HR')}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">
                                                {activity.message}
                                            </p>
                                            <p className="text-xs text-slate-400 mt-0.5">{formatTime(activity.createdAt)}</p>
                                        </div>
                                    </div>
                                    <button className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-slate-600 transition-all">
                                        <MoreVertical size={18} />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-500 text-center py-4">No recent activity</p>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h3>
                    <div className="space-y-3">
                        {quickActions.map((action, idx) => (
                            <button 
                                key={idx}
                                onClick={action.onClick}
                                className="w-full flex items-center gap-3 px-5 py-4 bg-slate-50 hover:bg-blue-600 hover:text-white rounded-2xl transition-all duration-200 group border border-transparent hover:shadow-lg hover:shadow-blue-200"
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
        </div>
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
        <div className="bg-white p-7 rounded-[24px] shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-5 group-hover:scale-110 transition-transform ${colors[color].split(' ')[0]}`}></div>
            <div className={`w-12 h-12 rounded-2xl ${colors[color]} flex items-center justify-center mb-5 shrink-0`}>
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
