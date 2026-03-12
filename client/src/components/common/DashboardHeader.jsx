import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { Search, Bell, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DashboardHeader = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleNotificationClick = () => {
        navigate('/dashboard/notifications');
    };

    return (
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between shadow-sm z-10">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search for something..." 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                </div>
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
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-slate-900 leading-tight">{user?.name || 'Employee'}</p>
                        <p className="text-xs font-medium text-slate-500 capitalize">{user?.role || 'Guest'}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary overflow-hidden shadow-sm">
                        {user?.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            <User size={20} />
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;
