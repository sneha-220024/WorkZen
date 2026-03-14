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
    Plus,
    Eye,
    Pencil,
    Trash2,
} from 'lucide-react';

// --- Mock Employee Data ---
const MOCK_EMPLOYEES = [
    {
        id: 'EMP001',
        name: 'Sarah Johnson',
        email: 'sarah@workzen.com',
        department: 'Engineering',
        role: 'Senior Developer',
        status: 'Active',
        joinDate: '2023-01-15',
    },
    {
        id: 'EMP002',
        name: 'Mike Chen',
        email: 'mike@workzen.com',
        department: 'Design',
        role: 'UI/UX Lead',
        status: 'Active',
        joinDate: '2023-03-22',
    },
    {
        id: 'EMP003',
        name: 'Emily Davis',
        email: 'emily@workzen.com',
        department: 'Marketing',
        role: 'Marketing Manager',
        status: 'Active',
        joinDate: '2022-11-08',
    },
    {
        id: 'EMP004',
        name: 'Alex Kim',
        email: 'alex@workzen.com',
        department: 'HR',
        role: 'HR Specialist',
        status: 'On Leave',
        joinDate: '2023-06-01',
    },
    {
        id: 'EMP005',
        name: 'Lisa Wang',
        email: 'lisa@workzen.com',
        department: 'Finance',
        role: 'Accountant',
        status: 'Active',
        joinDate: '2022-08-14',
    },
    {
        id: 'EMP006',
        name: 'James Brown',
        email: 'james@workzen.com',
        department: 'Engineering',
        role: 'DevOps Engineer',
        status: 'Active',
        joinDate: '2023-02-10',
    },
    {
        id: 'EMP007',
        name: 'David Wilson',
        email: 'david@workzen.com',
        department: 'Support',
        role: 'Support Lead',
        status: 'Active',
        joinDate: '2023-04-05',
    },
];

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
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '4px 14px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: 600,
                backgroundColor: isLeave ? '#FFF7ED' : '#F0FDF4',
                color: isLeave ? '#EA580C' : '#16A34A',
                border: `1px solid ${isLeave ? '#FED7AA' : '#BBF7D0'}`,
                letterSpacing: '0.02em',
                whiteSpace: 'nowrap',
            }}
        >
            {status}
        </span>
    );
};

const Employees = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const sidebarItems = [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/hr' },
        { label: 'Employees', icon: Users, active: true, path: '/dashboard/hr/employees' },
        { label: 'Attendance', icon: Calendar, path: '/dashboard/hr/attendance' },
        { label: 'Leave Management', icon: ClipboardList, path: '/dashboard/hr/leaves' },
        { label: 'Payroll', icon: BadgeDollarSign, path: '/dashboard/hr/payroll' },
        { label: 'Payslip', icon: FileText, path: '/dashboard/hr/payslips' },
        { label: 'Notifications', icon: Bell, path: '/dashboard/hr/notifications' },
    ];

    const filtered = MOCK_EMPLOYEES.filter((emp) => {
        const term = searchTerm.toLowerCase();
        return (
            emp.name.toLowerCase().includes(term) ||
            emp.email.toLowerCase().includes(term) ||
            emp.id.toLowerCase().includes(term) ||
            emp.department.toLowerCase().includes(term) ||
            emp.role.toLowerCase().includes(term)
        );
    });

    return (
        <>
            {/* Page Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h2 className="text-[28px] font-bold text-slate-900 leading-tight">
                        Employees
                    </h2>
                    <p className="text-sm font-medium text-slate-500 mt-1">
                        {filtered.length} total staff members
                    </p>
                </div>
                <button
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95"
                >
                    <Plus size={18} />
                    Add Employee
                </button>
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
                                {['ID', 'EMPLOYEE', 'DEPARTMENT', 'ROLE', 'STATUS', 'JOIN DATE', 'ACTIONS'].map((col, i) => (
                                    <th key={i} className={`px-6 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest ${i === 6 ? 'text-center' : ''}`}>
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody className="divide-y divide-slate-50">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-20 text-center text-slate-400 font-medium">
                                        No employees found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((emp, idx) => {
                                    const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                                    return (
                                        <TableRow key={emp.id} emp={emp} avatarColor={avatarColor} />
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

/* ── Table Row with hover state ── */
const TableRow = ({ emp, avatarColor }) => {
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
            {/* ID */}
            <td style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 600, color: '#9CA3AF', whiteSpace: 'nowrap' }}>
                {emp.id}
            </td>

            {/* Employee (Avatar + Name + Email) */}
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
                        {getInitials(emp.name)}
                    </div>
                    <div>
                        <p style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#111827', lineHeight: 1.3 }}>{emp.name}</p>
                        <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#6B7280' }}>{emp.email}</p>
                    </div>
                </div>
            </td>

            {/* Department */}
            <td style={{ padding: '16px 20px', fontSize: '14px', color: '#374151', whiteSpace: 'nowrap' }}>
                {emp.department}
            </td>

            {/* Role */}
            <td style={{ padding: '16px 20px', fontSize: '14px', color: '#374151', whiteSpace: 'nowrap' }}>
                {emp.role}
            </td>

            {/* Status */}
            <td style={{ padding: '16px 20px' }}>
                <StatusBadge status={emp.status} />
            </td>

            {/* Join Date */}
            <td style={{ padding: '16px 20px', fontSize: '14px', color: '#6B7280', whiteSpace: 'nowrap' }}>
                {formatDate(emp.joinDate)}
            </td>

            {/* Actions */}
            <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <ActionIcon Icon={Eye} hoverColor="#2563EB" title="View" />
                    <ActionIcon Icon={Pencil} hoverColor="#16A34A" title="Edit" />
                    <ActionIcon Icon={Trash2} hoverColor="#DC2626" title="Delete" isDelete />
                </div>
            </td>
        </tr>
    );
};

/* ── Action Icon Button ── */
const ActionIcon = ({ Icon, hoverColor, title, isDelete }) => {
    const [hovered, setHovered] = useState(false);
    return (
        <button
            title={title}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => alert(`${title} action clicked`)}
            style={{
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                backgroundColor: hovered ? (isDelete ? '#FEF2F2' : '#F0F9FF') : '#fff',
                color: hovered ? hoverColor : '#9CA3AF',
                cursor: 'pointer',
                transition: 'all 0.15s',
                padding: 0,
            }}
        >
            <Icon size={15} />
        </button>
    );
};

export default Employees;
