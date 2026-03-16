import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import {
    Calendar,
    Clock,
    ArrowUpRight,
    Bell,
    TrendingUp,
    MoreVertical
} from 'lucide-react';
import { useNavigate, Outlet } from 'react-router-dom';
import axios from 'axios';

const EmployeeDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [stats, setStats] = useState([]);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    const [attendanceStatus, setAttendanceStatus] = useState({
        checkedIn: false,
        checkInTime: null,
    });

    useEffect(() => {
        fetchDashboardData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = user?.token;
            if (!token) return;

            const [statsRes, historyRes] = await Promise.all([
                axios.get('http://localhost:5000/api/employee/dashboard-stats', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get('http://localhost:5000/api/employee/attendance/history', {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            if (statsRes.data.success) {
                const s = statsRes.data.data;
                setStats([
                    { label: 'Present Days', count: s.presentDays, description: 'This month', icon: Clock, color: 'bg-blue-500', textColor: 'text-blue-600', bgColor: 'bg-blue-50' },
                    { label: 'Leave Balance', count: s.leaveBalance, description: 'Days remaining', icon: Calendar, color: 'bg-emerald-500', textColor: 'text-emerald-600', bgColor: 'bg-emerald-50' },
                    { label: 'Overtime Hours', count: s.overtimeHours, description: 'This month', icon: TrendingUp, color: 'bg-orange-500', textColor: 'text-orange-600', bgColor: 'bg-orange-50' },
                    { label: 'Notifications', count: s.notificationsCount, description: 'Unread', icon: Bell, color: 'bg-primary', textColor: 'text-primary', bgColor: 'bg-indigo-50' },
                ]);
            }

            if (historyRes.data.success) {
                const history = historyRes.data.data;
                const today = new Date().toISOString().split('T')[0];
                const todayRec = history.find(r => r.date.startsWith(today));
                
                if (todayRec) {
                    setAttendanceStatus({
                        checkedIn: !!todayRec.checkInTime && !todayRec.checkOutTime,
                        checkInTime: todayRec.checkInTime,
                    });
                }

                // Map activities
                const mappedActivities = history.slice(0, 4).map(r => ({
                    id: r._id,
                    type: 'check-in',
                    title: `Checked in at ${new Date(r.checkInTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`,
                    time: new Date(r.checkInTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                    date: new Date(r.date).toLocaleDateString() === new Date().toLocaleDateString() ? 'Today' : new Date(r.date).toLocaleDateString(),
                    icon: Clock,
                    color: 'text-blue-500'
                }));
                setActivities(mappedActivities);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 font-sora">
                        Welcome back, <span className="text-primary">{user?.name || 'Employee'}</span>
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium">Here's your work summary for today</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors">
                        <Calendar size={18} />
                        {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </button>
                    <button onClick={() => navigate('/dashboard/leaves')} className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-bold text-sm rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-95 transition-all">
                        Apply for Leave
                    </button>
                </div>

            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div
                        key={idx}
                        className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 group cursor-pointer"
                        onClick={() => {
                            if (stat.label === 'Notifications') navigate('/dashboard/notifications');
                            if (stat.label === 'Leave Balance') navigate('/dashboard/leaves');
                            if (stat.label === 'Present Days' || stat.label === 'Overtime Hours') navigate('/dashboard/attendance');
                        }}
                    >
                        <div className="flex items-start justify-between mb-2">
                            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                            <div className={`${stat.bgColor} ${stat.textColor} p-2.5 rounded-xl`}>
                                <stat.icon size={20} />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 mb-4">{stat.count}</h3>
                        <p className="text-xs text-slate-400 font-medium">
                            {stat.description}
                        </p>
                    </div>
                ))}
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 font-sora">Recent Activity</h2>
                            <p className="text-sm text-slate-500 font-medium">Keep track of your latest updates</p>
                        </div>
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                            <MoreVertical size={20} />
                        </button>
                    </div>
                    <div className="p-6">
                        <div className="space-y-6">
                            {activities.map((activity) => (
                                <div
                                    key={activity.id}
                                    className="flex items-start gap-4 group cursor-pointer"
                                    onClick={() => {
                                        if (activity.type === 'leave') {
                                            navigate('/dashboard/leaves');
                                        } else if (activity.type === 'payslip') {
                                            navigate('/dashboard/payslips');
                                        } else if (activity.type === 'profile') {
                                            navigate('/dashboard/profile');
                                        } else if (activity.type === 'check-in') {
                                            navigate('/dashboard/attendance');
                                        }
                                    }}
                                >
                                    <div className={`w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-primary/5 transition-colors`}>
                                        <activity.icon size={20} className={activity.color} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-primary transition-colors">{activity.title}</h4>
                                            <span className="text-xs font-medium text-slate-400 shrink-0">{activity.date}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                                            <Clock size={12} />
                                            {activity.time}
                                        </p>
                                    </div>
                                    <ArrowUpRight size={16} className="text-slate-300 group-hover:text-primary transition-colors mt-1" />
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-8 py-3 text-sm font-bold text-primary bg-primary/5 rounded-xl hover:bg-primary/10 transition-colors border border-transparent hover:border-primary/20">
                            View All Activities
                        </button>
                    </div>
                </div>

                {/* Quick Shortcuts / Info Card */}
                <div className="space-y-8">
                    <div className="rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group" style={{background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 50%, #4f46e5 100%)'}}>
                        <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500"></div>
                        <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
                        <h3 className="text-lg font-bold font-sora mb-2 relative z-10">Attendance Tracking</h3>
                        <p className="text-indigo-200 text-sm mb-6 relative z-10">You're currently {attendanceStatus.checkedIn ? 'checked in ✓' : 'not checked in'}.</p>

                        {!attendanceStatus.checkedIn ? (
                            <button
                                className="w-full py-3 bg-white text-indigo-700 hover:bg-indigo-50 font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-900/30 relative z-10"
                                onClick={() => navigate('/dashboard/attendance')}
                            >
                                Check In Now
                            </button>
                        ) : (
                            <button
                                className="w-full py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold rounded-xl border border-white/30 transition-all hover:scale-[1.02] active:scale-[0.98] relative z-10"
                                onClick={() => navigate('/dashboard/attendance')}
                            >
                                Check Out
                            </button>
                        )}

                        <p className="text-xs text-indigo-300 mt-4 text-center font-medium relative z-10">System time: {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>

                    <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
                        <h3 className="text-slate-900 font-bold mb-4 font-sora">Help & Support</h3>
                        <div className="space-y-3">
                            <button className="w-full flex items-center justify-between p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all text-sm font-bold text-slate-700 group">
                                Contact HR
                                <ArrowUpRight size={16} className="text-slate-300 group-hover:text-primary transition-colors" />
                            </button>
                            <button className="w-full flex items-center justify-between p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all text-sm font-bold text-slate-700 group">
                                IT Support
                                <ArrowUpRight size={16} className="text-slate-300 group-hover:text-primary transition-colors" />
                            </button>
                        </div>
                    </div>
                </div>

                <Outlet />
            </div>
        </div>
    );
};

export default EmployeeDashboard;
