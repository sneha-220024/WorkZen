import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, ChevronRight } from 'lucide-react';

const ProfileDropdown = ({ user, logout, onClose }) => {
    const navigate = useNavigate();

    const handleViewProfile = () => {
        navigate('/dashboard/profile');
        onClose();
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
        onClose();
    };

    const initials = user?.name 
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() 
        : 'U';

    return (
        <div 
            className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 py-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
        >
            {/* User Info Section */}
            <div className="px-6 py-4 flex flex-col items-center border-b border-slate-50">
                <div className="w-20 h-20 rounded-full bg-primary/10 border-4 border-white shadow-md flex items-center justify-center text-primary text-2xl font-bold mb-3 overflow-hidden">
                    {user?.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                        initials
                    )}
                </div>
                <h3 className="text-lg font-bold text-slate-900 leading-tight">{user?.name || 'Employee'}</h3>
                <p className="text-sm font-medium text-slate-500 mb-4">{user?.email || 'N/A'}</p>
                
                <button 
                    onClick={handleViewProfile}
                    className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-xl transition-colors border border-slate-200 flex items-center justify-center gap-2 group"
                >
                    View Profile
                    <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
            </div>

            {/* Actions Section */}
            <div className="px-2 pt-2">
                <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-bold group"
                >
                    <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
                        <LogOut size={20} />
                    </div>
                    <span>Logout</span>
                </button>
            </div>
            
            <div className="px-6 py-2 mt-2">
                <p className="text-[10px] text-center text-slate-400 font-medium uppercase tracking-widest">
                    WorkZen Enterprise
                </p>
            </div>
        </div>
    );
};

export default ProfileDropdown;
