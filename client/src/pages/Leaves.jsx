import React from 'react';
import { CalendarCheck, Construction } from 'lucide-react';

const Leaves = () => {
    return (
        <div className="h-[calc(100vh-160px)] flex flex-col items-center justify-center text-center p-8 animate-in fade-in duration-700">
            <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center mb-6 shadow-xl shadow-primary/5 relative">
                <div className="absolute -top-2 -right-2 bg-amber-500 text-white p-2 rounded-full shadow-lg">
                    <Construction size={18} />
                </div>
                <CalendarCheck className="text-primary" size={48} />
            </div>
            
            <h1 className="text-4xl font-bold text-slate-900 font-sora mb-4">
                Leave Management
            </h1>
            
            <p className="text-slate-500 max-w-md text-lg font-medium leading-relaxed">
                We're currently refactoring our leave management system to provide you with a smoother experience. This module will be available soon.
            </p>

            <div className="mt-12 flex items-center gap-2 text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">
                <span className="w-8 h-[2px] bg-slate-100"></span>
                Coming Soon
                <span className="w-8 h-[2px] bg-slate-100"></span>
            </div>
        </div>
    );
};

export default Leaves;
