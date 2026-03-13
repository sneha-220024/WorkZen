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
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F5F7FB', fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>

            {/* ── Sidebar ── */}
            <aside style={{
                width: '240px',
                backgroundColor: '#1E2A45',
                color: '#CBD5E1',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100%',
                top: 0,
                left: 0,
                zIndex: 100,
            }}>
                <div style={{ padding: '28px 24px 20px' }}>
                    <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.3px' }}>
                        Work<span style={{ color: '#60A5FA' }}>Zen</span>
                    </h1>
                </div>
                <nav style={{ flex: 1, padding: '0 12px' }}>
                    {sidebarItems.map((item, idx) => (
                        <div
                            key={idx}
                            onClick={() => navigate(item.path)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '11px 16px',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                marginBottom: '4px',
                                backgroundColor: item.active ? '#2563EB' : 'transparent',
                                color: item.active ? '#fff' : '#94A3B8',
                                fontWeight: item.active ? 600 : 500,
                                fontSize: '14px',
                                transition: 'background 0.15s, color 0.15s',
                            }}
                            onMouseEnter={(e) => { if (!item.active) { e.currentTarget.style.backgroundColor = '#263352'; e.currentTarget.style.color = '#fff'; } }}
                            onMouseLeave={(e) => { if (!item.active) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#94A3B8'; } }}
                        >
                            <item.icon size={18} />
                            <span>{item.label}</span>
                        </div>
                    ))}
                </nav>
            </aside>

            {/* ── Main Content ── */}
            <main style={{ flex: 1, marginLeft: '240px', padding: '36px 40px' }}>

                {/* Top Header Bar */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    gap: '16px',
                    marginBottom: '28px',
                }}>
                    {/* Notification Bell */}
                    <div style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: '#fff',
                        border: '1px solid #E5E7EB',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    }}>
                        <Bell size={18} color="#6B7280" />
                    </div>

                    {/* User Profile */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: '#EEF2FF',
                            color: '#4F46E5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '14px',
                        }}>JD</div>
                        <div>
                            <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#111827' }}>John Doe</p>
                            <p style={{ margin: 0, fontSize: '12px', color: '#6B7280' }}>HR Manager</p>
                        </div>
                    </div>
                </div>

                {/* Page Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
                    <div>
                        <h2 style={{ fontSize: '26px', fontWeight: 700, color: '#111827', margin: 0, lineHeight: 1.2 }}>
                            Attendance Tracking
                        </h2>
                        <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '6px' }}>
                            Track daily attendance and working hours
                        </p>
                    </div>
                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '12px' }}>
                        {/* Check In */}
                        <button
                            onMouseEnter={() => setCheckInHovered(true)}
                            onMouseLeave={() => setCheckInHovered(false)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 20px',
                                backgroundColor: checkInHovered ? '#15803D' : '#16A34A',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '10px',
                                fontWeight: 600,
                                fontSize: '14px',
                                cursor: 'pointer',
                                boxShadow: '0 2px 8px rgba(22,163,74,0.3)',
                                transition: 'background 0.15s',
                                fontFamily: "'Inter', 'Segoe UI', sans-serif",
                            }}
                        >
                            <LogIn size={18} />
                            Check In
                        </button>
                        {/* Check Out */}
                        <button
                            onMouseEnter={() => setCheckOutHovered(true)}
                            onMouseLeave={() => setCheckOutHovered(false)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 20px',
                                backgroundColor: checkOutHovered ? '#B91C1C' : '#DC2626',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '10px',
                                fontWeight: 600,
                                fontSize: '14px',
                                cursor: 'pointer',
                                boxShadow: '0 2px 8px rgba(220,38,38,0.3)',
                                transition: 'background 0.15s',
                                fontFamily: "'Inter', 'Segoe UI', sans-serif",
                            }}
                        >
                            <LogOut size={18} />
                            Check Out
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    backgroundColor: '#fff',
                    border: '1px solid #E5E7EB',
                    borderRadius: '10px',
                    padding: '10px 16px',
                    maxWidth: '380px',
                    marginBottom: '24px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                }}>
                    <Search size={17} style={{ color: '#9CA3AF', flexShrink: 0 }} />
                    <input
                        type="text"
                        placeholder="Search employees..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            border: 'none',
                            outline: 'none',
                            fontSize: '14px',
                            color: '#374151',
                            background: 'transparent',
                            width: '100%',
                        }}
                    />
                </div>

                {/* Table Container */}
                <div style={{
                    backgroundColor: '#fff',
                    borderRadius: '10px',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                    overflow: 'hidden',
                    border: '1px solid #E5E7EB',
                }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'auto' }}>
                            {/* Table Head */}
                            <thead>
                                <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                                    {['EMPLOYEE', 'DATE', 'CHECK IN', 'CHECK OUT', 'HOURS', 'STATUS'].map((col, i) => (
                                        <th key={i} style={{
                                            padding: '14px 20px',
                                            textAlign: 'left',
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            color: '#6B7280',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                            whiteSpace: 'nowrap',
                                        }}>
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            {/* Table Body */}
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF', fontSize: '14px' }}>
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
            </main>
        </div>
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
