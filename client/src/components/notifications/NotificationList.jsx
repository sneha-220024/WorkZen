import React from 'react';
import NotificationItem from './NotificationItem.jsx';

const NotificationList = ({ notifications, onRead }) => {
    return (
        <div className="w-full mt-6">
            {notifications && notifications.length > 0 ? (
                notifications.map(notification => (
                    <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onRead={onRead}
                    />
                ))
            ) : (
                <div className="bg-white rounded-2xl p-12 text-center shadow-card border border-border-color">
                    <div className="flex justify-center mb-4">
                        <span className="text-4xl text-text-secondary">📭</span>
                    </div>
                    <h4 className="font-sora font-semibold text-lg text-text-primary mb-2">No Notifications</h4>
                    <p className="text-text-secondary">You don't have any system notifications at the moment.</p>
                </div>
            )}
        </div>
    );
};

export default NotificationList;
