import React, { useState } from 'react';
import axios from 'axios';
import { X, Calendar, Clock, MessageSquare, CheckCircle, Link, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const ScheduleModal = ({ isOpen, onClose, employee }) => {
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        reason: 'Meeting',
        meetingLink: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [copied, setCopied] = useState(false);

    if (!isOpen || !employee) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.date || !formData.time || !formData.reason || !formData.meetingLink) {
            toast.error("Please fill all fields and generate meeting link");
            return;
        }

        try {
            setIsSubmitting(true);
            const userStr = localStorage.getItem('user');
            if (!userStr) return;
            const token = JSON.parse(userStr).token;

            const response = await axios.post(`http://localhost:5005/api/hr/schedules`, {
                employeeId: employee._id,
                employeeName: `${employee.firstName} ${employee.lastName}`,
                employeeEmail: employee.email,
                ...formData
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                toast.success("Schedule created and email sent successfully!");
                onClose();
            }
        } catch (error) {
            console.error("Error creating schedule", error);
            toast.error(error.response?.data?.message || "Failed to create schedule");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const generateLink = () => {
        setIsGenerating(true);
        
        // Mock loading effect
        setTimeout(() => {
            const part1 = Math.random().toString(36).substring(2, 5);
            const part2 = Math.random().toString(36).substring(2, 5);
            const part3 = Math.random().toString(36).substring(2, 5);
            const link = `https://meet.google.com/${part1}-${part2}-${part3}`;
            
            setFormData(prev => ({ ...prev, meetingLink: link }));
            setIsGenerating(false);
            toast.success("Meeting link generated!");
        }, 800);
    };

    const handleCopy = () => {
        if (!formData.meetingLink) return;
        navigator.clipboard.writeText(formData.meetingLink);
        setCopied(true);
        toast.success("Link copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-start justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto min-h-screen animate-in fade-in duration-300">
            <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden mt-20 mb-8 animate-in slide-in-from-bottom-8 duration-500">
                {/* Modal Header */}
                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900 font-sora">New Schedule</h3>
                        <p className="text-slate-500 text-sm mt-1 font-medium">For {employee.firstName} {employee.lastName}</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2.5 hover:bg-slate-100 rounded-full text-slate-400 transition-all hover:rotate-90 active:scale-90"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Modal Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Calendar size={14} className="text-blue-500" /> Date
                        </label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm font-semibold"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Clock size={14} className="text-blue-500" /> Time
                        </label>
                        <input
                            type="time"
                            value={formData.time}
                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm font-semibold"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <MessageSquare size={14} className="text-blue-500" /> Reason
                        </label>
                        <select
                            value={formData.reason}
                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm font-bold text-slate-700"
                            required
                        >
                            <option value="Meeting">Meeting</option>
                            <option value="Discussion">Discussion</option>
                            <option value="Review">Review</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <Link size={14} className="text-blue-500" /> Meeting Link
                            </span>
                            {formData.meetingLink && (
                                <button 
                                    type="button"
                                    onClick={handleCopy}
                                    className="text-blue-600 hover:text-blue-700 flex items-center gap-1 normal-case tracking-normal text-[10px]"
                                >
                                    {copied ? <Check size={12} /> : <Copy size={12} />}
                                    {copied ? 'Copied' : 'Copy Link'}
                                </button>
                            )}
                        </label>
                        <div className="relative group">
                            <input
                                type="text"
                                value={formData.meetingLink}
                                onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                                placeholder="Generate or enter meeting link"
                                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm font-semibold pr-32"
                                readOnly={!formData.meetingLink && !isGenerating}
                            />
                            <button
                                type="button"
                                onClick={generateLink}
                                disabled={isGenerating}
                                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isGenerating ? (
                                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : 'Generate'}
                            </button>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 bg-slate-50 text-slate-600 font-bold rounded-2xl hover:bg-slate-100 transition-all text-sm active:scale-95"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`flex-[2] py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <CheckCircle size={18} />
                                    Done
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ScheduleModal;
