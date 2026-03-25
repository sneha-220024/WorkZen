import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, UserPlus, Settings } from 'lucide-react';

const HRProfilePopup = ({ user, logout, onClose }) => {
    const navigate = useNavigate();
    const popupRef = useRef(null);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (popupRef.current && !popupRef.current.contains(e.target)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const initials = user?.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'HR';

    const handleSignOut = () => {
        logout();
        navigate('/login');
        onClose();
    };

    const handleManageAccount = () => {
        navigate('/dashboard/hr/settings');
        onClose();
    };

    return (
        <>
            {/* Backdrop (invisible, just for click-outside) */}
            <div className="fixed inset-0 z-40" onClick={onClose} />

            {/* Popup Card */}
            <div
                ref={popupRef}
                className="absolute right-0 top-[calc(100%+12px)] z-50 w-[340px] bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
                style={{
                    animation: 'hrPopupIn 0.18s cubic-bezier(0.22,1,0.36,1) both',
                }}
            >
                <style>{`
                    @keyframes hrPopupIn {
                        from { opacity: 0; transform: scale(0.93) translateY(-8px); }
                        to   { opacity: 1; transform: scale(1)    translateY(0);    }
                    }
                `}</style>

                {/* Header branding */}
                <div className="px-6 pt-5 pb-3 text-center border-b border-slate-100">
                    <span className="text-sm font-semibold text-[#1E2640]">
                        Work<span className="text-blue-500">Zen</span>
                    </span>
                </div>

                {/* Avatar + Name + Email */}
                <div className="flex flex-col items-center px-6 pt-6 pb-5">
                    {/* Circle Avatar */}
                    <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-3 select-none">
                        {user?.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-full" />
                        ) : (
                            initials
                        )}
                    </div>

                    <p className="text-base font-bold text-slate-900 leading-tight mb-0.5">
                        {user?.name || 'HR Manager'}
                    </p>
                    <p className="text-sm text-slate-500 mb-5">
                        {user?.email || 'hr@workzen.com'}
                    </p>

                    {/* Manage your account button */}
                    <button
                        onClick={handleManageAccount}
                        className="w-full py-2 px-5 rounded-full border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors duration-150 flex items-center justify-center gap-2"
                    >
                        <Settings size={15} />
                        Manage your account
                    </button>
                </div>

                {/* Divider */}
                <div className="border-t border-slate-100" />

                {/* Add another account */}
                <button
                    onClick={onClose}
                    className="w-full flex items-center gap-3 px-6 py-3.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-150"
                >
                    <div className="w-8 h-8 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400">
                        <UserPlus size={15} />
                    </div>
                    <span className="font-medium">Add another account</span>
                </button>

                {/* Divider */}
                <div className="border-t border-slate-100" />

                {/* Sign out */}
                <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-6 py-3.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-150"
                >
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                        <LogOut size={15} />
                    </div>
                    <span className="font-medium">Sign out</span>
                </button>

                {/* Footer */}
                <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-center">
                    <p className="text-[11px] text-slate-400">
                        <span className="hover:underline cursor-pointer">Privacy Policy</span>
                        {' • '}
                        <span className="hover:underline cursor-pointer">Terms of Service</span>
                    </p>
                </div>
            </div>
        </>
    );
};

export default HRProfilePopup;
