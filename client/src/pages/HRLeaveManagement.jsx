import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { Search, Check, X } from 'lucide-react';
import axios from 'axios';

const HRLeaveManagement = () => {
    const { user } = useContext(AuthContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchLeaves = async () => {
        try {
            setIsLoading(true);
            const userStr = localStorage.getItem('user');
            if (!userStr) return;
            const token = JSON.parse(userStr).token;

            const response = await axios.get('http://localhost:5000/api/hr/leaves', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setLeaveRequests(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching leaves", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAction = async (id, action) => {
        try {
            const userStr = localStorage.getItem('user');
            if (!userStr) return;
            const token = JSON.parse(userStr).token;

            const response = await axios.put(`http://localhost:5000/api/hr/leaves/${id}/${action}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                fetchLeaves();
            }
        } catch (error) {
            console.error(`Error ${action}ing leave`, error);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    const filteredRequests = leaveRequests.filter(req => 
        req.employeeId?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.employeeId?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getInitials = (name) => {
        if (!name) return '??';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const StatusBadge = ({ status }) => {
        const styles = {
            Pending: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
            Approved: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
            Rejected: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' }
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
            <div className="mb-8">
                <h2 className="text-[28px] font-semibold text-slate-900 mb-1">Leave Management</h2>
                <p className="text-slate-500 text-sm">Review and manage employee leave applications</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                    { title: 'Pending Requests', value: leaveRequests.filter(r => r.status === 'Pending').length, color: 'bg-yellow-500' },
                    { title: 'Approved This Month', value: leaveRequests.filter(r => r.status === 'Approved').length, color: 'bg-green-500' },
                    { title: 'Total Applications', value: leaveRequests.length, color: 'bg-blue-500' }
                ].map((card, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <p className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wide">{card.title}</p>
                        <h3 className="text-3xl font-bold text-slate-900 mb-4">{card.value}</h3>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${card.color}`} style={{ width: '100%' }} />
                        </div>
                    </div>
                ))}
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
                                {['EMPLOYEE', 'LEAVE TYPE', 'FROM', 'TO', 'DAYS', 'STATUS', 'ACTIONS'].map((col, i) => (
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
                                            Loading requests...
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredRequests.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-inter">No leave requests found.</td>
                                </tr>
                            ) : filteredRequests.map((req, idx) => {
                                const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                                const fullName = req.employeeId ? `${req.employeeId.firstName} ${req.employeeId.lastName}` : 'N/A';
                                return (
                                    <tr key={req._id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div 
                                                    style={{ backgroundColor: avatarColor.bg, color: avatarColor.text }}
                                                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm"
                                                >
                                                    {getInitials(fullName)}
                                                </div>
                                                <span className="font-bold text-slate-900 text-sm whitespace-nowrap">{fullName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-sm font-medium text-slate-600">{req.leaveType}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-sm font-medium text-slate-500">{new Date(req.startDate).toLocaleDateString()}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-sm font-medium text-slate-500">{new Date(req.endDate).toLocaleDateString()}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-sm font-bold text-slate-800">
                                                {Math.ceil((new Date(req.endDate) - new Date(req.startDate)) / (1000 * 60 * 60 * 24)) + 1}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <StatusBadge status={req.status} />
                                        </td>
                                        <td className="px-6 py-5">
                                            {req.status === 'Pending' ? (
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button 
                                                        onClick={() => handleAction(req._id, 'approve')}
                                                        className="p-2 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white rounded-lg transition-all shadow-sm" 
                                                        title="Approve"
                                                    >
                                                        <Check size={18} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleAction(req._id, 'reject')}
                                                        className="p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-all shadow-sm" 
                                                        title="Reject"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-tight">Processed</span>
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

export default HRLeaveManagement;
