import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { 
    Download, 
    Eye,
    LayoutDashboard, 
    Users, 
    Calendar, 
    ClipboardList, 
    BadgeDollarSign, 
    FileText, 
    Bell, 
    Search,
    User as UserIcon
} from 'lucide-react';

const EMPLOYEES = [
    {
        id: 1,
        name: 'Sarah Johnson',
        gross: '$5,200',
        deduction: '$780',
        net: '$4,420',
        status: 'Generated',
        month: 'March 2026',
        avatarColor: 'bg-indigo-100 text-indigo-600'
    },
    {
        id: 2,
        name: 'Mike Chen',
        gross: '$4,800',
        deduction: '$720',
        net: '$4,080',
        status: 'Generated',
        month: 'March 2026',
        avatarColor: 'bg-orange-100 text-orange-600'
    },
    {
        id: 3,
        name: 'Emily Davis',
        gross: '$4,500',
        deduction: '$675',
        net: '$3,825',
        status: 'Pending',
        month: 'March 2026',
        avatarColor: 'bg-green-100 text-green-600'
    },
    {
        id: 4,
        name: 'Alex Kim',
        gross: '$4,200',
        deduction: '$630',
        net: '$3,570',
        status: 'Pending',
        month: 'March 2026',
        avatarColor: 'bg-pink-100 text-pink-600'
    },
    {
        id: 5,
        name: 'Lisa Wang',
        gross: '$4,600',
        deduction: '$690',
        net: '$3,910',
        status: 'Generated',
        month: 'March 2026',
        avatarColor: 'bg-blue-100 text-blue-600'
    }
];

const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const Payslips = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const sidebarItems = [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/hr' },
        { label: 'Employees', icon: Users, path: '/dashboard/hr/employees' },
        { label: 'Attendance', icon: Calendar, path: '/dashboard/hr/attendance' },
        { label: 'Leave Management', icon: ClipboardList, path: '/dashboard/hr/leaves' },
        { label: 'Payroll', icon: BadgeDollarSign, path: '/dashboard/hr/payroll' },
        { label: 'Payslip', icon: FileText, path: '/dashboard/hr/payslips', active: true },
        { label: 'Notifications', icon: Bell, path: '/dashboard/hr/notifications' },
    ];

    return (
        <>
            <div className="w-full animate-in fade-in duration-500">
                    {/* Page Header Section */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-[28px] font-bold text-slate-900 leading-tight">Payslip Generation</h1>
                            <p className="text-slate-500 text-sm mt-1">Generate and download employee payslips</p>
                        </div>
                        <button className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
                            <Download size={18} />
                            <span>Generate All Payslips</span>
                        </button>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {EMPLOYEES.map((emp) => (
                            <div 
                                key={emp.id} 
                                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col"
                            >
                                {/* Top Section */}
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-inner ${emp.avatarColor}`}>
                                        {getInitials(emp.name)}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 leading-tight">{emp.name}</h3>
                                        <p className="text-xs font-semibold text-slate-400 mt-0.5">{emp.month}</p>
                                    </div>
                                </div>

                                {/* Salary Details */}
                                <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-5 mb-6 flex-1">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-sm text-slate-500 font-bold uppercase tracking-wider">Gross</span>
                                        <span className="text-sm font-bold text-slate-800">{emp.gross}</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-sm text-slate-500 font-bold uppercase tracking-wider">Deductions</span>
                                        <span className="text-sm font-bold text-red-500">{emp.deduction}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                                        <span className="text-sm font-bold text-slate-800">Net Pay</span>
                                        <span className="text-lg font-black text-slate-950 underline decoration-indigo-200 decoration-4 underline-offset-4">{emp.net}</span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                {emp.status === 'Generated' ? (
                                    <div className="grid grid-cols-2 gap-3 mt-auto">
                                        <button className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold transition-colors text-xs shadow-sm">
                                            <Eye size={16} />
                                            <span>Preview</span>
                                        </button>
                                        <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all text-xs">
                                            <Download size={16} />
                                            <span>PDF</span>
                                        </button>
                                    </div>
                                ) : (
                                    <button className="w-full mt-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all text-xs">
                                        <span>Generate</span>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
        </>
    );
};

export default Payslips;

