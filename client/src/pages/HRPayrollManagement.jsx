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
    TrendingUp,
    DollarSign,
    CreditCard
} from 'lucide-react';

const HRPayrollManagement = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const sidebarItems = [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/hr' },
        { label: 'Employees', icon: Users, path: '/dashboard/hr/employees' },
        { label: 'Attendance', icon: Calendar, path: '/dashboard/hr/attendance' },
        { label: 'Leave Management', icon: ClipboardList, path: '/dashboard/hr/leaves' },
        { label: 'Payroll', icon: BadgeDollarSign, path: '/dashboard/hr/payroll', active: true },
        { label: 'Payslip', icon: FileText, path: '/dashboard/hr/payslips' },
        { label: 'Notifications', icon: Bell, path: '/dashboard/hr/notifications' },
    ];

    const summaryCards = [
        { title: 'Total Payroll', value: '$186,400', subtext: 'March 2026', icon: DollarSign, color: 'blue' },
        { title: 'Avg Salary', value: '$4,250', subtext: '+3.2% YoY', icon: TrendingUp, color: 'green' },
        { title: 'Employees Paid', value: '189 / 248', subtext: '76.2%', icon: Users, color: 'purple' },
        { title: 'Pending Amount', value: '$42,600', subtext: '59 remaining', icon: CreditCard, color: 'red' }
    ];

    const mockPayroll = [
        { id: 1, employee: 'Sarah Johnson', department: 'Engineering', base: '$5,200', deductions: '$780', net: '$4,420', status: 'Paid' },
        { id: 2, employee: 'Mike Chen', department: 'Design', base: '$4,800', deductions: '$720', net: '$4,080', status: 'Paid' },
        { id: 3, employee: 'Emily Davis', department: 'Marketing', base: '$4,500', deductions: '$675', net: '$3,825', status: 'Pending' },
        { id: 4, employee: 'Alex Kim', department: 'HR', base: '$4,200', deductions: '$630', net: '$3,570', status: 'Pending' },
        { id: 5, employee: 'Lisa Wang', department: 'Finance', base: '$4,600', deductions: '$690', net: '$3,910', status: 'Paid' },
        { id: 6, employee: 'James Brown', department: 'Engineering', base: '$5,000', deductions: '$750', net: '$4,250', status: 'Processing' }
    ];

    const filteredPayroll = mockPayroll.filter(req => 
        req.employee.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const StatusBadge = ({ status }) => {
        const styles = {
            Paid: { bg: '#DCFCE7', text: '#166534' }, // Green
            Pending: { bg: '#FEF9C3', text: '#854D0E' }, // Yellow
            Processing: { bg: '#DBEAFFEF', text: '#1E40AF' } // Blue
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

    const CardIcon = ({ icon: Icon, color }) => {
        const colors = {
            blue: 'bg-blue-100 text-blue-600',
            green: 'bg-green-100 text-green-600',
            purple: 'bg-purple-100 text-purple-600',
            red: 'bg-red-100 text-red-600'
        };
        return (
            <div className={`w-12 h-12 rounded-2xl ${colors[color]} flex items-center justify-center mb-4 shadow-sm`}>
                <Icon size={24} />
            </div>
        );
    };

    return (
        <>
            {/* Page Header */}
            <div className="mb-8">
                <h2 className="text-[28px] font-semibold text-slate-900 mb-1">Payroll Management</h2>
                <p className="text-slate-500 text-sm">Salary calculations and payment tracking</p>
            </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {summaryCards.map((card, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                <CardIcon icon={card.icon} color={card.color} />
                                <p className="text-sm font-medium text-slate-500 mb-1 uppercase tracking-wider">{card.title}</p>
                                <h3 className="text-2xl font-bold text-slate-900 mb-1">{card.value}</h3>
                                <p className={`text-xs font-semibold ${card.color === 'green' ? 'text-green-600' : 'text-slate-400'}`}>
                                    {card.subtext}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Table Container */}
                    <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100">
                                        {['EMPLOYEE', 'DEPARTMENT', 'BASE SALARY', 'DEDUCTIONS', 'NET PAY', 'STATUS'].map((col, i) => (
                                            <th key={i} className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                                                {col}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredPayroll.map((row, idx) => {
                                        const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                                        return (
                                            <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div 
                                                            style={{ backgroundColor: avatarColor.bg, color: avatarColor.text }}
                                                            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm"
                                                        >
                                                            {getInitials(row.employee)}
                                                        </div>
                                                        <span className="font-bold text-slate-900 text-sm whitespace-nowrap">{row.employee}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">
                                                        {row.department}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-sm font-medium text-slate-700">{row.base}</td>
                                                <td className="px-6 py-5 text-sm font-medium text-red-500">{row.deductions}</td>
                                                <td className="px-6 py-5 text-sm font-bold text-slate-900">{row.net}</td>
                                                <td className="px-6 py-5">
                                                    <StatusBadge status={row.status} />
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

export default HRPayrollManagement;
