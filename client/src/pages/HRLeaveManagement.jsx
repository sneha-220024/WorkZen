import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { 
    LayoutDashboard, 
    Users, 
    Calendar, 
    ClipboardList, 
    BadgeDollarSign, 
    FileText, 
    Bell, 
    Search,
    User as UserIcon,
    Plus,
    Check,
    X
} from 'lucide-react';

const HRLeaveManagement = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const sidebarItems = [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/hr' },
        { label: 'Employees', icon: Users, path: '/dashboard/hr/employees' },
        { label: 'Attendance', icon: Calendar, path: '/dashboard/hr/attendance' },
        { label: 'Leave Management', icon: ClipboardList, path: '/dashboard/hr/leaves', active: true },
        { label: 'Payroll', icon: BadgeDollarSign, path: '/dashboard/hr/payroll' },
        { label: 'Payslip', icon: FileText, path: '/dashboard/hr/payslips' },
        { label: 'Notifications', icon: Bell, path: '/dashboard/hr/notifications' },
    ];

    const leaveBalances = [
        { title: 'Casual Leave', value: 8, total: 12, color: '#3B82F6' },
        { title: 'Sick Leave', value: 8, total: 10, color: '#10B981' },
        { title: 'Work From Home', value: 14, total: 24, color: '#8B5CF6' }
    ];

    const mockRequests = [
        { id: 1, employee: 'Sarah Johnson', type: 'Casual Leave', from: '2026-03-10', to: '2026-03-12', days: 3, status: 'Pending' },
        { id: 2, employee: 'Mike Chen', type: 'Sick Leave', from: '2026-03-05', to: '2026-03-06', days: 2, status: 'Approved' },
        { id: 3, employee: 'Emily Davis', type: 'Casual Leave', from: '2026-03-15', to: '2026-03-15', days: 1, status: 'Pending' },
        { id: 4, employee: 'James Brown', type: 'Work From Home', from: '2026-03-08', to: '2026-03-08', days: 1, status: 'Approved' },
        { id: 5, employee: 'Lisa Wang', type: 'Sick Leave', from: '2026-03-01', to: '2026-03-03', days: 3, status: 'Rejected' }
    ];

    const filteredRequests = mockRequests.filter(req => 
        req.employee.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const StatusBadge = ({ status }) => {
        const styles = {
            Pending: { bg: '#FEF9C3', text: '#854D0E' }, // Yellow
            Approved: { bg: '#DCFCE7', text: '#166534' }, // Green
            Rejected: { bg: '#FEE2E2', text: '#991B1B' }  // Red
        };
        const style = styles[status] || { bg: '#F3F4F6', text: '#374151' };
        
        return (
            <span style={{
                padding: '4px 12px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: 600,
                backgroundColor: style.bg,
                color: style.text,
                display: 'inline-block'
            }}>
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
        <>
            {/* Page Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h2 className="text-[28px] font-semibold text-slate-900 mb-1">Leave Management</h2>
                    <p className="text-slate-500 text-sm">Manage leave requests and balances</p>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-600/20 transition-all">
                    <Plus size={20} />
                    Request Leave
                </button>
            </div>

                    {/* Balance Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {leaveBalances.map((card, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100">
                                <p className="text-sm font-medium text-slate-500 mb-2 uppercase tracking-wide">{card.title}</p>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                                    {card.value} <span className="text-lg text-slate-400 font-normal">/ {card.total}</span>
                                </h3>
                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                        style={{ 
                                            width: `${(card.value / card.total) * 100}%`,
                                            backgroundColor: card.color
                                        }} 
                                        className="h-full rounded-full transition-all duration-500"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Table Container */}
                    <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-bottom border-slate-100">
                                        {['EMPLOYEE', 'LEAVE TYPE', 'FROM', 'TO', 'DAYS', 'STATUS', 'ACTIONS'].map((col, i) => (
                                            <th key={i} className="px-6 py-4 text-left text-[12px] font-bold text-slate-500 uppercase tracking-wider">
                                                {col}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredRequests.map((req, idx) => {
                                        const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                                        return (
                                            <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div 
                                                            style={{ backgroundColor: avatarColor.bg, color: avatarColor.text }}
                                                            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm"
                                                        >
                                                            {getInitials(req.employee)}
                                                        </div>
                                                        <span className="font-bold text-slate-900 text-sm whitespace-nowrap">{req.employee}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-sm font-medium text-slate-600">{req.type}</td>
                                                <td className="px-6 py-5 text-sm text-slate-500 font-medium whitespace-nowrap">{req.from}</td>
                                                <td className="px-6 py-5 text-sm text-slate-500 font-medium whitespace-nowrap">{req.to}</td>
                                                <td className="px-6 py-5 text-sm font-bold text-slate-700">{req.days}</td>
                                                <td className="px-6 py-5">
                                                    <StatusBadge status={req.status} />
                                                </td>
                                                <td className="px-6 py-5 text-right whitespace-nowrap">
                                                    {req.status === 'Pending' ? (
                                                        <div className="flex items-center gap-2">
                                                            <button className="p-2 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white rounded-lg transition-all" title="Approve">
                                                                <Check size={18} />
                                                            </button>
                                                            <button className="p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-all" title="Reject">
                                                                <X size={18} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-400 text-xs font-medium">No actions</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
        </>
    );
};

export default HRLeaveManagement;
