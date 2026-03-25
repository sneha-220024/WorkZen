import React from 'react';
import { X, Clock, Calendar, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { DailyAttendanceChart, MonthlyAttendanceChart } from './Charts';

const DUMMY_DAILY_DATA = [
    { day: 'Mon', hours: 8.5 },
    { day: 'Tue', hours: 9.0 },
    { day: 'Wed', hours: 7.8 },
    { day: 'Thu', hours: 8.2 },
    { day: 'Fri', hours: 8.0 },
    { day: 'Sat', hours: 0 },
    { day: 'Sun', hours: 0 },
];

const DUMMY_MONTHLY_DATA = [
    { month: 'Jan', rate: 95 },
    { month: 'Feb', rate: 98 },
    { month: 'Mar', rate: 92 },
    { month: 'Apr', rate: 96 },
    { month: 'May', rate: 97 },
    { month: 'Jun', rate: 94 },
];

const AttendanceAnalyticsModal = ({ isOpen, onClose, employeeName }) => {
    if (!isOpen) return null;

    const handleExport = () => {
        // Prepare CSV Content
        let csvContent = "data:text/csv;charset=utf-8,";
        
        // Add Header & Summary
        csvContent += `Attendance Report for ${employeeName}\n`;
        csvContent += `Punctuality Score,92%\n`;
        csvContent += `On-Time Count,188\n`;
        csvContent += `Late Arrivals,12\n\n`;

        // Add Daily Attendance Trend
        csvContent += "Daily Trend (Last 7 Days)\n";
        csvContent += "Day,Hours\n";
        DUMMY_DAILY_DATA.forEach(row => {
            csvContent += `${row.day},${row.hours}\n`;
        });

        csvContent += "\nMonthly Attendance Rate (Yearly View)\n";
        csvContent += "Month,Rate (%)\n";
        DUMMY_MONTHLY_DATA.forEach(row => {
            csvContent += `${row.month},${row.rate}\n`;
        });

        // Trigger Download
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Attendance_Report_${employeeName.replace(/\s+/g, '_')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white rounded-[32px] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="sticky top-0 bg-white/80 backdrop-blur-md px-8 py-6 border-b border-slate-100 flex items-center justify-between z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 leading-tight">Attendance Analytics</h2>
                        <p className="text-slate-500 text-sm mt-1 flex items-center gap-1.5">
                            Insights for <span className="font-semibold text-slate-800">{employeeName}</span>
                        </p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2.5 rounded-2xl hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-all active:scale-95"
                    >
                        <X size={20} strokeWidth={2.5} />
                    </button>
                </div>

                <div className="p-8 space-y-8">
                    {/* Summary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-blue-50/50 p-6 rounded-[24px] border border-blue-100 flex items-center gap-5 group hover:shadow-md hover:shadow-blue-50/20 transition-all">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-600 group-hover:scale-110 transition-transform">
                                <TrendingUp size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-blue-600/60 uppercase tracking-widest mb-1.5 line-clamp-1">Punctuality Score</p>
                                <p className="text-2xl font-black text-slate-900">92%</p>
                            </div>
                        </div>

                        <div className="bg-green-50/50 p-6 rounded-[24px] border border-green-100 flex items-center gap-5 group hover:shadow-md hover:shadow-green-50/20 transition-all">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-green-600 group-hover:scale-110 transition-transform">
                                <CheckCircle size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-green-600/60 uppercase tracking-widest mb-1.5 line-clamp-1">On-Time Count</p>
                                <p className="text-2xl font-black text-slate-900">188</p>
                            </div>
                        </div>

                        <div className="bg-orange-50/50 p-6 rounded-[24px] border border-orange-100 flex items-center gap-5 group hover:shadow-md hover:shadow-orange-50/20 transition-all">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-orange-600 group-hover:scale-110 transition-transform">
                                <AlertCircle size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-orange-600/60 uppercase tracking-widest mb-1.5 line-clamp-1">Late Arrivals</p>
                                <p className="text-2xl font-black text-slate-900">12</p>
                            </div>
                        </div>
                    </div>

                    {/* Charts Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Daily Trend */}
                        <div className="bg-white rounded-[28px] border border-slate-100 p-8 hover:shadow-lg transition-all shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                        <Clock size={20} />
                                    </div>
                                    <h3 className="font-bold text-slate-800">Daily Attendance Trend</h3>
                                </div>
                                <span className="bg-indigo-50 text-indigo-700 text-[11px] font-bold px-3 py-1.5 rounded-lg border border-indigo-100">
                                    Last 7 Days
                                </span>
                            </div>
                            <DailyAttendanceChart data={DUMMY_DAILY_DATA} />
                        </div>

                        {/* Monthly Rate */}
                        <div className="bg-white rounded-[28px] border border-slate-100 p-8 hover:shadow-lg transition-all shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                                        <Calendar size={20} />
                                    </div>
                                    <h3 className="font-bold text-slate-800">Monthly Attendance Rate</h3>
                                </div>
                                <span className="bg-purple-50 text-purple-700 text-[11px] font-bold px-3 py-1.5 rounded-lg border border-purple-100">
                                    Yearly View
                                </span>
                            </div>
                            <MonthlyAttendanceChart data={DUMMY_MONTHLY_DATA} />
                        </div>
                    </div>
                </div>
                
                {/* Footer Modal Action */}
                <div className="bg-slate-50 p-6 flex justify-end items-center px-8 border-t border-slate-100 space-x-3 rounded-b-[32px]">
                   <button 
                        onClick={onClose}
                        className="px-6 py-3 font-bold text-slate-600 text-sm hover:text-slate-900 transition-colors"
                    >
                        Close
                    </button>
                    <button 
                        className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-md shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all"
                        onClick={handleExport}
                    >
                       Export Report
                    </button>
                </div>
            </div>
        </div>
    );

};

export default AttendanceAnalyticsModal;
