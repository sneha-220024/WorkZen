import React, { useContext, useState, useRef, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { Search, Bell, User, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown.jsx';

const DashboardHeader = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const profileRef = useRef(null);
    const searchRef = useRef(null);

    const menuItems = [
        { name: 'Dashboard', path: '/dashboard/employee', icon: User }, // Use generic icon or existing ones
        { name: 'My Profile', path: '/dashboard/profile', icon: User },
        { name: 'Attendance', path: '/dashboard/attendance', icon: Clock },
        { name: 'Leave Management', path: '/dashboard/leaves', icon: Clock },
        { name: 'Payslips', path: '/dashboard/payslips', icon: Bell },
        { name: 'Notifications', path: '/dashboard/notifications', icon: Bell },
    ];

    const filteredItems = menuItems.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handle click outside for both dropdowns
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileDropdownOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchOpen(false);
            }
        };

        if (isProfileDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isProfileDropdownOpen]);

    const handleNotificationClick = () => {
        navigate('/dashboard/notifications');
    };

    return (
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between shadow-sm z-10">
            {/* Search Bar */}
            <div className="flex-1 max-w-md relative" ref={searchRef}>
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search for something..." 
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setIsSearchOpen(true);
                        }}
                        onFocus={() => setIsSearchOpen(true)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
                    />
                </div>

                {/* Search Results Dropdown */}
                {isSearchOpen && searchQuery && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        {filteredItems.length > 0 ? (
                            filteredItems.map((item, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        navigate(item.path);
                                        setIsSearchOpen(false);
                                        setSearchQuery('');
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors group text-left"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                        <item.icon size={16} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 leading-tight">
                                            {highlightMatch(item.name, searchQuery)}
                                        </p>
                                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-0.5">Navigate to {item.name}</p>
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="px-4 py-8 text-center">
                                <Search className="mx-auto text-slate-200 mb-2" size={32} />
                                <p className="text-sm font-bold text-slate-400">No results found for "{searchQuery}"</p>
                                <p className="text-xs text-slate-400 mt-1">Try searching for something else</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-6">
                {/* Notifications */}
                <button 
                    onClick={handleNotificationClick}
                    className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors group"
                >
                    <Bell size={22} className="group-hover:text-primary transition-colors" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                {/* Vertical Divider */}
                <div className="h-8 w-px bg-slate-200"></div>

                {/* User Profile */}
                <div className="relative" ref={profileRef}>
                    <div 
                        className="flex items-center gap-4 cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-all duration-200"
                        onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    >
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-slate-900 leading-tight">{user?.name || 'Employee'}</p>
                            <p className="text-xs font-medium text-slate-500 capitalize">{user?.role || 'Guest'}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary overflow-hidden shadow-sm ring-2 ring-transparent hover:ring-primary/20 transition-all">
                            {user?.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <p className="text-lg font-bold">{user?.name ? user.name[0].toUpperCase() : 'U'}</p>
                            )}
                        </div>
                    </div>

                    {/* Profile Dropdown */}
                    {isProfileDropdownOpen && (
                        <ProfileDropdown 
                            user={user} 
                            logout={logout} 
                            onClose={() => setIsProfileDropdownOpen(false)} 
                        />
                    )}
                </div>
            </div>
        </header>
    );
};

// Helper function to highlight matching text
const highlightMatch = (text, query) => {
    if (!query) return text;
    // Escape special regex characters to prevent errors
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escapedQuery})`, 'gi'));
    return parts.map((part, i) => 
        part.toLowerCase() === query.toLowerCase() 
            ? <span key={i} className="text-primary bg-primary/5">{part}</span> 
            : part
    );
};

export default DashboardHeader;
