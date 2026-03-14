import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Calendar,
    ClipboardList,
    BadgeDollarSign,
    FileText,
    Bell,
    Search,
    LogIn,
    LogOut,
} from 'lucide-react';

// --- Mock Attendance Data ---
const MOCK_ATTENDANCE = [
    {
        id: 'ATT001',
        name: 'Sarah Johnson',
        date: '2026-03-07',
        checkIn: '09:02 AM',
        checkOut: '06:15 PM',
        hours: '9h 13m',
        status: 'Present',
    },
    {
        id: 'ATT002',
        name: 'Mike Chen',
        date: '2026-03-07',
        checkIn: '08:45 AM',
        checkOut: '05:30 PM',
        hours: '8h 45m',
        status: 'Present',
    },
    {
        id: 'ATT003',
        name: 'Emily Davis',
        date: '2026-03-07',
        checkIn: '09:30 AM',
        checkOut: '—',
        hours: '—',
        status: 'Working',
    },
    {
        id: 'ATT004',
        name: 'Alex Kim',
        date: '2026-03-07',
        checkIn: '—',
        checkOut: '—',
        hours: '—',
        status: 'Absent',
    },
    {
        id: 'ATT005',
        name: 'Lisa Wang',
        date: '2026-03-07',
        checkIn: '08:58 AM',
        checkOut: '06:00 PM',
        hours: '9h 02m',
        status: 'Present',
    },
    {
        id: 'ATT006',
        name: 'James Brown',
        date: '2026-03-07',
        checkIn: '10:15 AM',
        checkOut: '—',
        hours: '—',
        status: 'Late',
    },
];

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
        Present: { bg: '#F0FDF4', color: '#16A34A', border: '#BBF7D0' },
        Working: { bg: '#EFF6FF', color: '#2563EB', border: '#BFDBFE' },
        Absent:  { bg: '#FEF2F2', color: '#DC2626', border: '#FECACA' },
        Late:    { bg: '#FFF7ED', color: '#EA580C', border: '#FED7AA' },
    };
    const style = statusStyles[status] || { bg: '#F3F4F6', color: '#6B7280', border: '#E5E7EB' };
    return (
        <span
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '4px 14px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: 600,
                backgroundColor: style.bg,
                color: style.color,
                border: `1px solid ${style.border}`,
                letterSpacing: '0.02em',
                whiteSpace: 'nowrap',
            }}
        >
            {status}
        </span>
    );
};

const HRAttendance = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const sidebarItems = [
        { label: 'Dashboard',       icon: LayoutDashboard, path: '/dashboard/hr' },
        { label: 'Employees',       icon: Users,           path: '/dashboard/hr/employees' },
        { label: 'Attendance',      icon: Calendar,        path: '/dashboard/hr/attendance', active: true },
        { label: 'Leave Management',icon: ClipboardList,   path: '/dashboard/hr/leaves' },
        { label: 'Payroll',         icon: BadgeDollarSign, path: '/dashboard/hr/payroll' },
        { label: 'Payslip',         icon: FileText,        path: '/dashboard/hr/payslips' },
        { label: 'Notifications',   icon: Bell,            path: '/dashboard/hr/notifications' },
    ];

    const filtered = MOCK_ATTENDANCE.filter((rec) =>
        rec.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const [checkInHovered, setCheckInHovered] = useState(false);
    const [checkOutHovered, setCheckOutHovered] = useState(false);

    return (
        <>
            {/* Page Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h2 className="text-[28px] font-bold text-slate-900 leading-tight">
                        Attendance Tracking
                    </h2>
                    <p className="text-sm font-medium text-slate-500 mt-1">
                        Track daily attendance and working hours
                    </p>
                </div>
                {/* Action Buttons */}
                <div className="flex gap-4">
                    {/* Check In */}
                    <button
                        className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-green-600/20 hover:bg-green-700 transition-all active:scale-95"
                    >
                        <LogIn size={18} />
                        Check In
                    </button>
                    {/* Check Out */}
                    <button
                        className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all active:scale-95"
                    >
                        <LogOut size={18} />
                        Check Out
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-3 bg-white border border-slate-100 rounded-[20px] px-6 py-4 max-w-md mb-8 shadow-sm">
                <Search size={18} className="text-slate-400" />
                <input
                    type="text"
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-none outline-none text-[15px] font-medium text-slate-600 bg-transparent w-full"
                />
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        {/* Table Head */}
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                {['EMPLOYEE', 'DATE', 'CHECK IN', 'CHECK OUT', 'HOURS', 'STATUS'].map((col, i) => (
                                    <th key={i} className="px-6 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody className="divide-y divide-slate-50">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center text-slate-400 font-medium">
                                        No records found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((rec, idx) => {
                                    const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                                    return (
                                        <AttendanceRow key={rec.id} rec={rec} avatarColor={avatarColor} />
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

/* ── Attendance Table Row ── */
const AttendanceRow = ({ rec, avatarColor }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <tr
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                borderBottom: '1px solid #F3F4F6',
                backgroundColor: hovered ? '#F9FAFB' : '#fff',
                transition: 'background 0.12s',
            }}
        >
            {/* Employee (Avatar + Name) */}
            <td style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: avatarColor.bg,
                        color: avatarColor.text,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '14px',
                        flexShrink: 0,
                    }}>
                        {getInitials(rec.name)}
                    </div>
                    <p style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#111827', lineHeight: 1.3 }}>{rec.name}</p>
                </div>
            </td>

            {/* Date */}
            <td style={{ padding: '16px 20px', fontSize: '14px', color: '#374151', whiteSpace: 'nowrap' }}>
                {rec.date}
            </td>

            {/* Check In */}
            <td style={{ padding: '16px 20px', fontSize: '14px', color: rec.checkIn === '—' ? '#9CA3AF' : '#374151', whiteSpace: 'nowrap' }}>
                {rec.checkIn}
            </td>

            {/* Check Out */}
            <td style={{ padding: '16px 20px', fontSize: '14px', color: rec.checkOut === '—' ? '#9CA3AF' : '#374151', whiteSpace: 'nowrap' }}>
                {rec.checkOut}
            </td>

            {/* Hours */}
            <td style={{ padding: '16px 20px', fontSize: '14px', color: rec.hours === '—' ? '#9CA3AF' : '#374151', whiteSpace: 'nowrap', fontWeight: rec.hours !== '—' ? 600 : 400 }}>
                {rec.hours}
            </td>

            {/* Status */}
            <td style={{ padding: '16px 20px' }}>
                <StatusBadge status={rec.status} />
            </td>
        </tr>
    );
};

export default HRAttendance;
