import React from 'react';

const NotificationItem = ({ notification, onRead }) => {

    // Choose icon and color styling based on notification 'type'
    const getIconInfo = (type) => {
        switch (type) {
            case 'leave_approval':
                return {
                    colorClass: 'text-green-600 bg-green-100',
                    icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                    )
                };
            case 'payslip':
                return {
                    colorClass: 'text-blue-600 bg-blue-100',
                    icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="16" x2="12" y2="12" />
                            <line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                    )
                };
            case 'policy':
            case 'reminder':
                return {
                    colorClass: 'text-orange-500 bg-orange-100',
                    icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                    )
                };
            default:
                return {
                    colorClass: 'text-gray-600 bg-gray-100',
                    icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12.01" y2="8" />
                            <polyline points="11 12 12 12 12 16 13 16" />
                        </svg>
                    )
                };
        }
    };

    const styleData = getIconInfo(notification.type);

    return (
        <div
            onClick={() => onRead(notification)}
            className={`group relative flex items-start gap-4 p-5 mb-3 bg-white rounded-2xl shadow-sm border border-border-color cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 ${!notification.isRead ? 'border-primary/30 bg-primary/5' : ''}`}
        >
            {/* Left border indicator for unread */}
            {!notification.isRead && (
                <div className="absolute left-0 top-4 bottom-4 w-1 bg-primary rounded-r-md"></div>
            )}

            {/* Icon Box */}
            <div className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full ${styleData.colorClass}`}>
                {styleData.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pr-6">
                <div className="flex justify-between items-baseline mb-1">
                    <h4 className={`text-base font-semibold truncate ${!notification.isRead ? 'text-primary' : 'text-text-primary'}`}>
                        {notification.title}
                    </h4>
                    <span className="text-xs font-medium text-text-secondary whitespace-nowrap ml-4">
                        {notification.timestamp}
                    </span>
                </div>
                <p className="text-sm text-text-secondary line-clamp-2">
                    {notification.message}
                </p>
            </div>

            {/* Unread Blue Dot Indicator */}
            <div className="flex-shrink-0 w-3 flex justify-center mt-2">
                {!notification.isRead && (
                    <span className="block w-2.5 h-2.5 bg-primary rounded-full shadow-sm"></span>
                )}
            </div>
        </div>
    );
};

export default NotificationItem;
