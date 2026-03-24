import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import axios from 'axios';
import { 
    Bell, 
    Clock, 
    Calendar, 
    CheckCircle2, 
    XCircle, 
    Clock3, 
    LogIn, 
    LogOut,
    Inbox,
    CheckCircle
} from 'lucide-react';

const Notifications = () => {
    const { user } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const token = user?.token || JSON.parse(localStorage.getItem('user'))?.token;
            if (!token) return;

            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            // If user is HR, fetch from activities API
            if (user.role === 'hr') {
                const response = await axios.get('http://localhost:5000/api/hr/activities', config);
                if (response.data.success) {
                    const mapped = response.data.data.map(act => {
                        const [employeeName, actionPart] = act.message.split(' — ');
                        
                        // Refine Title and Description based on act.type
                        let title = actionPart || act.type.replace(/_/g, ' ');
                        let description = act.message;

                        // Normalize titles
                        if (act.type === 'employee_added') title = 'Employee Added';
                        if (act.type === 'employee_updated') title = 'Employee Updated';
                        if (act.type === 'employee_deleted') title = 'Employee Deactivated';
                        if (act.type === 'leave_approved') title = 'Leave Approved';
                        if (act.type === 'leave_rejected') title = 'Leave Rejected';
                        if (act.type === 'leave_applied') title = 'Leave Requested';
                        if (act.type === 'payroll_generated') title = 'Payroll Processed';
                        if (act.type === 'payroll_paid') title = 'Payroll Paid';
                        if (act.type === 'payslip_generated' || act.type === 'payslip_generated_all') title = 'Payslip Generated';

                        return {
                            id: act._id,
                            title: title.charAt(0).toUpperCase() + title.slice(1),
                            message: description,
                            timestamp: new Date(act.createdAt),
                            isRead: act.isRead,
                            type: act.type,
                            icon: getIconForType(act.type),
                            iconColor: getIconColorForType(act.type),
                            iconBg: getIconBgForType(act.type)
                        };
                    });
                    setNotifications(mapped);
                }
            } else {
                // Keep existing employee notification logic
                const [attendanceRes, leavesRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/employee/attendance/history', config).catch(() => ({ data: { success: false, data: [] } })),
                    axios.get('http://localhost:5000/api/employee/leaves/history', config).catch(() => ({ data: { success: false, data: [] } }))
                ]);

                const allNotifications = [];

                // Process Attendance History
                if (attendanceRes.data.success && attendanceRes.data.data) {
                    const history = attendanceRes.data.data;
                    history.forEach(record => {
                        if (record.checkInTime) {
                            allNotifications.push({
                                id: `chk-in-${record._id}`,
                                type: 'user-activity',
                                icon: LogIn,
                                iconColor: 'text-blue-500',
                                iconBg: 'bg-blue-50',
                                title: `You checked in at ${new Date(record.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
                                message: 'System recorded your check-in time.',
                                timestamp: new Date(record.checkInTime),
                            });
                        }
                        if (record.checkOutTime) {
                            allNotifications.push({
                                id: `chk-out-${record._id}`,
                                type: 'user-activity',
                                icon: LogOut,
                                iconColor: 'text-emerald-500',
                                iconBg: 'bg-emerald-50',
                                title: `You checked out at ${new Date(record.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
                                message: 'System recorded your check-out time.',
                                timestamp: new Date(record.checkOutTime),
                            });
                        }
                    });
                }

                // Process Leave History
                if (leavesRes.data.success && leavesRes.data.data) {
                    const leaves = leavesRes.data.data;
                    leaves.forEach(leave => {
                        const appliedDate = leave.createdAt ? new Date(leave.createdAt) : new Date(leave.startDate);
                        allNotifications.push({
                            id: `lv-app-${leave._id}`,
                            type: 'user-activity',
                            icon: Calendar,
                            iconColor: 'text-indigo-500',
                            iconBg: 'bg-indigo-50',
                            title: `You applied for leave`,
                            message: `${leave.type} from ${new Date(leave.startDate).toLocaleDateString()} to ${new Date(leave.endDate).toLocaleDateString()}.`,
                            timestamp: appliedDate,
                        });

                        if (leave.status === 'Approved') {
                            allNotifications.push({
                                id: `lv-apprv-${leave._id}`,
                                type: 'hr-action',
                                icon: CheckCircle,
                                iconColor: 'text-emerald-600',
                                iconBg: 'bg-emerald-100',
                                title: `Your leave request has been approved`,
                                message: `HR approved your ${leave.type} request.`,
                                timestamp: new Date(appliedDate.getTime() + 86400000), 
                            });
                        } else if (leave.status === 'Rejected') {
                            allNotifications.push({
                                id: `lv-rej-${leave._id}`,
                                type: 'hr-action',
                                icon: XCircle,
                                iconColor: 'text-rose-600',
                                iconBg: 'bg-rose-100',
                                title: `Your leave request was rejected`,
                                message: `HR rejected your ${leave.type} request.`,
                                timestamp: new Date(appliedDate.getTime() + 86400000), 
                            });
                        } else if (leave.status === 'Pending') {
                            allNotifications.push({
                                id: `lv-pend-${leave._id}`,
                                type: 'hr-action',
                                icon: Clock3,
                                iconColor: 'text-amber-600',
                                iconBg: 'bg-amber-100',
                                title: `Your leave request is pending`,
                                message: `Your ${leave.type} request is waiting for HR approval.`,
                                timestamp: new Date(appliedDate.getTime() + 1000), 
                            });
                        }
                    });
                }

                // Sort newest first
                allNotifications.sort((a, b) => b.timestamp - a.timestamp);
                setNotifications(allNotifications);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const getIconForType = (type) => {
        const t = type.toLowerCase();
        if (t.includes('leave')) return Calendar;
        if (t.includes('payroll')) return CheckCircle2;
        if (t.includes('payslip')) return Inbox;
        if (t.includes('employee_added')) return LogIn;
        if (t.includes('employee_deleted')) return LogOut;
        if (t.includes('employee')) return LogIn;
        if (t.includes('check')) return Clock;
        if (t.includes('attendance')) return Clock;
        return Bell;
    };

    const getIconColorForType = (type) => {
        const t = type.toLowerCase();
        if (t.includes('approved') || t.includes('paid')) return 'text-emerald-600';
        if (t.includes('rejected') || t.includes('deleted')) return 'text-rose-600';
        if (t.includes('applied') || t.includes('requested') || t.includes('added')) return 'text-blue-600';
        if (t.includes('generated')) return 'text-indigo-600';
        return 'text-slate-600';
    };

    const getIconBgForType = (type) => {
        const t = type.toLowerCase();
        if (t.includes('approved') || t.includes('paid')) return 'bg-emerald-100';
        if (t.includes('rejected') || t.includes('deleted')) return 'bg-rose-100';
        if (t.includes('applied') || t.includes('requested') || t.includes('added')) return 'bg-blue-100';
        if (t.includes('generated')) return 'bg-indigo-100';
        return 'bg-slate-100';
    };

    const markAllAsRead = async () => {
        try {
            const token = user?.token || JSON.parse(localStorage.getItem('user'))?.token;
            if (!token) return;

            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            const response = await axios.patch('http://localhost:5000/api/hr/activities/read-all', {}, config);
            if (response.data.success) {
                setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            }
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const formatDate = (date) => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        } else if (date.toDateString() === yesterday.toDateString()) {
            return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }
        return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto pb-12">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <Bell className="text-primary" /> 
                        Notifications
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium">Activity and HR updates for {user?.name || 'you'}</p>
                </div>
                {user.role === 'hr' && notifications.length > 0 && (
                    <button 
                        onClick={markAllAsRead}
                        className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl border border-slate-200 transition-all shadow-sm hover:shadow-md active:scale-95"
                    >
                        Mark all as read
                    </button>
                )}
            </header>

            {/* Notification List */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                    <h2 className="text-lg font-bold text-slate-900">Recent Alerts</h2>
                </div>
                
                {loading ? (
                    <div className="p-12 flex justify-center items-center">
                        <div className="w-8 h-8 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
                    </div>
                ) : notifications.length > 0 ? (
                    <div className="divide-y divide-slate-50">
                        {notifications.map((notification) => (
                            <div 
                                key={notification.id} 
                                className="p-6 flex gap-5 hover:bg-slate-50/80 transition-colors group"
                            >
                                <div className={`w-12 h-12 rounded-[1rem] ${notification.iconBg} ${notification.iconColor} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform relative`}>
                                    <notification.icon size={24} />
                                    {user.role === 'hr' && !notification.isRead && (
                                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-blue-600 border-2 border-white rounded-full"></span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0 pt-0.5">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 mb-1">
                                        <h3 className="text-base font-bold text-slate-900">{notification.title}</h3>
                                        <span className="text-xs font-bold text-slate-400 whitespace-nowrap bg-slate-100 px-2 py-1 rounded-md">
                                            {formatDate(notification.timestamp)}
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium text-slate-500 leading-relaxed">
                                        {notification.message}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-16 flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <Inbox size={32} className="text-slate-300" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">All Caught Up!</h3>
                        <p className="text-sm text-slate-500 font-medium max-w-xs">
                            You don't have any new notifications at the moment. We'll let you know when something comes up.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
