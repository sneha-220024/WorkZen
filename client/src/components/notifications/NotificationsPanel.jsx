import React, { useState, useEffect, useContext } from 'react';
import { 
    CalendarClock, 
    UserPlus, 
    BadgeDollarSign, 
    Clock, 
    Settings,
    Check,
    Loader2
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext.jsx';
import api from '../../services/api';
import { timeAgo } from '../../utils/helpers';

const NotificationsPanel = () => {
    const { user } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchNotifications = async () => {
        try {
            if (!user || !user._id) return;
            
            const response = await api.get(`/notifications/${user._id}`);
            if (response.data.success) {
                setNotifications(response.data.data);
            }
        } catch (err) {
            console.error('Error fetching notifications:', err);
            setError('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        
        // Refresh notifications every minute
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, [user?._id]);

    const markAllAsRead = async () => {
        try {
            if (!user || !user._id) return;
            
            const response = await api.patch(`/notifications/read-all/${user._id}`);
            if (response.data.success) {
                setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            }
        } catch (err) {
            console.error('Error marking all as read:', err);
        }
    };

    const getIconDetails = (type) => {
        switch (type) {
            case 'leave':
                return {
                    icon: CalendarClock,
                    iconColor: 'text-orange-600',
                    iconBg: 'bg-orange-100'
                };
            case 'attendance':
                return {
                    icon: Clock,
                    iconColor: 'text-red-600',
                    iconBg: 'bg-red-100'
                };
            case 'hr':
                return {
                    icon: UserPlus,
                    iconColor: 'text-blue-600',
                    iconBg: 'bg-blue-100'
                };
            case 'payroll':
                return {
                    icon: BadgeDollarSign,
                    iconColor: 'text-purple-600',
                    iconBg: 'bg-purple-100'
                };
            default:
                return {
                    icon: Settings,
                    iconColor: 'text-slate-600',
                    iconBg: 'bg-slate-100'
                };
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    if (loading) {
        return (
            <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 flex flex-col h-full items-center justify-center font-inter p-8">
                <Loader2 size={40} className="text-blue-600 animate-spin mb-4" />
                <p className="text-slate-500 font-medium">Loading notifications...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 flex flex-col h-full overflow-hidden font-inter">
            {/* Header */}
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-4">
                    <h2 className="text-[22px] font-bold text-slate-900 leading-none">Notifications</h2>
                    {unreadCount > 0 && (
                        <span className="bg-blue-100 text-blue-600 text-sm font-semibold px-3 py-1 rounded-full leading-none">
                            {unreadCount} unread
                        </span>
                    )}
                </div>
                {unreadCount > 0 && (
                    <button 
                        onClick={markAllAsRead}
                        className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-2 transition-colors hover:bg-blue-50 px-3 py-2 rounded-xl"
                    >
                        <Check size={16} />
                        Mark all read
                    </button>
                )}
            </div>

            {/* Notification List (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-8 space-y-4 bg-slate-50/50">
                {notifications.map((notification) => {
                    const iconDetails = getIconDetails(notification.type);
                    return (
                        <div 
                            key={notification._id}
                            className={`relative bg-white p-5 rounded-2xl border transition-all duration-200 hover:shadow-md flex items-start gap-5
                                ${!notification.isRead 
                                    ? 'border-blue-100 shadow-sm' 
                                    : 'border-slate-100 shadow-sm opacity-80 hover:opacity-100'
                                }`
                            }
                        >
                            {/* Unread Indicator Bar */}
                            {!notification.isRead && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-blue-600 rounded-r-lg"></div>
                            )}

                            {/* Icon */}
                            <div className={`w-12 h-12 shrink-0 rounded-[14px] flex items-center justify-center ${iconDetails.iconBg} ${iconDetails.iconColor}`}>
                                <iconDetails.icon size={24} strokeWidth={2} />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0 pt-0.5">
                                <h4 className="text-base font-bold text-slate-900 truncate">
                                    {notification.title}
                                </h4>
                                <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                                    {notification.message}
                                </p>
                            </div>

                            {/* Timestamp */}
                            <div className="shrink-0 text-xs font-medium text-slate-400 pt-1.5 whitespace-nowrap">
                                {timeAgo(notification.createdAt)}
                            </div>
                        </div>
                    );
                })}
                
                {notifications.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
                            <Check size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">All caught up!</h3>
                        <p className="text-slate-500 text-sm">You have no new notifications.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsPanel;
