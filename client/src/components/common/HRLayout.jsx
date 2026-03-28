import React, { useContext, useState, useRef, useEffect } from 'react';
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
    User as UserIcon,
    LogOut,
    MessageSquare,
    BarChart3,
    Home
} from 'lucide-react';
import HRNotificationsPanel from '../notifications/HRNotificationsPanel.jsx';
import HRProfilePopup from './HRProfilePopup.jsx';

const HRLayout = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfilePopup, setShowProfilePopup] = useState(false);
    const profileRef = useRef(null);

    // ── Search state ──────────────────────────────────────────────────────────
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef(null);

    // Close search dropdown when clicking outside
    useEffect(() => {
        const handleOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleOutside);
        return () => document.removeEventListener('mousedown', handleOutside);
    }, []);

    const sidebarItems = [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/hr' },
        { label: 'Employees', icon: Users, path: '/dashboard/hr/employees' },
        { label: 'Attendance', icon: Calendar, path: '/dashboard/hr/attendance' },
        { label: 'Schedule', icon: Calendar, path: '/dashboard/hr/schedule' },
        { label: 'Attendance Analytics', icon: BarChart3, path: '/dashboard/hr/leaves' },
        { label: 'Payroll', icon: BadgeDollarSign, path: '/dashboard/hr/payroll' },
        { label: 'Payslip', icon: FileText, path: '/dashboard/hr/payslips' },
        { label: 'Employee Requests', icon: MessageSquare, path: '/dashboard/hr/requests' },
        { label: 'Notifications', icon: Bell, path: '/dashboard/hr/notifications' },
    ];

    const isActive = (item) => {
        if (item.label === 'Notifications') return showNotifications;
        return !showNotifications && location.pathname === item.path;
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen bg-[#F5F7FB] font-inter">
            {/* Sidebar */}
            <aside className="w-64 bg-[#1E2640] text-slate-300 flex flex-col fixed h-full z-20 shadow-xl">
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
                    {/* ── Search bar with live sidebar-menu filtering ── */}
                    <div className="flex-1 max-w-xl relative" ref={searchRef}>
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setShowSuggestions(true);
                                }}
                                onFocus={() => searchQuery && setShowSuggestions(true)}
                                placeholder="Search menu items..."
                                className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => { setSearchQuery(''); setShowSuggestions(false); }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    aria-label="Clear search"
                                >
                                    ✕
                                </button>
                            )}
                        </div>

                        {/* Suggestions dropdown */}
                        {showSuggestions && searchQuery && (() => {
                            const filtered = sidebarItems.filter(item =>
                                item.label.toLowerCase().includes(searchQuery.toLowerCase())
                            );
                            return (
                                <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 overflow-hidden"
                                    style={{ animation: 'hrSearchIn 0.15s ease both' }}
                                >
                                    <style>{`@keyframes hrSearchIn { from { opacity:0; transform:translateY(-6px) } to { opacity:1; transform:translateY(0) } }`}</style>
                                    {filtered.length > 0 ? filtered.map((item, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                setShowNotifications(item.label === 'Notifications');
                                                if (item.label !== 'Notifications') navigate(item.path);
                                                setSearchQuery('');
                                                setShowSuggestions(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-5 py-3 hover:bg-blue-50 transition-colors group text-left"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                                                <item.icon size={16} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-800 leading-tight">
                                                    {highlightMatch(item.label, searchQuery)}
                                                </p>
                                                <p className="text-[11px] text-slate-400 mt-0.5">{item.path}</p>
                                            </div>
                                        </button>
                                    )) : (
                                        <div className="px-5 py-6 text-center">
                                            <Search className="mx-auto text-slate-200 mb-2" size={28} />
                                            <p className="text-sm font-semibold text-slate-400">No results for "{searchQuery}"</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })()}
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Home Button */}
                        <button 
                            onClick={() => navigate('/')}
                            className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-xl transition-colors group"
                            title="Home"
                        >
                            <Home size={22} className="group-hover:text-blue-600 transition-colors" />
                        </button>

                        <button 
                            onClick={() => setShowNotifications(!showNotifications)}
                            className={`relative p-2 rounded-xl transition-colors ${showNotifications ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            <Bell size={22} />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        
                        <div className="h-8 w-px bg-slate-200"></div>

                        {/* Profile Icon — clickable, anchors the popup */}
                        <div className="relative" ref={profileRef}>
                            <div
                                className="flex items-center gap-3 pl-2 cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-all duration-200"
                                onClick={() => setShowProfilePopup(prev => !prev)}
                                title="Account"
                            >
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-bold text-slate-900 leading-tight">{user?.name || 'HR Manager'}</p>
                                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">HR Manager</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white overflow-hidden shadow-sm ring-2 ring-transparent hover:ring-blue-300 transition-all select-none">
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-sm font-bold">
                                            {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'HR'}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Google-style Profile Popup */}
                            {showProfilePopup && (
                                <HRProfilePopup
                                    user={user}
                                    logout={logout}
                                    onClose={() => setShowProfilePopup(false)}
                                />
                            )}
                        </div>

                        <div className="h-8 w-px bg-slate-200"></div>

                        <button 
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-bold group border border-transparent"
                        >
                            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
                                <LogOut size={20} />
                            </div>
                            <span className="text-sm">Logout</span>
                        </button>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 flex flex-col">
                    {showNotifications ? (
                        <div className="p-8 flex-1" style={{ height: 'calc(100vh - 144px)' }}>
                            <HRNotificationsPanel />
                        </div>
                    ) : (
                        <div className="p-8">
                             <Outlet />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

// Highlight matching text in search results
const highlightMatch = (text, query) => {
    if (!query) return text;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
    return parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase()
            ? <span key={i} className="text-blue-600 bg-blue-50 rounded px-0.5">{part}</span>
            : part
    );
};

export default HRLayout;

