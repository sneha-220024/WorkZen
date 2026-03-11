import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Button from '../components/common/Button.jsx';
import { Shield, Key, Bell, Smartphone, ChevronRight } from 'lucide-react';

export default function Settings() {
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

    const handleSave = (e) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            toast.error("New passwords do not match");
            return;
        }
        toast.success("Account settings updated successfully");
        setPasswords({ current: '', new: '', confirm: '' });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
            <header>
                <h1 className="text-3xl font-bold text-slate-900 font-sora">General Settings</h1>
                <p className="text-slate-500 mt-1 font-medium">Manage your security and notification preferences</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Account Navigation */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm space-y-1">
                        <button className="w-full flex items-center justify-between p-4 bg-primary/5 text-primary rounded-2xl group">
                            <div className="flex items-center gap-3">
                                <Shield size={20} />
                                <span className="font-bold">Security</span>
                            </div>
                            <ChevronRight size={16} />
                        </button>
                        <button className="w-full flex items-center justify-between p-4 text-slate-400 hover:bg-slate-50 hover:text-slate-900 rounded-2xl group transition-all">
                            <div className="flex items-center gap-3">
                                <Bell size={20} />
                                <span className="font-bold">Notifications</span>
                            </div>
                            <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                        <button className="w-full flex items-center justify-between p-4 text-slate-400 hover:bg-slate-50 hover:text-slate-900 rounded-2xl group transition-all">
                            <div className="flex items-center gap-3">
                                <Smartphone size={20} />
                                <span className="font-bold">Connected Devices</span>
                            </div>
                            <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    </div>
                </div>

                {/* Settings Form */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                                <Key size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 font-sora">Update Password</h3>
                        </div>

                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Current Password</label>
                                    <input 
                                        type="password" 
                                        value={passwords.current} 
                                        onChange={e => setPasswords({...passwords, current: e.target.value})} 
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium" 
                                        required 
                                        placeholder="Enter current password"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">New Password</label>
                                        <input 
                                            type="password" 
                                            value={passwords.new} 
                                            onChange={e => setPasswords({...passwords, new: e.target.value})} 
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium" 
                                            required 
                                            placeholder="Minimum 8 characters"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Confirm Password</label>
                                        <input 
                                            type="password" 
                                            value={passwords.confirm} 
                                            onChange={e => setPasswords({...passwords, confirm: e.target.value})} 
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium" 
                                            required 
                                            placeholder="Re-type new password"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4">
                                <Button type="submit" className="w-full md:w-auto px-10 py-4 rounded-xl shadow-lg shadow-primary/20">
                                    Update Security Settings
                                </Button>
                            </div>
                        </form>
                    </div>

                    <div className="bg-emerald-50/50 p-8 rounded-[2rem] border border-emerald-100 flex items-start gap-4">
                        <div className="p-3 bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-500/20">
                            <Shield size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-emerald-900 mb-1">Enhanced Security</h4>
                            <p className="text-sm text-emerald-700/80 leading-relaxed font-medium">Your account is currently protected by 2-factor authentication. This adds an extra layer of security to your profile.</p>
                            <button className="text-emerald-600 text-sm font-bold mt-4 hover:underline">Manage 2FA Settings</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
