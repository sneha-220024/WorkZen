import React, { useContext, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import { 
    LayoutDashboard, 
    Users, 
    Calendar, 
    ClipboardList, 
    BadgeDollarSign, 
    FileText, 
    Bell, 
    Search,
    User as UserIcon
} from 'lucide-react';
import HRNotificationsPanel from '../notifications/HRNotificationsPanel.jsx';

const HRLayout = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [showNotifications, setShowNotifications] = useState(false);

    const sidebarItems = [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/hr' },
        { label: 'Employees', icon: Users, path: '/dashboard/hr/employees' },
        { label: 'Attendance', icon: Calendar, path: '/dashboard/hr/attendance' },
        { label: 'Leave Management', icon: ClipboardList, path: '/dashboard/hr/leaves' },
        { label: 'Payroll', icon: BadgeDollarSign, path: '/dashboard/hr/payroll' },
        { label: 'Payslip', icon: FileText, path: '/dashboard/hr/payslips' },
        { label: 'Notifications', icon: Bell, path: '/dashboard/hr/notifications' },
    ];

    const isActive = (item) => {
        if (item.label === 'Notifications') return showNotifications;
        return !showNotifications && location.pathname === item.path;
    };

    return (
        <div className="flex min-h-screen bg-[#F5F7FB] font-inter">
            {/* Sidebar */}
            <aside className="w-64 bg-[#1E2640] text-slate-300 flex flex-col fixed h-full z-20">
                <div className="p-8">
                    <h1 className="font-sora font-bold text-2xl text-white">Work<span className="text-blue-400">Zen</span></h1>
                </div>
                <nav className="flex-1 px-4 space-y-2">
                    {sidebarItems.map((item, idx) => (
                        <div 
                            key={idx} 
                            onClick={() => {
                                if (item.label === 'Notifications') {
                                    setShowNotifications(true);
                                } else {
                                    setShowNotifications(false);
                                    navigate(item.path);
                                }
                            }}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 ${
                                isActive(item)
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                                : 'hover:bg-slate-800 hover:text-white'
                            }`}
                        >
                            <item.icon size={20} className={isActive(item) ? 'text-white' : 'text-slate-400'} />
                            <span className="font-medium">{item.label}</span>
                        </div>
                    ))}
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 ml-64 flex flex-col min-h-screen">
                {/* Header */}
                <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                    <div className="flex-1 max-w-xl">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input 
                                type="text" 
                                placeholder="Search employees, reports..." 
                                className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button 
                            onClick={() => setShowNotifications(!showNotifications)}
                            className={`relative p-2 rounded-xl transition-colors ${showNotifications ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            <Bell size={22} />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        
                        <div className="h-8 w-px bg-slate-200"></div>

                        <div className="flex items-center gap-3 pl-2">
                            <div className="text-right">
                                <p className="text-sm font-bold text-slate-900 leading-tight">{user?.name || 'HR Manager'}</p>
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">HR Manager</p>
                            </div>
                            <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 overflow-hidden shadow-sm">
                                <UserIcon size={22} />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content with conditional Notifications Panel */}
                <div className="p-8 flex-1 flex flex-col">
                    {showNotifications ? (
                        <div className="flex-1" style={{ height: 'calc(100vh - 144px)' }}>
                            <HRNotificationsPanel />
                        </div>
                    ) : (
                        <Outlet />
                    )}
                </div>
            </main>
        </div>
    );
};

export default HRLayout;
