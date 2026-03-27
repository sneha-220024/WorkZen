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
    Home,
    Users,
    ClipboardList,
    BadgeDollarSign,
    HelpCircle
} from 'lucide-react';

const Sidebar = ({ onNotificationClick, isNotificationsActive }) => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    const userRole = user?.role?.toLowerCase() || 'employee';

    const employeeMenuItems = [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/employee' },
        { label: 'My Profile', icon: User, path: '/dashboard/profile' },
        { label: 'Attendance', icon: Clock, path: '/dashboard/attendance' },
        { label: 'Request Center', icon: HelpCircle, path: '/employee/request-center' },
        { label: 'Payslips', icon: FileText, path: '/dashboard/payslips' },
        { label: 'Notifications', icon: Bell, path: '/dashboard/notifications' },
    ];

    const hrMenuItems = [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/hr' },
        { label: 'Employees', icon: Users, path: '/dashboard/hr/employees' },
        { label: 'Attendance', icon: Clock, path: '/dashboard/hr/attendance' },
        { label: 'Leaves', icon: ClipboardList, path: '/dashboard/hr/leaves' },
        { label: 'Employee Requests', icon: HelpCircle, path: '/dashboard/hr/requests' },
        { label: 'Payroll', icon: BadgeDollarSign, path: '/dashboard/hr/payroll' },
        { label: 'Settings', icon: User, path: '/dashboard/hr/settings', disabled: true },
    ];

    const menuItems = userRole === 'hr' ? hrMenuItems : employeeMenuItems;

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
            <div className="p-6 flex items-center gap-3">
                <div className="w-9 h-9 rounded-[10px] bg-primary flex items-center justify-center shadow-lg hover:rotate-12 transition-transform cursor-pointer" onClick={() => navigate('/')}>
                    <Home className="text-white" size={20} />
                </div>
                <span className="font-sora font-bold text-xl text-white">
                    Work<span className="text-primary">Zen</span>
                </span>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
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
                                ? 'opacity-50 cursor-not-allowed hover:bg-transparent' 
                                : (isActive(item.path) || (item.label === 'Notifications' && isNotificationsActive))
                                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                    : 'hover:bg-slate-800/80 hover:text-white'
                        }`}
                    >
                        <item.icon 
                            size={20} 
                            className={`${!item.disabled && (isActive(item.path) || (item.label === 'Notifications' && isNotificationsActive)) ? 'text-white' : 'text-slate-500 group-hover:text-white transition-colors'}`} 
                        />
                        <span className="font-medium text-sm">{item.label}</span>
                    </Link>
                ))}
            </nav>

            {/* Logout Section */}
            <div className="p-4 border-t border-slate-800/50">
                <button
                    onClick={() => {
                        logout();
                        navigate('/login');
                        toast.success('Logged out successfully');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 group"
                >
                    <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium text-sm">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
