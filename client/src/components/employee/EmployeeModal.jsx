import React, { useState, useEffect } from 'react';
import { X, Send, Save, Eye } from 'lucide-react';
import axios from 'axios';

const EmployeeModal = ({ isOpen, onClose, onRefresh, mode = 'add', employeeData = null }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        department: '',
        designation: '',
        baseSalary: '',
        hra: '',
        allowance: '',
        taxPercent: '',
        address: '',
        emergencyContact: '',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (employeeData && (mode === 'edit' || mode === 'view')) {
            setFormData({
                firstName: employeeData.firstName || '',
                lastName: employeeData.lastName || '',
                email: employeeData.email || '',
                phone: employeeData.phone || '',
                department: employeeData.department || '',
                designation: employeeData.designation || '',
                baseSalary: employeeData.salaryStructure?.baseSalary || employeeData.baseSalary || '',
                hra: employeeData.salaryStructure?.hra || '',
                allowance: employeeData.salaryStructure?.allowance || '',
                taxPercent: employeeData.salaryStructure?.taxPercent || '',
                address: employeeData.address || '',
                emergencyContact: employeeData.emergencyContact || '',
            });
        } else {
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                department: '',
                designation: '',
                baseSalary: '',
                hra: '',
                allowance: '',
                taxPercent: '',
                address: '',
                emergencyContact: '',
            });
        }
        setErrors({});
    }, [employeeData, mode, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        if (mode === 'view') return;
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (mode === 'view') return;
        
        setLoading(true);
        setErrors({});

        const payload = {
            ...formData,
            salaryStructure: {
                baseSalary: Number(formData.baseSalary),
                hra: Number(formData.hra),
                allowance: Number(formData.allowance),
                taxPercent: Number(formData.taxPercent),
            },
            name: `${formData.firstName} ${formData.lastName}`, // Ensure name is sent
            password: formData.password || 'welcome123' // default if editing and not provided
        };

        try {
            const userStr = localStorage.getItem('user');
            if (!userStr) return;
            const token = JSON.parse(userStr).token;

            let response;
            if (mode === 'add') {
                response = await axios.post('http://localhost:5005/api/hr/employees', payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else if (mode === 'edit') {
                response = await axios.put(`http://localhost:5005/api/hr/employees/${employeeData._id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }

            if (response.data.success) {
                onRefresh();
                onClose();
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                const errMap = {};
                error.response.data.errors.forEach(err => {
                    errMap[err.field] = err.message;
                });
                setErrors(errMap);
            } else {
                console.error(`Error ${mode === 'add' ? 'adding' : 'updating'} employee`, error);
                alert(error.response?.data?.message || "An error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    const getTitle = () => {
        if (mode === 'view') return 'Employee Details';
        if (mode === 'edit') return 'Edit Employee';
        return 'Add New Employee';
    };

    const getSubtitle = () => {
        if (mode === 'view') return 'Detailed information for the member';
        if (mode === 'edit') return 'Update member information';
        return 'Fill in the details to register a new member';
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 overflow-y-auto">
            <div className="bg-white rounded-[32px] w-full max-w-2xl h-fit max-h-[92vh] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300 relative my-auto">
                {/* Header - Fixed */}
                <div className="p-6 px-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">{getTitle()}</h3>
                        <p className="text-sm text-slate-500">{getSubtitle()}</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form Content - Scrollable */}
                <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                    <div className="px-8 py-8 overflow-y-auto custom-scrollbar">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                            {/* First Name */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">First Name</label>
                                <input 
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    readOnly={mode === 'view'}
                                    placeholder="Enter first name"
                                    className={`w-full px-4 py-3.5 bg-slate-50 border ${errors.firstName ? 'border-red-500' : 'border-slate-100'} rounded-2xl focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-sm ${mode === 'view' ? 'cursor-default bg-white' : 'hover:border-slate-200'}`}
                                />
                                {errors.firstName && <p className="text-[10px] text-red-500 ml-1 font-medium">{errors.firstName}</p>}
                            </div>

                            {/* Last Name */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Last Name</label>
                                <input 
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    readOnly={mode === 'view'}
                                    placeholder="Enter last name"
                                    className={`w-full px-4 py-3.5 bg-slate-50 border ${errors.lastName ? 'border-red-500' : 'border-slate-100'} rounded-2xl focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-sm ${mode === 'view' ? 'cursor-default bg-white' : 'hover:border-slate-200'}`}
                                />
                                {errors.lastName && <p className="text-[10px] text-red-500 ml-1 font-medium">{errors.lastName}</p>}
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
                                <input 
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    readOnly={mode === 'view'}
                                    placeholder="name@workzen.com"
                                    className={`w-full px-4 py-3.5 bg-slate-50 border ${errors.email ? 'border-red-500' : 'border-slate-100'} rounded-2xl focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-sm ${mode === 'view' ? 'cursor-default bg-white' : 'hover:border-slate-200'}`}
                                />
                                {errors.email && <p className="text-[10px] text-red-500 ml-1 font-medium">{errors.email}</p>}
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Phone Number</label>
                                <input 
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    readOnly={mode === 'view'}
                                    placeholder="+1 (555) 000-0000"
                                    className={`w-full px-4 py-3.5 bg-slate-50 border ${errors.phone ? 'border-red-500' : 'border-slate-100'} rounded-2xl focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-sm ${mode === 'view' ? 'cursor-default bg-white' : 'hover:border-slate-200'}`}
                                />
                                {errors.phone && <p className="text-[10px] text-red-500 ml-1 font-medium">{errors.phone}</p>}
                            </div>

                            {/* Department */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Department</label>
                                <div className="relative">
                                    <select 
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        disabled={mode === 'view'}
                                        className={`w-full px-4 py-3.5 bg-slate-50 border ${errors.department ? 'border-red-500' : 'border-slate-100'} rounded-2xl focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-sm appearance-none ${mode === 'view' ? 'cursor-default bg-white' : 'hover:border-slate-200 cursor-pointer'}`}
                                    >
                                        <option value="">Select Department</option>
                                        <option value="Engineering">Engineering</option>
                                        <option value="Design">Design</option>
                                        <option value="Marketing">Marketing</option>
                                        <option value="HR">HR</option>
                                        <option value="Finance">Finance</option>
                                        <option value="Product">Product</option>
                                        <option value="Support">Support</option>
                                    </select>
                                    {mode !== 'view' && (
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                                        </div>
                                    )}
                                </div>
                                {errors.department && <p className="text-[10px] text-red-500 ml-1 font-medium">{errors.department}</p>}
                            </div>

                            {/* Designation */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Designation</label>
                                <input 
                                    name="designation"
                                    value={formData.designation}
                                    onChange={handleChange}
                                    readOnly={mode === 'view'}
                                    placeholder="e.g. Senior Software Engineer"
                                    className={`w-full px-4 py-3.5 bg-slate-50 border ${errors.designation ? 'border-red-500' : 'border-slate-100'} rounded-2xl focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-sm ${mode === 'view' ? 'cursor-default bg-white' : 'hover:border-slate-200'}`}
                                />
                                {errors.designation && <p className="text-[10px] text-red-500 ml-1 font-medium">{errors.designation}</p>}
                            </div>

                            {/* Base Salary */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Base Salary ($)</label>
                                <input 
                                    name="baseSalary"
                                    type="number"
                                    value={formData.baseSalary}
                                    onChange={handleChange}
                                    readOnly={mode === 'view'}
                                    placeholder="0.00"
                                    className={`w-full px-4 py-3.5 bg-slate-50 border ${errors.baseSalary ? 'border-red-500' : 'border-slate-100'} rounded-2xl focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-sm ${mode === 'view' ? 'cursor-default bg-white' : 'hover:border-slate-200'}`}
                                />
                                {errors.baseSalary && <p className="text-[10px] text-red-500 ml-1 font-medium">{errors.baseSalary}</p>}
                            </div>

                            {/* HRA */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">HRA ($)</label>
                                <input 
                                    name="hra"
                                    type="number"
                                    value={formData.hra}
                                    onChange={handleChange}
                                    readOnly={mode === 'view'}
                                    placeholder="0.00"
                                    className={`w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-sm ${mode === 'view' ? 'cursor-default bg-white' : 'hover:border-slate-200'}`}
                                />
                            </div>

                            {/* Allowance */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Allowances ($)</label>
                                <input 
                                    name="allowance"
                                    type="number"
                                    value={formData.allowance}
                                    onChange={handleChange}
                                    readOnly={mode === 'view'}
                                    placeholder="0.00"
                                    className={`w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-sm ${mode === 'view' ? 'cursor-default bg-white' : 'hover:border-slate-200'}`}
                                />
                            </div>

                            {/* Tax Percent */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Tax Percentage (%)</label>
                                <input 
                                    name="taxPercent"
                                    type="number"
                                    value={formData.taxPercent}
                                    onChange={handleChange}
                                    readOnly={mode === 'view'}
                                    placeholder="e.g. 10"
                                    className={`w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-sm ${mode === 'view' ? 'cursor-default bg-white' : 'hover:border-slate-200'}`}
                                />
                            </div>

                            {/* Emergency Contact */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Emergency Contact</label>
                                <input 
                                    name="emergencyContact"
                                    value={formData.emergencyContact}
                                    onChange={handleChange}
                                    readOnly={mode === 'view'}
                                    placeholder="Contact info"
                                    className={`w-full px-4 py-3.5 bg-slate-50 border ${errors.emergencyContact ? 'border-red-500' : 'border-slate-100'} rounded-2xl focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-sm ${mode === 'view' ? 'cursor-default bg-white' : 'hover:border-slate-200'}`}
                                />
                                {errors.emergencyContact && <p className="text-[10px] text-red-500 ml-1 font-medium">{errors.emergencyContact}</p>}
                            </div>

                            {/* Address */}
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Home Address</label>
                                <textarea 
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    readOnly={mode === 'view'}
                                    placeholder="Enter full permanent address"
                                    rows="3"
                                    className={`w-full px-4 py-3.5 bg-slate-50 border ${errors.address ? 'border-red-500' : 'border-slate-100'} rounded-2xl focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-sm resize-none ${mode === 'view' ? 'cursor-default bg-white' : 'hover:border-slate-200'}`}
                                />
                                {errors.address && <p className="text-[10px] text-red-500 ml-1 font-medium">{errors.address}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Footer - Fixed */}
                    <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/50 shrink-0">
                        <div className="flex gap-4">
                            {mode === 'view' ? (
                                <button 
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all text-sm flex items-center justify-center gap-2"
                                >
                                    <X size={18} />
                                    Close Details
                                </button>
                            ) : (
                                <>
                                    <button 
                                        type="button"
                                        onClick={onClose}
                                        className="flex-1 py-4 bg-white text-slate-600 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={loading}
                                        className="flex-[2] py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                {mode === 'add' ? <Send size={18} /> : <Save size={18} />}
                                                {mode === 'add' ? 'Register Employee' : 'Save Changes'}
                                            </>
                                        )}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmployeeModal;
