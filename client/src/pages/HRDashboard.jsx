import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import Sidebar from '../components/common/Sidebar.jsx';
import { useNavigate } from 'react-router-dom';

const HRDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');


    const stats = [
        { label: 'Total Employees', value: '1,245', icon: (
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        ), color: 'bg-blue-50' },
        { label: "Today's Attendance", value: '98%', icon: (
            <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ), color: 'bg-green-50' },
        { label: 'Pending Leaves', value: '12', icon: (
            <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ), color: 'bg-orange-50' },
        { label: 'Payroll Summary', value: '$45.2k', icon: (
            <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ), color: 'bg-purple-50' },
    ];

    const recentActivity = [
        { name: 'John Doe', action: 'Leave request submitted', time: '2 hours ago', initial: 'JD' },
        { name: 'Sarah Smith', action: 'Checked in', time: '4 hours ago', initial: 'SS' },
        { name: 'Michael Chen', action: 'Payslip generated', time: 'Yesterday', initial: 'MC' },
        { name: 'Emma Wilson', action: 'Onboarding completed', time: '2 days ago', initial: 'EW' },
        { name: 'David Brown', action: 'Profile updated', time: '3 days ago', initial: 'DB' },
    ];

    const quickActions = [
        { label: 'Add Employee', icon: '👤+' },
        { label: 'Approve Leave', icon: '✅' },
        { label: 'Run Payroll', icon: '💰' },
        { label: 'New Recruitment', icon: '🎯' },
        { label: 'View Reports', icon: '📊' },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50 font-inter">
            <Sidebar logout={logout} />

            {/* Main Content */}
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

                <div className="p-8">
                    {/* Welcome Section */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 font-sora">HR Dashboard</h1>
                        <p className="text-gray-500 mt-1">Monitor your workforce and manage HR operations efficiently.</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group relative overflow-hidden">
                                <div className={`absolute top-0 right-0 w-24 h-24 ${stat.color} rounded-bl-full opacity-50 -mr-8 -mt-8 transition-transform group-hover:scale-110`}></div>
                                <div className="relative flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                                        <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                                    </div>
                                    <div className={`p-3 rounded-xl ${stat.color} transition-transform group-hover:rotate-12`}>
                                        {stat.icon}
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-green-600 bg-green-50 w-fit px-2 py-1 rounded-lg">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                                    </svg>
                                    <span>2.4% vs last month</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Recent Activity Panel */}
                        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                                <h4 className="text-lg font-bold text-gray-900 font-sora">Recent Activity</h4>
                                <button className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">View All Items</button>
                            </div>
                            <div className="p-6 space-y-6">
                                {recentActivity.map((activity, idx) => (
                                    <div key={idx} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm border-2 border-white shadow-sm ring-1 ring-blue-100">
                                                {activity.initial}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{activity.name}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">{activity.action}</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md">{activity.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions Panel */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
                            <h4 className="text-lg font-bold text-gray-900 font-sora mb-6">Quick Actions</h4>
                            <div className="space-y-3">
                                {quickActions.map((action, idx) => (
                                    <button 
                                        key={idx} 
                                        className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-blue-500 hover:bg-blue-50/30 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 group text-left"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl group-hover:scale-110 transition-transform">{action.icon}</span>
                                            <span className="text-sm font-bold text-gray-700 group-hover:text-blue-700">{action.label}</span>
                                        </div>
                                        <svg className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                ))}
                            </div>
                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <div className="bg-navy-900 rounded-2xl p-6 text-white relative overflow-hidden">
                                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-600 rounded-full blur-2xl opacity-50"></div>
                                    <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-1">PRO PLAN</p>
                                    <h5 className="text-lg font-bold mb-2">Upgrade to Pro</h5>
                                    <p className="text-xs text-gray-400 mb-4 leading-relaxed">Unlock advanced analytics and automated recruitment workflows.</p>
                                    <button className="w-full bg-blue-600 hover:bg-blue-700 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95">Upgrade Now</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

        </div>
    );
};

export default HRDashboard;
