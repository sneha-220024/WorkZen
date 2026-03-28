import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
import logo from '../../assets/workzen-logo-full.png';

const Sidebar = ({ onNotificationClick, isNotificationsActive }) => {
    const { logout } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

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

    const isActive = (path) => {
        if (isNotificationsActive) return false;
        return location.pathname === path;
    };

    return (
        <aside className="w-64 bg-slate-900 h-screen flex flex-col text-slate-300">
            {/* Logo Area */}
            <div className="p-6 flex items-center justify-center border-b border-slate-800">
                <img src={logo} alt="WorkZen Logo" className="logo max-w-[180px]" />
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.disabled ? '#' : item.path}
                        onClick={(e) => {
                            if (item.disabled) {
                                handleDisabledClick(e, item.label);
                            } else if (item.label === 'Notifications' && onNotificationClick) {
                                e.preventDefault();
                                onNotificationClick();
                            }
                        }}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                            item.disabled 
                                ? 'opacity-60 cursor-not-allowed hover:bg-transparent' 
                                : (isActive(item.path) || (item.label === 'Notifications' && isNotificationsActive))
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                    : 'hover:bg-slate-800 hover:text-white'
                        }`}
                    >
                        <item.icon 
                            size={20} 
                            className={`${!item.disabled && (isActive(item.path) || (item.label === 'Notifications' && isNotificationsActive)) ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} 
                        />
                        <span className="font-medium">{item.label}</span>
                    </Link>
                ))}
            </nav>

            {/* Logout Section */}
            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={() => {
                        logout();
                        navigate('/login');
                    }}
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
