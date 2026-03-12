import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import toast from 'react-hot-toast';
import { 
    LayoutDashboard, 
    User, 
    Clock, 
    CalendarCheck, 
    FileText, 
    Bell, 
    LogOut,
    Home
} from 'lucide-react';

const Sidebar = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();

    const menuItems = [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/employee' },
        { label: 'My Profile', icon: User, path: '/dashboard/profile' },
        { label: 'Attendance', icon: Clock, path: '/dashboard/attendance' },
        { label: 'Leave Management', icon: CalendarCheck, path: '/dashboard/leaves' },
        { label: 'Payslips', icon: FileText, path: '/dashboard/payslips' },
        { label: 'Notifications', icon: Bell, path: '/dashboard/notifications' },
    ];

    const handleDisabledClick = (e, label) => {
        e.preventDefault();
        toast.success(`${label} will be available soon.`, {
            icon: '🚧',
            style: {
                borderRadius: '10px',
                background: '#1e293b',
                color: '#fff',
            },
        });
    };

    const isActive = (path) => location.pathname === path;

    return (
        <aside className="w-64 bg-slate-900 h-screen flex flex-col text-slate-300">
            {/* Logo Area */}
            <div className="p-6 flex items-center gap-3">
                <div className="w-9 h-9 rounded-[10px] bg-primary flex items-center justify-center shadow-lg">
                    <Home className="text-white" size={20} />
                </div>
                <span className="font-sora font-bold text-xl text-white">
                    Work<span className="text-primary">Zen</span>
                </span>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.disabled ? '#' : item.path}
                        onClick={(e) => item.disabled && handleDisabledClick(e, item.label)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                            item.disabled 
                                ? 'opacity-60 cursor-not-allowed hover:bg-transparent' 
                                : isActive(item.path)
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                    : 'hover:bg-slate-800 hover:text-white'
                        }`}
                    >
                        <item.icon 
                            size={20} 
                            className={`${!item.disabled && isActive(item.path) ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} 
                        />
                        <span className="font-medium">{item.label}</span>
                    </Link>
                ))}
            </nav>

            {/* Logout Section */}
            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
