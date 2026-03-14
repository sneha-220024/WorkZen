import React, { useState } from 'react';
import { 
    CalendarClock, 
    UserPlus, 
    BadgeDollarSign, 
    Clock, 
    Settings,
    Check
} from 'lucide-react';

const HRNotificationsPanel = () => {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: 'Leave Request Pending',
            description: 'Sarah Johnson requested 3 days casual leave',
            time: '10 min ago',
            icon: CalendarClock,
            iconColor: 'text-orange-600',
            iconBg: 'bg-orange-100',
            isRead: false
        },
        {
            id: 2,
            title: 'New Employee Joined',
            description: 'Chris Patel has been added to Engineering',
            time: '1 hr ago',
            icon: UserPlus,
            iconColor: 'text-blue-600',
            iconBg: 'bg-blue-100',
            isRead: false
        },
        {
            id: 3,
            title: 'Payroll Processed',
            description: 'March payroll batch 1 completed — 189 employees',
            time: '3 hrs ago',
            icon: BadgeDollarSign,
            iconColor: 'text-purple-600',
            iconBg: 'bg-purple-100',
            isRead: true
        },
        {
            id: 4,
            title: 'Attendance Alert',
            description: 'James Brown checked in late today at 10:15 AM',
            time: '4 hrs ago',
            icon: Clock,
            iconColor: 'text-red-600',
            iconBg: 'bg-red-100',
            isRead: true
        },
        {
            id: 5,
            title: 'System Update',
            description: 'WorkZen v2.4 deployed with new analytics features',
            time: '1 day ago',
            icon: Settings,
            iconColor: 'text-slate-600',
            iconBg: 'bg-slate-100',
            isRead: true
        }
    ]);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    };

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
                    className="text-slate-600 hover:text-blue-600 text-sm font-bold flex items-center gap-2 transition-all hover:bg-blue-50 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-blue-200"
                >
                    <Check size={18} />
                    Mark all read
                </button>
            </div>

            {/* Notification List (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-8 space-y-5 bg-[#F8FAFC]">
                {notifications.map((notification) => (
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
                ))}
                
                {notifications.length === 0 && (
                    <div className="text-center py-20 animate-in fade-in zoom-in duration-500">
                        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-50">
                            <div className="w-16 h-16 bg-blue-50/50 rounded-2xl flex items-center justify-center text-blue-500">
                                <Check size={36} strokeWidth={2.5} />
                            </div>
                        </div>
                        <h3 className="text-[22px] font-bold text-slate-900 mb-2">All caught up!</h3>
                        <p className="text-slate-400 text-base font-medium max-w-[280px] mx-auto">
                            You've read all your notifications. Check back later for updates.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HRNotificationsPanel;
