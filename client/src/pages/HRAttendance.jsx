import React, { useState, useEffect, useContext, useMemo } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Search, BarChart2, User } from 'lucide-react';
import AttendanceAnalyticsModal from '../components/attendance/AttendanceAnalyticsModal';
import GlobalSearchBar from '../components/common/GlobalSearchBar';

// --- Avatar colors ---
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

// --- Status Badge ---
const StatusBadge = ({ status }) => {
    const statusStyles = {
        Present: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
        Working: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
        Absent:  { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
        Late:    { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
    };
    const style = statusStyles[status] || { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' };
    
    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${style.bg} ${style.text} ${style.border}`}>
            {status}
        </span>
    );
};

const HRAttendance = () => {
    const { user } = useContext(AuthContext);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [attendanceData, setAttendanceData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openAnalytics = (rec) => {
        setSelectedEmployee(rec.employeeId ? `${rec.employeeId.firstName} ${rec.employeeId.lastName}` : 'Employee');
        setIsModalOpen(true);
    };

    const fetchAttendance = async () => {
        try {
            setIsLoading(true);
            const token = user?.token || JSON.parse(localStorage.getItem('user'))?.token;
            if (!token) return;

            const response = await axios.get('http://localhost:5001/api/hr/attendance/today', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setAttendanceData(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching attendance", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, []);

    const filtered = useMemo(() => {
        return attendanceData.filter((rec) => {
            const fullName = `${rec.employeeId?.firstName || ''} ${rec.employeeId?.lastName || ''}`.trim().toLowerCase();
            const empId = rec.employeeId?.employeeId?.toLowerCase() || '';
            const search = debouncedSearchTerm.toLowerCase();
            return fullName.includes(search) || empId.includes(search);
        });
    }, [attendanceData, debouncedSearchTerm]);

    const formatTime = (time) => {
        if (!time) return '—';
        return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-[28px] font-semibold text-slate-900 mb-1">Attendance Tracking</h2>
                <p className="text-slate-500 text-sm">Real-time overview of employee check-ins and working hours</p>
            </div>

            {/* Global Search Bar */}
            <GlobalSearchBar 
                data={attendanceData}
                onSearch={(term) => setDebouncedSearchTerm(term)}
                placeholder="Search attendance records..."
                searchKeys={['employeeId.firstName', 'employeeId.lastName', 'employeeId.employeeId']}
                subtitleKey="employeeId.employeeId"
                icon={User}
            />

            {/* Table Container */}
            <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                 {['EMPLOYEE', 'DATE', 'CHECK IN', 'CHECK OUT', 'HOURS', 'STATUS', 'ACTION'].map((col, i) => (
                                    <th key={i} className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                            Loading records...
                                        </div>
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-inter">
                                        {debouncedSearchTerm ? 'No records found matching your search.' : 'No attendance records found for today.'}
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((rec, idx) => {
                                    const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                                    const fullName = rec.employeeId ? `${rec.employeeId.firstName} ${rec.employeeId.lastName}` : 'N/A';
                                    return (
                                        <tr key={rec._id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div 
                                                        style={{ backgroundColor: avatarColor.bg, color: avatarColor.text }}
                                                        className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm"
                                                    >
                                                        {getInitials(fullName)}
                                                    </div>
                                                    <p className="text-sm font-bold text-slate-900 leading-tight">{fullName}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-medium text-slate-500">{new Date(rec.date).toLocaleDateString()}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-sm font-semibold ${rec.checkInTime ? 'text-slate-900' : 'text-slate-300'}`}>
                                                    {formatTime(rec.checkInTime)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-sm font-semibold ${rec.checkOutTime ? 'text-slate-900' : 'text-slate-300'}`}>
                                                    {formatTime(rec.checkOutTime)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-sm font-bold ${rec.totalHours ? 'text-blue-600' : 'text-slate-300'}`}>
                                                    {rec.totalHours ? `${rec.totalHours.toFixed(2)}h` : '—'}
                                                </span>
                                            </td>
                                             <td className="px-6 py-4">
                                                <StatusBadge status={rec.status} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <button 
                                                    onClick={() => openAnalytics(rec)}
                                                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-100/80 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-all text-[11px] font-extrabold group"
                                                >
                                                    <BarChart2 size={13} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
                                                    ANALYTICS
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

            <AttendanceAnalyticsModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                employeeName={selectedEmployee}
            />
        </div>
    );
};

export default HRAttendance;
