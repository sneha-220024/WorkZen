import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';
import { Search, DollarSign, Users, Play, CheckCircle } from 'lucide-react';

const HRPayrollManagement = () => {
    useContext(AuthContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [payrollData, setPayrollData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    
    // Month/Year for generation
    const currentMonth = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date());
    const currentYear = new Date().getFullYear();
    const [genMonth, setGenMonth] = useState(currentMonth);
    const [genYear] = useState(currentYear);

    const fetchPayroll = async () => {
        try {
            setIsLoading(true);
            const userStr = localStorage.getItem('user');
            if (!userStr) return;
            const token = JSON.parse(userStr).token;

            const response = await axios.get('http://localhost:5000/api/hr/payroll', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setPayrollData(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching payroll data", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPayroll();
    }, []);

    const handleGenerate = async () => {
        if (!window.confirm(`Generate payroll for ${genMonth} ${genYear}?`)) return;
        
        try {
            setIsGenerating(true);
            const userStr = localStorage.getItem('user');
            if (!userStr) return;
            const token = JSON.parse(userStr).token;

            const response = await axios.post('http://localhost:5000/api/hr/payroll/generate', {
                month: genMonth,
                year: genYear
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                alert(response.data.message);
                fetchPayroll();
            }
        } catch (error) {
            console.error("Error generating payroll", error);
            alert(error.response?.data?.message || "Failed to generate payroll");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleMarkPaid = async (id) => {
        try {
            const userStr = localStorage.getItem('user');
            if (!userStr) return;
            const token = JSON.parse(userStr).token;

            const response = await axios.patch(`http://localhost:5000/api/hr/payroll/pay/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                fetchPayroll();
            }
        } catch (error) {
            console.error("Error marking as paid", error);
        }
    };

    const filteredPayroll = payrollData.filter(req => {
        if (!req.employeeId) return false;
        const firstName = req.employeeId.firstName?.toLowerCase() || '';
        const lastName = req.employeeId.lastName?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();
        return firstName.includes(search) || lastName.includes(search);
    });

    const getInitials = (name) => {
        if (!name) return '??';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const StatusBadge = ({ status }) => {
        const styles = {
            Paid: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
            Unpaid: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
        };
        const style = styles[status] || { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' };
        
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${style.bg} ${style.text} ${style.border}`}>
                {status}
            </span>
        );
    };

    const AVATAR_COLORS = [
        { bg: '#EEF2FF', text: '#4F46E5' },
        { bg: '#FFF7ED', text: '#EA580C' },
        { bg: '#F0FDF4', text: '#16A34A' },
        { bg: '#FDF2F8', text: '#DB2777' },
        { bg: '#EFF6FF', text: '#2563EB' },
    ];

    return (
        <div>
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h2 className="text-[28px] font-semibold text-slate-900 mb-1">Payroll Management</h2>
                    <p className="text-slate-500 text-sm">Calculate salaries and track payment statuses across the organization</p>
                </div>
                <div className="flex items-center gap-4">
                    <select 
                        value={genMonth} 
                        onChange={(e) => setGenMonth(e.target.value)}
                        className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                        {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all disabled:opacity-50"
                    >
                        <Play size={18} fill="currentColor" />
                        {isGenerating ? 'Generating...' : 'Generate Payroll'}
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                        <DollarSign size={24} />
                    </div>
                    <p className="text-sm font-semibold text-slate-400 mb-1 uppercase tracking-wider">Total Payroll</p>
                    <h3 className="text-2xl font-bold text-slate-900 mb-1">
                        ${payrollData.reduce((sum, r) => sum + (r.netSalary || 0), 0).toLocaleString()}
                    </h3>
                    <p className="text-xs font-bold text-blue-600">Sum of Net Salaries</p>
                </div>
                <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                        <Users size={24} />
                    </div>
                    <p className="text-sm font-semibold text-slate-400 mb-1 uppercase tracking-wider">Employees Processed</p>
                    <h3 className="text-2xl font-bold text-slate-900 mb-1">{payrollData.length}</h3>
                    <p className="text-xs font-bold text-purple-600">Total Records</p>
                </div>
            </div>

             {/* Search Bar */}
             <div className="relative max-w-md mb-8 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input
                    type="text"
                    placeholder="Search employees..."
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
                                {['EMPLOYEE', 'PERIOD', 'BASE SALARY', 'DEDUCTIONS', 'NET PAY', 'STATUS', 'ACTIONS'].map((col, i) => (
                                    <th key={i} className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                            Loading payroll...
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredPayroll.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-inter">No payroll records found.</td>
                                </tr>
                            ) : filteredPayroll.map((row, idx) => {
                                const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                                const fullName = row.employeeId ? `${row.employeeId.firstName} ${row.employeeId.lastName}` : 'N/A';
                                return (
                                    <tr key={row._id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div 
                                                    style={{ backgroundColor: avatarColor.bg, color: avatarColor.text }}
                                                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm"
                                                >
                                                    {getInitials(fullName)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 leading-tight">{fullName}</p>
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{row.employeeId?.department}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-sm font-medium text-slate-600">{row.month} {row.year}</span>
                                        </td>
                                        <td className="px-6 py-5 text-sm font-semibold text-slate-700">${row.baseSalary?.toLocaleString()}</td>
                                        <td className="px-6 py-5 text-sm font-semibold text-red-500">-${row.deductions?.toLocaleString()}</td>
                                        <td className="px-6 py-5 text-sm font-bold text-slate-900">${row.netSalary?.toLocaleString()}</td>
                                        <td className="px-6 py-5">
                                            <StatusBadge status={row.status} />
                                        </td>
                                        <td className="px-6 py-5">
                                            {row.status === 'Unpaid' && (
                                                <button 
                                                    onClick={() => handleMarkPaid(row._id)}
                                                    className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white rounded-lg transition-all text-xs font-bold border border-green-100"
                                                >
                                                    <CheckCircle size={14} />
                                                    Mark Paid
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default HRPayrollManagement;
