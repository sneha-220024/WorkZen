import React, { useState } from 'react';
import { X } from 'lucide-react';

const RequestFormModal = ({ onClose, onSubmit, defaultType }) => {
    const [formData, setFormData] = useState({
        type: defaultType || 'General Request',
        subject: '',
        description: '',
        priority: 'Medium'
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.type) newErrors.type = 'Request Type is required';
        if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.priority) newErrors.priority = 'Priority is required';
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
                <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-slate-100">
                    <h3 className="text-xl font-bold text-slate-900 font-sora">New Request</h3>
                    <button 
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Request Type *</label>
                        <select 
                            name="type" 
                            value={formData.type} 
                            onChange={handleChange}
                            className={`w-full p-3 bg-slate-50 border ${errors.type ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm`}
                        >
                            <option value="Salary Hike">Salary Hike Request</option>
                            <option value="Complaint">Complaint Against Employee</option>
                            <option value="General Request">General Request</option>
                        </select>
                        {errors.type && <p className="text-xs text-red-500 mt-1">{errors.type}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Subject *</label>
                        <input 
                            type="text" 
                            name="subject" 
                            value={formData.subject} 
                            onChange={handleChange}
                            placeholder="Brief subject of your request" 
                            className={`w-full p-3 bg-slate-50 border ${errors.subject ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm`}
                        />
                        {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Description *</label>
                        <textarea 
                            name="description" 
                            value={formData.description} 
                            onChange={handleChange}
                            rows="4"
                            placeholder="Detailed description of your request" 
                            className={`w-full p-3 bg-slate-50 border ${errors.description ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm resize-none`}
                        ></textarea>
                        {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Priority Level *</label>
                            <select 
                                name="priority" 
                                value={formData.priority} 
                                onChange={handleChange}
                                className={`w-full p-3 bg-slate-50 border ${errors.priority ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm`}
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                            {errors.priority && <p className="text-xs text-red-500 mt-1">{errors.priority}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Attach File (Optional)</label>
                            <input 
                                type="file" 
                                className="w-full text-sm text-slate-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer pt-1"
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-end gap-3 mt-6">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-6 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            className="px-6 py-2.5 text-sm font-bold text-white bg-primary hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95"
                        >
                            Submit Request
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RequestFormModal;
