import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import EmployeeModal from '../components/employee/EmployeeModal.jsx';
import {
    Search,
    Plus,
    Eye,
    Pencil,
    Trash2,
    CheckCircle
} from 'lucide-react';

// --- Avatar colors for variety ---
const AVATAR_COLORS = [
    { bg: '#EEF2FF', text: '#4F46E5' },
    { bg: '#FFF7ED', text: '#EA580C' },
    { bg: '#F0FDF4', text: '#16A34A' },
    { bg: '#FDF2F8', text: '#DB2777' },
    { bg: '#EFF6FF', text: '#2563EB' },
    { bg: '#FFFBEB', text: '#D97706' },
    { bg: '#F5F3FF', text: '#7C3AED' },
];

const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
};

const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
};

// --- Sub-components ---
const StatusBadge = ({ status }) => {
    const isLeave = status?.toLowerCase() === 'on leave';
    const isPending = status?.toLowerCase() === 'pending';
    return (
        <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                isLeave 
                ? 'bg-orange-50 text-orange-600 border-orange-200' 
                : isPending
                ? 'bg-yellow-50 text-yellow-600 border-yellow-200'
                : 'bg-green-50 text-green-600 border-green-200'
            }`}
        >
            {status}
        </span>
    );
};

const Employees = () => {
    const { user } = useContext(AuthContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [employees, setEmployees] = useState([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    // Employee Verification State
    const [localStatuses, setLocalStatuses] = useState({});
    const [isVerifyOpen, setIsVerifyOpen] = useState(false);
    const [empToVerify, setEmpToVerify] = useState(null);
    const [verifyData, setVerifyData] = useState({ salary: '', allowances: '', hra: '', taxPercent: '', role: '', employeeType: '' });

    const handleOpenVerify = (emp) => {
        setEmpToVerify(emp);
        setVerifyData({ salary: '', allowances: '', hra: '', taxPercent: '', role: '', employeeType: '' });
        setIsVerifyOpen(true);
    };

    const handleVerifySubmit = () => {
        setLocalStatuses(prev => ({
            ...prev,
            [empToVerify._id]: 'Active'
        }));
        setIsVerifyOpen(false);
    };

    const getDisplayStatus = (emp) => {
        if (localStatuses[emp._id]) return localStatuses[emp._id];
        if (emp.status === 'Active' || !emp.status) return 'Pending';
        return emp.status;
    };

    const fetchEmployees = async () => {
        try {
            setIsLoading(true);
            const userStr = localStorage.getItem('user');
            if (!userStr) return;
            const token = JSON.parse(userStr).token;

            const response = await axios.get(`http://localhost:5005/api/hr/employees?search=${searchTerm}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setEmployees(response.data.data.employees);
                setTotal(response.data.data.total);
            }
        } catch (error) {
            console.error("Error fetching employees", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchEmployees();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    const handleEdit = (employee) => {
        setModalMode('edit');
        setSelectedEmployee(employee);
        setIsModalOpen(true);
    };

    const handleView = (employee) => {
        setModalMode('view');
        setSelectedEmployee(employee);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setModalMode('add');
        setSelectedEmployee(null);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to deactivate this employee?")) return;
        try {
            const userStr = localStorage.getItem('user');
            if (!userStr) return;
            const token = JSON.parse(userStr).token;

            const response = await axios.delete(`http://localhost:5005/api/hr/employees/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                fetchEmployees();
            }
        } catch (error) {
            console.error("Error deleting employee", error);
            alert(error.response?.data?.message || "Error deleting employee");
        }
    };

    return (
        <div>
            {/* Employee Modal (Add/Edit/View) */}
            <EmployeeModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onRefresh={fetchEmployees}
                mode={modalMode}
                employeeData={selectedEmployee}
            />

            {/* Verification Modal */}
            {isVerifyOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
                    <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
                        <div className="p-6 px-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Verify Employee</h3>
                                <p className="text-sm text-slate-500">Collect additional details for {empToVerify?.firstName}</p>
                            </div>
                        </div>
                        <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Base Salary ($) <span className="text-red-500">*</span></label>
                                    <input 
                                        type="number"
                                        required
                                        value={verifyData.salary}
                                        onChange={(e) => setVerifyData({...verifyData, salary: e.target.value})}
                                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-purple-500/10 outline-none transition-all text-sm"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">HRA ($) <span className="text-red-500">*</span></label>
                                    <input 
                                        type="number"
                                        required
                                        value={verifyData.hra}
                                        onChange={(e) => setVerifyData({...verifyData, hra: e.target.value})}
                                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-purple-500/10 outline-none transition-all text-sm"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Allowances ($) <span className="text-red-500">*</span></label>
                                    <input 
                                        type="number"
                                        required
                                        value={verifyData.allowances}
                                        onChange={(e) => setVerifyData({...verifyData, allowances: e.target.value})}
                                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-purple-500/10 outline-none transition-all text-sm"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Tax (%)</label>
                                    <input 
                                        type="number"
                                        value={verifyData.taxPercent}
                                        onChange={(e) => setVerifyData({...verifyData, taxPercent: e.target.value})}
                                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-purple-500/10 outline-none transition-all text-sm"
                                        placeholder="e.g. 10"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2 border-t border-slate-100 pt-4 mt-2">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 ml-1">Employment Details</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Role (Optional)</label>
                                            <input 
                                                type="text"
                                                value={verifyData.role}
                                                onChange={(e) => setVerifyData({...verifyData, role: e.target.value})}
                                                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-purple-500/10 outline-none transition-all text-sm"
                                                placeholder="e.g. Lead Developer"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Type (Optional)</label>
                                            <select 
                                                value={verifyData.employeeType}
                                                onChange={(e) => setVerifyData({...verifyData, employeeType: e.target.value})}
                                                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-purple-500/10 outline-none transition-all text-sm"
                                            >
                                                <option value="">Select type</option>
                                                <option value="Full-Time">Full-Time</option>
                                                <option value="Part-Time">Part-Time</option>
                                                <option value="Contract">Contract</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/50 flex gap-4">
                            <button 
                                onClick={() => setIsVerifyOpen(false)}
                                className="flex-1 py-4 bg-white text-slate-600 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all text-sm"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleVerifySubmit}
                                disabled={!verifyData.salary || !verifyData.hra || !verifyData.allowances}
                                className="flex-[2] py-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold rounded-2xl shadow-xl shadow-purple-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm disabled:opacity-50"
                            >
                                Mark as Verified
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Page Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h2 className="text-[28px] font-semibold text-slate-900 mb-1">Employees</h2>
                    <p className="text-slate-500 text-sm">{total} total employees registered</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                    <Plus size={20} />
                    Add Employee
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md mb-8 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input
                    type="text"
                    placeholder="Search by name, ID or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all text-sm"
                />
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                {['ID', 'EMPLOYEE', 'DEPARTMENT', 'DESIGNATION', 'STATUS', 'JOIN DATE', 'ACTIONS'].map((col, i) => (
                                    <th key={i} className={`px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest ${i === 6 ? 'text-center' : ''}`}>
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-medium">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                            Loading employee records...
                                        </div>
                                    </td>
                                </tr>
                            ) : employees.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-medium font-inter">
                                        No employees found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                employees.map((emp, idx) => {
                                    const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                                    const fullName = `${emp.firstName} ${emp.lastName}`;
                                    const displayStatus = getDisplayStatus(emp);
                                    return (
                                        <tr key={emp._id} className="hover:bg-slate-50/80 transition-colors group">
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-bold text-slate-400 uppercase tracking-tight">{emp.employeeId}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div 
                                                        style={{ backgroundColor: avatarColor.bg, color: avatarColor.text }}
                                                        className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm"
                                                    >
                                                        {getInitials(fullName)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900 leading-tight">{fullName}</p>
                                                        <p className="text-xs text-slate-500 mt-0.5">{emp.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-medium text-slate-600">{emp.department}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-medium text-slate-600">{emp.designation}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={displayStatus} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-slate-500">{formatDate(emp.joinDate)}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                                    {displayStatus === 'Pending' && (
                                                        <button 
                                                            onClick={() => handleOpenVerify(emp)}
                                                            className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                                                            title="Verify Employee"
                                                        >
                                                            <CheckCircle size={18} />
                                                        </button>
                                                    )}
                                                    <button 
                                                        onClick={() => handleView(emp)}
                                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                        title="View Details"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleEdit(emp)}
                                                        className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                                                        title="Edit Employee"
                                                    >
                                                        <Pencil size={18} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(emp._id)}
                                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                        title="Deactivate"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Employees;
