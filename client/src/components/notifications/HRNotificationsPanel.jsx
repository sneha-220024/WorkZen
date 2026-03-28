import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import axios from 'axios';
import { 
    CalendarClock, 
    UserPlus, 
    BadgeDollarSign, 
    Clock, 
    Settings,
    Check,
    Bell,
    UserMinus,
    FileText,
    CheckCircle2,
    XCircle
} from 'lucide-react';

const HRNotificationsPanel = () => {
    const { user } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const userStr = localStorage.getItem('user');
            if (!userStr) return;
            const token = JSON.parse(userStr).token;

            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            const response = await axios.get('http://localhost:5005/api/hr/activities', config);
            if (response.data.success) {
                const mapped = response.data.data.map(act => {
                    return {
                        id: act._id,
                        title: getTitleForType(act.type),
                        description: act.message,
                        time: formatDate(new Date(act.createdAt)),
                        icon: getIconForType(act.type),
                        iconColor: getIconColorForType(act.type),
                        iconBg: getIconBgForType(act.type),
                        isRead: act.isRead
                    };
                });
                setNotifications(mapped);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [user]);

    const getTitleForType = (type) => {
        switch (type) {
            case 'employee_added': return 'New Employee Joined';
            case 'employee_updated': return 'Employee Profile Updated';
            case 'employee_deleted': return 'Employee Removed';
            case 'leave_applied': return 'Leave Request Submitted';
            case 'leave_approved': return 'Leave Request Approved';
            case 'leave_rejected': return 'Leave Request Rejected';
            case 'payroll_generated': return 'Payroll Batch Processed';
            case 'payroll_paid': return 'Payroll Batch Paid';
            case 'check_in': return 'Employee Checked In';
            case 'check_out': return 'Employee Checked Out';
            default: return 'System Activity';
        }
    };

    const getIconForType = (type) => {
        const t = type.toLowerCase();
        if (t.includes('leave')) return CalendarClock;
        if (t.includes('employee_added')) return UserPlus;
        if (t.includes('employee_deleted')) return UserMinus;
        if (t.includes('payroll')) return BadgeDollarSign;
        if (t.includes('check')) return Clock;
        if (t.includes('payslip')) return FileText;
        return Bell;
    };

    const getIconColorForType = (type) => {
        const t = type.toLowerCase();
        if (t.includes('approved') || t.includes('paid') || t.includes('check_in')) return 'text-emerald-600';
        if (t.includes('rejected') || t.includes('deleted') || t.includes('check_out')) return 'text-rose-600';
        if (t.includes('applied') || t.includes('added') || t.includes('updated')) return 'text-blue-600';
        if (t.includes('generated')) return 'text-purple-600';
        return 'text-slate-600';
    };

    const getIconBgForType = (type) => {
        const t = type.toLowerCase();
        if (t.includes('approved') || t.includes('paid') || t.includes('check_in')) return 'bg-emerald-100';
        if (t.includes('rejected') || t.includes('deleted') || t.includes('check_out')) return 'bg-rose-100';
        if (t.includes('applied') || t.includes('added') || t.includes('updated')) return 'bg-blue-100';
        if (t.includes('generated')) return 'bg-purple-100';
        return 'bg-slate-100';
    };

    const formatDate = (date) => {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) return 'Just now';
        
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours} hr${diffInHours > 1 ? 's' : ''} ago`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays} day ${diffInDays > 1 ? 's' : ''} ago`;
        
        return date.toLocaleDateString();
    };

    const markAllAsRead = async () => {
        try {
            const userStr = localStorage.getItem('user');
            if (!userStr) return;
            const token = JSON.parse(userStr).token;

            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            const response = await axios.patch('http://localhost:5005/api/hr/activities/read-all', {}, config);
            if (response.data.success) {
                setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            }
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 flex flex-col h-full overflow-hidden font-inter">
            {/* Header */}
            <div className="px-8 py-7 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                <div>
                    <h2 className="text-[26px] font-bold text-slate-900 leading-tight">Notifications</h2>
                    {unreadCount > 0 && (
                        <p className="text-blue-600 text-sm font-semibold mt-1 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>
                            {unreadCount} unread
                        </p>
                    )}
                </div>
                <button 
                    onClick={markAllAsRead}
                    disabled={notifications.length === 0}
                    className="text-slate-600 hover:text-blue-600 text-sm font-bold flex items-center gap-2 transition-all hover:bg-blue-50 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Check size={18} />
                    Mark all read
                </button>
            </div>

            {/* Notification List (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-8 space-y-5 bg-[#F8FAFC]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-full space-y-4">
                        <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                        <p className="text-slate-400 font-medium">Loading activities...</p>
                    </div>
                ) : notifications.length > 0 ? (
                    notifications.map((notification) => (
                        <div 
                            key={notification.id}
                            className={`relative bg-white p-6 rounded-[22px] border transition-all duration-300 hover:shadow-xl flex items-start gap-5
                                ${!notification.isRead 
                                    ? 'border-blue-100 shadow-[0_4px_20px_rgba(59,130,246,0.08)]' 
                                    : 'border-slate-100 shadow-sm opacity-90 hover:opacity-100'
                                }`
                            }
                        >
                            {/* Unread Indicator Bar */}
                            {!notification.isRead && (
                                <div className="absolute left-0 top-6 bottom-6 w-1.5 bg-blue-600 rounded-r-full shadow-[2px_0_8_rgba(37,99,235,0.4)]"></div>
                            )}

                            {/* Icon Container */}
                            <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${notification.iconBg} ${notification.iconColor} shadow-inner`}>
                                <notification.icon size={28} strokeWidth={2} />
                            </div>

                            {/* Content Section */}
                            <div className="flex-1 min-w-0 pt-1">
                                <div className="flex justify-between items-start gap-4 mb-1.5">
                                    <h4 className="text-[17px] font-bold text-slate-900 truncate tracking-tight">
                                        {notification.title}
                                    </h4>
                                    <span className="shrink-0 text-xs font-bold text-slate-400 mt-0.5 bg-slate-50 px-2.5 py-1 rounded-lg">
                                        {notification.time}
                                    </span>
                                </div>
                                <p className="text-[15px] text-slate-600 leading-relaxed line-clamp-2 font-medium">
                                    {notification.description}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 animate-in fade-in zoom-in duration-500">
                        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-50">
                            <div className="w-16 h-16 bg-blue-50/50 rounded-2xl flex items-center justify-center text-blue-500">
                                <Check size={36} strokeWidth={2.5} />
                            </div>
                        </div>
                        <h3 className="text-[22px] font-bold text-slate-900 mb-2">All caught up!</h3>
                        <p className="text-slate-400 text-base font-medium max-w-[280px] mx-auto">
                            No recent employee activities found.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HRNotificationsPanel;
