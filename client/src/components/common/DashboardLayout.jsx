import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import DashboardHeader from './DashboardHeader.jsx';
import NotificationsPanel from '../notifications/NotificationsPanel.jsx';

const DashboardLayout = () => {
    const [showNotifications, setShowNotifications] = useState(false);
    const location = useLocation();

    // Hide notifications when route changes
    useEffect(() => {
        setShowNotifications(false);
    }, [location.pathname]);

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            {/* Sidebar */}
            <Sidebar 
                onNotificationClick={() => setShowNotifications(true)} 
                isNotificationsActive={showNotifications} 
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <DashboardHeader />

                {/* Main Content Scrollable */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-8 relative">
                    {showNotifications ? (
                        <div className="absolute inset-x-6 inset-y-6 md:inset-x-8 md:inset-y-8">
                            <NotificationsPanel />
                        </div>
                    ) : (
                        <Outlet />
                    )}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
