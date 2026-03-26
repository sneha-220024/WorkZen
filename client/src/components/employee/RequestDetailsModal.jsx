import React from 'react';
import { X, Calendar, AlertCircle } from 'lucide-react';

const RequestDetailsModal = ({ onClose, request }) => {
    if (!request) return null;

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Approved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
            case 'In Review': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-amber-100 text-amber-700 border-amber-200';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
                <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-slate-100">
                    <h3 className="text-xl font-bold text-slate-900 font-sora">Request Details</h3>
                    <button 
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
                
                <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-md">
                                {request.id}
                            </span>
                            <h4 className="text-lg font-bold text-slate-900 mt-2">{request.subject}</h4>
                            <p className="text-sm font-medium text-slate-500 mt-1">{request.type}</p>
                        </div>
                        <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getStatusStyle(request.status)}`}>
                            {request.status}
                        </span>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-sm text-slate-700 whitespace-pre-wrap">{request.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                            <Calendar className="text-slate-400" size={16} />
                            <div>
                                <p className="text-xs text-slate-400 font-medium">Date Submitted</p>
                                <p className="text-sm font-semibold text-slate-700">{request.date}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <AlertCircle className="text-slate-400" size={16} />
                            <div>
                                <p className="text-xs text-slate-400 font-medium">Priority</p>
                                <p className="text-sm font-semibold text-slate-700">{request.priority}</p>
                            </div>
                        </div>
                    </div>

                    {request.response && (
                        <div className="mt-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                            <h5 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2">HR/Admin Response</h5>
                            <p className="text-sm text-blue-900">{request.response}</p>
                        </div>
                    )}
                </div>

                <div className="p-6 pt-0 flex justify-end">
                    <button 
                        onClick={onClose}
                        className="px-6 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RequestDetailsModal;
