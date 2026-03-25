import React, { useState, useEffect } from 'react';
import { X, Save, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

const EditProfileModal = ({ isOpen, onClose, onRefresh, employeeData = null, userData = null }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (employeeData && isOpen) {
            // Split full name if firstName/lastName not directly available, but usually they are 
            // from the backend. Since the Profile.jsx uses user.name, let's extract it.
            const nameParts = (userData?.name || employeeData?.name || '').split(' ');
            const fName = employeeData?.firstName || nameParts[0] || '';
            const lName = employeeData?.lastName || nameParts.slice(1).join(' ') || '';

            setFormData({
                firstName: fName,
                lastName: lName,
                email: userData?.email || employeeData?.email || '',
                phone: employeeData?.phone || '',
                address: employeeData?.address || '',
                password: '', // Blank by default, only updated if filled
            });
        } else {
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                address: '',
                password: '',
            });
        }
        setErrors({});
        setShowPassword(false);
    }, [employeeData, userData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error when typing
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        // Basic validation
        const newErrors = {};
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        const payload = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
        };

        if (formData.password) {
            payload.password = formData.password;
        }

        try {
            const userStr = localStorage.getItem('user');
            if (!userStr) return;
            const token = JSON.parse(userStr).token;

            // This assumes the backend endpoint for an employee updating their own profile
            const response = await axios.put('http://localhost:5001/api/employee/profile', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                // Keep the local storage up to date if name or email changed
                const currentUser = JSON.parse(userStr);
                let updated = false;
                if (payload.name !== currentUser.name) {
                    currentUser.name = payload.name;
                    updated = true;
                }
                if (payload.email !== currentUser.email) {
                    currentUser.email = payload.email;
                    updated = true;
                }
                if (updated) {
                    localStorage.setItem('user', JSON.stringify(currentUser));
                    // A proper implementation would also update the AuthContext, 
                    // but the reload below or onRefresh will handle it to some extent.
                }

                if (onRefresh) {
                    await onRefresh();
                }
                onClose();
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            if (error.response && error.response.data && error.response.data.errors) {
                const errMap = {};
                error.response.data.errors.forEach(err => {
                    errMap[err.field] = err.message;
                });
                setErrors(errMap);
            } else {
                alert(error.response?.data?.message || "An error occurred while updating the profile.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 overflow-y-auto">
            <div className="bg-white rounded-[32px] w-full max-w-2xl h-fit max-h-[92vh] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300 relative my-auto">
                {/* Header */}
                <div className="p-6 px-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Edit Profile</h3>
                        <p className="text-sm text-slate-500">Update your personal and contact details</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form Content */}
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
                                    placeholder="First name"
                                    className={`w-full px-4 py-3.5 bg-slate-50 border ${errors.firstName ? 'border-red-500' : 'border-slate-100'} rounded-2xl focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-sm hover:border-slate-200`}
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
                                    placeholder="Last name"
                                    className={`w-full px-4 py-3.5 bg-slate-50 border ${errors.lastName ? 'border-red-500' : 'border-slate-100'} rounded-2xl focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-sm hover:border-slate-200`}
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
                                    placeholder="name@workzen.com"
                                    className={`w-full px-4 py-3.5 bg-slate-50 border ${errors.email ? 'border-red-500' : 'border-slate-100'} rounded-2xl focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-sm hover:border-slate-200`}
                                />
                                {errors.email && <p className="text-[10px] text-red-500 ml-1 font-medium">{errors.email}</p>}
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
                                <div className="relative">
                                    <input 
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Leave blank to keep same"
                                        className={`w-full px-4 py-3.5 bg-slate-50 border ${errors.password ? 'border-red-500' : 'border-slate-100'} rounded-2xl focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-sm hover:border-slate-200`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-[10px] text-red-500 ml-1 font-medium">{errors.password}</p>}
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Phone Number</label>
                                <input 
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+1 (555) 000-0000"
                                    className={`w-full px-4 py-3.5 bg-slate-50 border ${errors.phone ? 'border-red-500' : 'border-slate-100'} rounded-2xl focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-sm hover:border-slate-200`}
                                />
                                {errors.phone && <p className="text-[10px] text-red-500 ml-1 font-medium">{errors.phone}</p>}
                            </div>

                            {/* Spacer to keep Address full width properly if needed, but grid-cols-2 takes care of it when col-span-2 is used */}
                            <div className="hidden md:block"></div>

                            {/* Address */}
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Home Address</label>
                                <textarea 
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Enter full address"
                                    rows="3"
                                    className={`w-full px-4 py-3.5 bg-slate-50 border ${errors.address ? 'border-red-500' : 'border-slate-100'} rounded-2xl focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-sm resize-none hover:border-slate-200`}
                                />
                                {errors.address && <p className="text-[10px] text-red-500 ml-1 font-medium">{errors.address}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/50 shrink-0">
                        <div className="flex gap-4">
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
                                        <Save size={18} />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;
