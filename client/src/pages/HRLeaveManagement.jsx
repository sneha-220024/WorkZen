import React, { useContext, useState, useEffect, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { 
    PieChart as PieIcon, 
    BarChart3, 
    TrendingUp, 
    Users, 
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    CheckCircle2,
    Clock,
    XCircle
} from 'lucide-react';
import axios from 'axios';
import { 
    PieChart, Pie, Cell, 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line,
    AreaChart, Area
} from 'recharts';

const HRLeaveManagement = () => {
    const { user } = useContext(AuthContext);
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [totalEmployees, setTotalEmployees] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const userStr = localStorage.getItem('user');
            if (!userStr) return;
            const token = JSON.parse(userStr).token;

            const [leavesRes, employeesRes] = await Promise.all([
                axios.get('http://localhost:5005/api/hr/leaves', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get('http://localhost:5005/api/hr/employees', {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            if (leavesRes.data.success) {
                setLeaveRequests(leavesRes.data.data);
            }
            if (employeesRes.data.success) {
                setTotalEmployees(employeesRes.data.data.total || employeesRes.data.data.employees?.length || 0);
            }
        } catch (error) {
            console.error("Error fetching dashboard data", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // ── Data Processing for Charts ──────────────────────────────────────────

    // 1. Pie Chart: Overall leave distribution
    const statusData = useMemo(() => {
        const counts = { Approved: 0, Pending: 0, Rejected: 0 };
        leaveRequests.forEach(req => {
            if (counts[req.status] !== undefined) {
                counts[req.status]++;
            }
        });
        return [
            { name: 'Approved', value: counts.Approved, color: '#10B981' }, // Green-500
            { name: 'Pending', value: counts.Pending, color: '#F59E0B' },   // Amber-500
            { name: 'Rejected', value: counts.Rejected, color: '#EF4444' }   // Red-500
        ].filter(d => d.value > 0);
    }, [leaveRequests]);

    // 2. Bar Chart: Leaves per employee
    const employeeData = useMemo(() => {
        const counts = {};
        leaveRequests.forEach(req => {
            if (req.status === 'Approved') {
                const name = req.employeeId ? `${req.employeeId.firstName}` : 'Unknown';
                counts[name] = (counts[name] || 0) + 1;
            }
        });
        return Object.entries(counts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 8); // Top 8 employees
    }, [leaveRequests]);

    // 3. Line Chart: Monthly trends
    const trendData = useMemo(() => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentYear = new Date().getFullYear();
        const monthlyCounts = Array(12).fill(0);

        leaveRequests.forEach(req => {
            const date = new Date(req.startDate);
            if (date.getFullYear() === currentYear) {
                monthlyCounts[date.getMonth()]++;
            }
        });

        return months.map((month, index) => ({
            month,
            leaves: monthlyCounts[index]
        }));
    }, [leaveRequests]);

    // 4. Summary Stats
    const totalApproved = leaveRequests.filter(r => r.status === 'Approved').length;
    const leavePercentage = totalEmployees > 0 ? Math.round((totalApproved / totalEmployees) * 100) : 0;

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 font-medium animate-pulse">Analyzing leave data...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Leave Stats</h2>
                    <p className="text-slate-500 mt-1">Visual insights and analytics for employee leaves</p>
                </div>
                <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
                    <button onClick={fetchData} className="px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                        Refresh Data
                    </button>
                </div>
            </div>

            {/* Summary Cards with Donut Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1 bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center group hover:shadow-md transition-all">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Overall Leave %</p>
                    <div className="relative w-40 h-40">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { value: leavePercentage },
                                        { value: 100 - leavePercentage }
                                    ]}
                                    innerRadius={50}
                                    outerRadius={70}
                                    paddingAngle={5}
                                    dataKey="value"
                                    startAngle={90}
                                    endAngle={450}
                                >
                                    <Cell fill="#3B82F6" />
                                    <Cell fill="#F1F5F9" />
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-black text-slate-900">{leavePercentage}%</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Utilization</span>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: 'Approved', value: totalApproved, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+12%', items: leaveRequests.filter(r => r.status === 'Approved').length },
                        { label: 'Pending', value: leaveRequests.filter(r => r.status === 'Pending').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', trend: '-5%', items: leaveRequests.filter(r => r.status === 'Pending').length },
                        { label: 'Rejected', value: leaveRequests.filter(r => r.status === 'Rejected').length, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', trend: '+2%', items: leaveRequests.filter(r => r.status === 'Rejected').length },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 hover:shadow-md transition-all group">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                    <stat.icon size={24} />
                                </div>
                                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${stat.trend.startsWith('+') ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                    {stat.trend}
                                </span>
                            </div>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                            <h3 className="text-4xl font-black text-slate-900 mt-1">{stat.value}</h3>
                        </div>
                    ))}
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Distribution Pie Chart */}
                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Leave Distribution</h3>
                            <p className="text-sm text-slate-500">Breakdown by current status</p>
                        </div>
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                            <PieIcon size={20} />
                        </div>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    innerRadius={80}
                                    outerRadius={110}
                                    paddingAngle={8}
                                    dataKey="value"
                                    animationBegin={0}
                                    animationDuration={1500}
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Monthly Trends Line Chart */}
                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Monthly Trends</h3>
                            <p className="text-sm text-slate-500">Number of leaves per month ({new Date().getFullYear()})</p>
                        </div>
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                            <TrendingUp size={20} />
                        </div>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData}>
                                <defs>
                                    <linearGradient id="colorLeaves" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Area type="monotone" dataKey="leaves" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorLeaves)" animationDuration={2000} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Per Employee Bar Chart */}
                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 hover:shadow-md transition-all xl:col-span-2">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Leaves by Employee</h3>
                            <p className="text-sm text-slate-500">Top employees with approved leaves</p>
                        </div>
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                            <BarChart3 size={20} />
                        </div>
                    </div>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={employeeData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12, fontWeight: 600}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                                <Tooltip 
                                    cursor={{fill: '#F8FAFC'}}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="value" name="Approved Leaves" fill="#10B981" radius={[8, 8, 0, 0]} barSize={40} animationDuration={2500} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HRLeaveManagement;
