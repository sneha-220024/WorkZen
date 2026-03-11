import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import Sidebar from '../components/common/Sidebar.jsx';

const Notifications = () => {
    const { user, logout } = useContext(AuthContext);
    const [searchQuery, setSearchQuery] = useState('');

    const notifications = [
        {
            id: 1,
            title: 'Leave Request Pending',
            description: 'Sarah Johnson requested 3 days casual leave',
            time: '10 min ago',
            type: 'leave',
            unread: true,
            icon: (
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
            )
        },
        {
            id: 2,
            title: 'New Employee Joined',
            description: 'Chris Patel has been added to Engineering',
            time: '1 hr ago',
            type: 'onboarding',
            unread: true,
            icon: (
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                </div>
            )
        },
        {
            id: 3,
            title: 'Payroll Processed',
            description: 'March payroll batch 1 completed — 189 employees',
            time: '3 hrs ago',
            type: 'payroll',
            unread: false,
            icon: (
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
            )
        },
        {
            id: 4,
            title: 'Attendance Alert',
            description: 'James Brown checked in late today at 10:15 AM',
            time: '4 hrs ago',
            type: 'attendance',
            unread: false,
            icon: (
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
            )
        },
        {
            id: 5,
            title: 'System Update',
            description: 'WorkZen v2.4 deployed with new analytics features',
            time: '1 day ago',
            type: 'system',
            unread: false,
            icon: (
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
            )
        },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50 font-inter">
            <Sidebar logout={logout} />

            <main className="flex-1 ml-64 flex flex-col">
                {/* Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-40">
                    <div className="relative w-96 group">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </span>
                        <input
                            type="text"
                            placeholder="Search employees, reports..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-100 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors relative">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 00-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="h-8 w-px bg-gray-200 mx-1"></div>
                        <div className="flex items-center gap-3 pl-1">
                            <div className="text-right">
                                <p className="text-sm font-bold text-gray-900 leading-none">{user?.name || 'HR Manager'}</p>
                                <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">HR Manager</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-blue-100 border-2 border-white shadow-sm flex items-center justify-center text-blue-600 font-bold overflow-hidden">
                                {user?.name?.charAt(0) || 'H'}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-8 max-w-4xl">
                    {/* Title Section */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 font-sora">Notifications</h1>
                            <p className="text-sm text-blue-600 font-medium mt-1">2 unread</p>
                        </div>
                        <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm active:scale-95">
                            Mark all read
                        </button>
                    </div>

                    {/* Notifications List */}
                    <div className="space-y-4">
                        {notifications.map((notification) => (
                            <div 
                                key={notification.id} 
                                className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 group ${
                                    notification.unread 
                                        ? 'bg-blue-50/50 border-blue-100 shadow-sm' 
                                        : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm'
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="transition-transform group-hover:scale-110 duration-200">
                                        {notification.icon}
                                    </div>
                                    <div>
                                        <h3 className={`text-sm font-bold ${notification.unread ? 'text-gray-900' : 'text-gray-700'}`}>
                                            {notification.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-0.5">
                                            {notification.description}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-xs font-medium text-gray-400 whitespace-nowrap">
                                    {notification.time}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Notifications;
