import React, { useContext, useState, useEffect, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { 
    Users, 
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    CheckCircle2,
    Clock,
    XCircle,
    TrendingUp,
    BarChart3
} from 'lucide-react';
import axios from 'axios';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area
} from 'recharts';

const AttendanceAnalytics = () => {
    const { user } = useContext(AuthContext);
    const [attendanceData, setAttendanceData] = useState([]);
    const [totalEmployees, setTotalEmployees] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const userStr = localStorage.getItem('user');
            if (!userStr) return;
            const token = JSON.parse(userStr).token;

            const [attendanceRes, employeesRes] = await Promise.all([
                axios.get('http://localhost:5005/api/hr/attendance/all', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get('http://localhost:5005/api/hr/employees', {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            if (attendanceRes.data.success) {
                setAttendanceData(attendanceRes.data.data);
            }
            if (employeesRes.data.success) {
                setTotalEmployees(employeesRes.data.data.total || employeesRes.data.data.employees?.length || 0);
            }
        } catch (error) {
            console.error("Error fetching attendance analytics data", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // ── Data Processing for Charts ──────────────────────────────────────────

    // 1. Line Chart: Monthly Attendance Trend
    const trendData = useMemo(() => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentYear = new Date().getFullYear();
        const monthlyCounts = Array(12).fill(0);

        attendanceData.forEach(rec => {
            const date = new Date(rec.date);
            if (date.getFullYear() === currentYear && rec.checkInTime) {
                monthlyCounts[date.getMonth()]++;
            }
        });

        return months.map((month, index) => ({
            month,
            present: monthlyCounts[index]
        }));
    }, [attendanceData]);

    // 2. Today's KPIs
    const kpis = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayRecords = attendanceData.filter(rec => {
            const d = new Date(rec.date);
            d.setHours(0, 0, 0, 0);
            return d.getTime() === today.getTime();
        });

        const presentToday = todayRecords.length;
        const lateToday = todayRecords.filter(r => r.status === 'Late').length;
        const absentToday = Math.max(0, totalEmployees - presentToday);
        const attendancePercentage = totalEmployees > 0 ? Math.round((presentToday / totalEmployees) * 100) : 0;

        return {
            attendancePercentage,
            presentToday,
            absentToday,
            lateToday
        };
    }, [attendanceData, totalEmployees]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 font-medium animate-pulse">Analyzing attendance patterns...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Attendance Analytics</h2>
                    <p className="text-slate-500 mt-1">Insights and analytics of employee attendance</p>
                </div>
                <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
                    <button onClick={fetchData} className="px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                        Refresh Data
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center group hover:shadow-md transition-all">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Overall Attendance %</p>
                    <div className="relative w-40 h-40">
                         <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-black text-blue-600">{kpis.attendancePercentage}%</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Daily Average</span>
                        </div>
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="80"
                                cy="80"
                                r="70"
                                stroke="currentColor"
                                strokeWidth="12"
                                fill="transparent"
                                className="text-slate-100"
                            />
                            <circle
                                cx="80"
                                cy="80"
                                r="70"
                                stroke="currentColor"
                                strokeWidth="12"
                                fill="transparent"
                                strokeDasharray={440}
                                strokeDashoffset={440 - (440 * kpis.attendancePercentage) / 100}
                                strokeLinecap="round"
                                className="text-blue-500 transition-all duration-1000 ease-out"
                            />
                        </svg>
                    </div>
                </div>

                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: 'Present Today', value: kpis.presentToday, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+5%', trendColor: 'bg-emerald-100 text-emerald-700' },
                        { label: 'Absent Today', value: kpis.absentToday, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', trend: '-2%', trendColor: 'bg-emerald-100 text-emerald-700' },
                        { label: 'Late Check-ins', value: kpis.lateToday, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', trend: '+1%', trendColor: 'bg-red-100 text-red-700' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 hover:shadow-md transition-all group">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                    <stat.icon size={24} />
                                </div>
                                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${stat.trendColor}`}>
                                    {stat.trend}
                                </span>
                            </div>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                            <h3 className="text-4xl font-black text-slate-900 mt-1">{stat.value}</h3>
                        </div>
                    ))}
                </div>
            </div>

            {/* Monthly Trends Line Chart */}
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Monthly Attendance Trend</h3>
                        <p className="text-sm text-slate-500">Number of present employees per month ({new Date().getFullYear()})</p>
                    </div>
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                        <TrendingUp size={20} />
                    </div>
                </div>
                <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData}>
                            <defs>
                                <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
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
                            <Area 
                                type="monotone" 
                                dataKey="present" 
                                stroke="#6366F1" 
                                strokeWidth={3} 
                                fillOpacity={1} 
                                fill="url(#colorPresent)" 
                                animationDuration={2000} 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AttendanceAnalytics;
