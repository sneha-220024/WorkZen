import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import Button from '../components/common/Button.jsx';
feature/emplyeedashboard(profile,attendance)
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
    Calendar, 
    Clock, 
    ArrowUpRight, 
    CheckCircle2, 
    FileText, 
    User as UserIcon,
    Bell,
    TrendingUp,
    MoreVertical
} from 'lucide-react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
main

const EmployeeDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [attendance] = useState({
        checkedIn: false,
        checkInTime: null,
        checkOutTime: null,
    });

 feature/emplyeedashboard(profile,attendance)
    const stats = [
        { 
            label: 'Present Days', 
            count: '18', 
            description: 'This Month', 
            icon: Calendar, 
            color: 'bg-blue-500', 
            textColor: 'text-blue-600',
            bgColor: 'bg-blue-50'
        },
        { 
            label: 'Leave Balance', 
            count: '12', 
            description: 'Days Remaining', 
            icon: CheckCircle2, 
            color: 'bg-emerald-500', 
            textColor: 'text-emerald-600',
            bgColor: 'bg-emerald-50'
        },
        { 
            label: 'Overtime Hours', 
            count: '8.5', 
            description: 'Current Period', 
            icon: Clock, 
            color: 'bg-orange-500', 
            textColor: 'text-orange-600',
            bgColor: 'bg-orange-50'
        },
        { 
            label: 'Notifications', 
            count: '3', 
            description: 'Unread Alerts', 
            icon: Bell, 
            color: 'bg-primary', 
            textColor: 'text-primary',
            bgColor: 'bg-indigo-50'
        },
    ];

    const activities = [
        { id: 1, type: 'check-in', title: 'Check-in activity', time: '09:05 AM', date: 'Today', icon: Clock, color: 'text-blue-500' },
        { id: 2, type: 'leave', title: 'Annual Leave approved', time: '02:30 PM', date: 'Yesterday', icon: CheckCircle2, color: 'text-emerald-500' },
        { id: 3, type: 'payslip', title: 'February Payslip generated', time: '11:15 AM', date: 'Mar 01, 2026', icon: FileText, color: 'text-indigo-500' },
        { id: 4, type: 'profile', title: 'Profile details updated', time: '10:00 AM', date: 'Feb 25, 2026', icon: UserIcon, color: 'text-orange-500' },

    const location = useLocation();

    const sidebarItems = [
        { label: 'Dashboard', icon: '🏠', path: '/dashboard/employee' },
        { label: 'My Attendance', icon: '⏰', path: '/dashboard/employee/attendance' },
        { label: 'Leave Management', icon: '🏖️', path: '/dashboard/employee/leave' },
        { label: 'My Payslips', icon: '💸', path: '/dashboard/employee/payslips' },
        { label: 'Notifications', icon: '🔔', path: '/dashboard/employee/notifications' },
        { label: 'Profile', icon: '👤', path: '/dashboard/employee/profile' },
      main
    ];

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
                    <Button variant="outline" className="gap-2">
                        <Calendar size={18} />
                        March 11, 2026
                    </Button>
                    <Button onClick={() => navigate('/dashboard/leaves')} className="shadow-lg shadow-primary/20">
                        Apply for Leave
                    </Button>
                </div>
 feature/emplyeedashboard(profile,attendance)

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
 main
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
                        <div className="flex items-start justify-between mb-4">
                            <div className={`${stat.bgColor} ${stat.textColor} p-3 rounded-xl`}>
                                <stat.icon size={24} />
                            </div>
                            <span className="text-emerald-500 flex items-center text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full">
                                <TrendingUp size={12} className="mr-1" />
                                +2.5%
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 mb-1">{stat.count}</h3>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-tight">{stat.label}</p>
                        <p className="text-xs text-slate-400 mt-4 flex items-center gap-1 font-medium">
                            {stat.description}
                        </p>
                    </div>
                ))}
            </div>

feature/emplyeedashboard(profile,attendance)
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
                    <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl shadow-slate-200 relative overflow-hidden group">
                        <div className="absolute -right-6 -top-6 w-32 h-32 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all duration-500"></div>
                        <h3 className="text-lg font-bold font-sora mb-2 relative z-10">Attendance Tracking</h3>
                        <p className="text-slate-400 text-sm mb-6 relative z-10">You're currently {attendance.checkedIn ? 'checked in' : 'not checked in'}.</p>
                        
                        {!attendance.checkedIn ? (
                            <Button 
                                className="w-full bg-white text-slate-900 hover:bg-slate-100 font-bold border-none transition-transform hover:scale-[1.02] active:scale-[0.98]"
                                onClick={() => navigate('/dashboard/attendance')}
                            >
                                Check In Now
                            </Button>
                        ) : (
                            <Button 
                                variant="outline" 
                                className="w-full border-slate-700 text-white hover:bg-slate-800 font-bold"
                                onClick={() => navigate('/dashboard/attendance')}
                            >
                                Check Out
                            </Button>
                        )}
                        
                        <p className="text-xs text-slate-500 mt-4 text-center font-medium">System time: 04:23 PM</p>
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
 main
            </div>
        </div>
    );
};

export default EmployeeDashboard;
