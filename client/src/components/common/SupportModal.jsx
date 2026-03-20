import React, { useState } from 'react';
import { X, Send, Mail, Phone, ShieldAlert, CheckCircle2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const SupportModal = ({ isOpen, onClose, type }) => {
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        subject: '',
        message: '',
        issueType: 'technical',
        description: ''
    });

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        // Dummy API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setSubmitting(false);
        toast.success(
            type === 'HR' 
                ? 'Your message has been sent to HR successfully!' 
                : 'IT Support ticket created successfully!',
            {
                style: {
                    borderRadius: '12px',
                    background: '#1e293b',
                    color: '#fff',
                },
            }
        );
        onClose();
        setFormData({ subject: '', message: '', issueType: 'technical', description: '' });
    };

    const isHR = type === 'HR';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 overflow-hidden animate-in fade-in duration-300">
            <div 
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                onClick={onClose}
            />
            
            <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
                {/* Header */}
                <div className="p-8 pb-4 flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-sm`}>
                            {isHR ? <Mail size={28} /> : <ShieldAlert size={28} />}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 font-sora tracking-tight">
                                {isHR ? 'Contact HR' : 'IT Support Center'}
                            </h2>
                            <p className="text-sm text-slate-500 font-medium mt-0.5">
                                {isHR ? 'Connect with our HR team' : 'Facing technical issues? We\'re here.'}
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-6">
                    {isHR ? (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 transition-colors hover:bg-slate-100/50">
                                    <div className="flex items-center gap-2 mb-1.5 text-primary">
                                        <Mail size={14} className="opacity-70" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Support Email</span>
                                    </div>
                                    <p className="text-sm font-bold text-slate-900">hr@workzen.io</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 transition-colors hover:bg-slate-100/50">
                                    <div className="flex items-center gap-2 mb-1.5 text-emerald-600">
                                        <Phone size={14} className="opacity-70" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Helpline</span>
                                    </div>
                                    <p className="text-sm font-bold text-slate-900">+1 (800) 967-5936</p>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Subject</label>
                                    <input 
                                        required
                                        type="text"
                                        placeholder="Briefly describe your inquiry"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-5 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm font-medium placeholder:text-slate-400"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Your Message</label>
                                    <textarea 
                                        required
                                        rows="4"
                                        placeholder="How can we assist you today?"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-5 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm font-medium resize-none placeholder:text-slate-400"
                                        value={formData.message}
                                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Issue Category</label>
                                <div className="relative">
                                    <select 
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-5 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm font-medium appearance-none cursor-pointer"
                                        value={formData.issueType}
                                        onChange={(e) => setFormData({...formData, issueType: e.target.value})}
                                    >
                                        <option value="technical">Technical Glitch</option>
                                        <option value="account">Account & Security</option>
                                        <option value="hardware">Hardware / Equipment</option>
                                        <option value="software">Software Licensing</option>
                                        <option value="other">General Inquiry</option>
                                    </select>
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <ShieldAlert size={16} />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Problem Description</label>
                                <textarea 
                                    required
                                    rows="4"
                                    placeholder="Please describe the issue in detail..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-5 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm font-medium resize-none placeholder:text-slate-400"
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                />
                            </div>
                        </div>
                    )}

                    <div className="pt-2">
                        <button 
                            disabled={submitting}
                            type="submit"
                            style={{ background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 50%, #4f46e5 100%)' }}
                            className="w-full py-4 text-white font-bold rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
                        >
                            {submitting ? (
                                <Loader2 className="animate-spin" size={22} />
                            ) : (
                                <>
                                    <span className="tracking-wide">{isHR ? 'Send Request' : 'Submit Ticket'}</span>
                                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                                </>
                            )}
                        </button>
                    </div>
                </form>
                
                <div className="px-8 pb-8 text-center bg-slate-50/50">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.25em] flex items-center justify-center gap-3">
                        <span className="w-8 h-px bg-slate-200"></span>
                        Working for You
                        <span className="w-8 h-px bg-slate-200"></span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SupportModal;
