import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationList from '../components/notifications/NotificationList.jsx';

const NotificationsPage = () => {
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState([
        {
            id: '1',
            type: 'leave_approval',
            title: 'Leave Approved',
            message: 'Your vacation leave for Mar 20–22 has been approved.',
            timestamp: '2 hours ago',
            isRead: false,
            link: '/dashboard/employee/leave'
        },
        {
            id: '2',
            type: 'payslip',
            title: 'Payslip Available',
            message: 'Your February 2026 payslip is ready to download.',
            timestamp: '1 day ago',
            isRead: false,
            link: '/dashboard/employee/payslips'
        },
        {
            id: '3',
            type: 'policy',
            title: 'Policy Update',
            message: 'The remote work policy has been updated. Please review.',
            timestamp: '2 days ago',
            isRead: false,
            link: null
        },
        {
            id: '4',
            type: 'reminder',
            title: 'Attendance Reminder',
            message: 'You missed checkout yesterday. Please update your attendance.',
            timestamp: '3 days ago',
            isRead: true,
            link: '/dashboard/employee/attendance'
        }
    ]);

    const handleRead = (notification) => {
        // Mark as read immediately when clicked
        if (!notification.isRead) {
            setNotifications(prev => prev.map(notif =>
                notif.id === notification.id ? { ...notif, isRead: true } : notif
            ));
        }

        // Navigate if there's a link specified
        if (notification.link) {
            navigate(notification.link);
        }
    };

    return (
        <div className="w-full">
            <header className="mb-8">
                <h2 className="font-sora font-bold text-3xl text-text-primary mb-2">Notifications</h2>
                <p className="text-text-secondary">Stay updated with system notifications</p>
            </header>

            <NotificationList
                notifications={notifications}
                onRead={handleRead}
            />
        </div>
    );
};

export default NotificationsPage;
