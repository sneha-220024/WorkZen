import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import EmployeeModal from '../components/employee/EmployeeModal.jsx';
import {
    Search,
    Plus,
    Eye,
    Pencil,
    Trash2
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
    return (
        <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                isLeave 
                ? 'bg-orange-50 text-orange-600 border-orange-200' 
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

    const fetchEmployees = async () => {
        try {
            setIsLoading(true);
            const userStr = localStorage.getItem('user');
            if (!userStr) return;
            const token = JSON.parse(userStr).token;

            const response = await axios.get(`http://localhost:5001/api/hr/employees?search=${searchTerm}`, {
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

            const response = await axios.delete(`http://localhost:5001/api/hr/employees/${id}`, {
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
                                                <StatusBadge status={emp.status} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-slate-500">{formatDate(emp.joinDate)}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
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
