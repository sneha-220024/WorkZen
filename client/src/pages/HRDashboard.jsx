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
    MoreVertical
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HRDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalEmployees: 0,
        todayAttendance: '0%',
        pendingLeaves: 0,
        payrollSummary: '$0'
    });
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

                const response = await axios.get('http://localhost:5000/api/hr/dashboard', config);
                
                if (response.data.success) {
                    const data = response.data.data;
                    setStats({
                        totalEmployees: data.totalEmployees || 0,
                        todayAttendance: `${data.todaysAttendancePercentage || 0}%`,
                        pendingLeaves: data.pendingLeaveRequests || 0,
                        payrollSummary: `$${(data.totalPayrollForCurrentMonth || 0).toLocaleString()}`
                    });
                }
            } catch (error) {
                console.error("Error fetching dashboard data", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    const recentActivities = [
        { id: 1, name: 'Sarah Johnson', action: 'Submitted leave request', time: '2 hours ago', initial: 'SJ', color: 'bg-blue-100 text-blue-600' },
        { id: 2, name: 'Mike Chen', action: 'Checked in', time: '4 hours ago', initial: 'MC', color: 'bg-green-100 text-green-600' },
        { id: 3, name: 'Emily Davis', action: 'Payslip generated', time: 'Yesterday', initial: 'ED', color: 'bg-purple-100 text-purple-600' },
        { id: 4, name: 'Alex Kim', action: 'Onboarding completed', time: '2 days ago', initial: 'AK', color: 'bg-orange-100 text-orange-600' },
    ];

    const quickActions = [
        { label: 'Add Employee', icon: UserPlus, onClick: () => navigate('/dashboard/hr/employees') },
        { label: 'Approve Leave', icon: CheckCircle, onClick: () => navigate('/dashboard/hr/leaves') },
        { label: 'Run Payroll', icon: Play, onClick: () => navigate('/dashboard/hr/payroll') },
    ];

    return (
        <div>
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
                <div className="lg:col-span-2 bg-white rounded-[24px] p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
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
