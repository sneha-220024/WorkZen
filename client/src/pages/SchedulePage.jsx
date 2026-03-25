import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Calendar } from 'lucide-react';
import ScheduleModal from '../components/employee/ScheduleModal';

const AVATAR_COLORS = [
    { bg: '#EEF2FF', text: '#4F46E5' },
    { bg: '#FFF7ED', text: '#EA580C' },
    { bg: '#F0FDF4', text: '#16A34A' },
    { bg: '#FDF2F8', text: '#DB2777' },
    { bg: '#EFF6FF', text: '#2563EB' },
];

const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
};

const SchedulePage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [employees, setEmployees] = useState([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

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

    const handleOpenModal = (employee) => {
        setSelectedEmployee(employee);
        setIsModalOpen(true);
    };

    return (
        <div className="animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h2 className="text-[28px] font-semibold text-slate-900 mb-1 font-sora">Schedule Management</h2>
                    <p className="text-slate-500 text-sm font-medium">Schedule meetings, reviews, and discussions with your team</p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md mb-8 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input
                    type="text"
                    placeholder="Search employees to schedule..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all text-sm font-medium"
                />
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                {['ID', 'EMPLOYEE', 'EMAIL', 'DEPARTMENT', 'DESIGNATION', 'ACTION'].map((col, i) => (
                                    <th key={i} className={`px-6 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest ${i === 5 ? 'text-center' : ''}`}>
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                            Loading employees...
                                        </div>
                                    </td>
                                </tr>
                            ) : employees.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium">
                                        No employees found.
                                    </td>
                                </tr>
                            ) : (
                                employees.map((emp, idx) => {
                                    const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                                    const fullName = `${emp.firstName} ${emp.lastName}`;
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
                                                    <span className="text-sm font-bold text-slate-900">{fullName}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-slate-500 font-medium">{emp.email}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">{emp.department}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-medium text-slate-600">{emp.designation}</span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => handleOpenModal(emp)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition-all transform active:scale-95 group/btn mx-auto shadow-sm"
                                                >
                                                    <Calendar size={16} className="group-hover/btn:rotate-12 transition-transform" />
                                                    Schedule
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <ScheduleModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    employee={selectedEmployee}
                />
            )}
        </div>
    );
};

export default SchedulePage;
