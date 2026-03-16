import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Button from '../components/common/Button.jsx';
import { Clock, Calendar, CheckCircle2, XCircle, AlertCircle, History } from 'lucide-react';

const getToken = () => {
    try {
        const stored = localStorage.getItem('user');
        if (!stored) return null;
        const parsed = JSON.parse(stored);
        return parsed.token || parsed.data?.token || null;
    } catch {
        return null;
    }
};

const getTodayLocal = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export default function Attendance() {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [todayRecord, setTodayRecord] = useState(null);
    const [checkInLoading, setCheckInLoading] = useState(false);
    const [checkOutLoading, setCheckOutLoading] = useState(false);

    useEffect(() => {
        fetchAttendance();
    }, []);

    const fetchAttendance = async () => {
        try {
            setLoading(true);
            const token = getToken();
            if (!token) return;
            const res = await axios.get('http://localhost:5000/api/employee/attendance/history', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const records = res.data.data || [];
            setAttendanceRecords(records);
            
            // More robust today matching
            const today = new Date();
            const todayDateStr = today.toLocaleDateString();
            const todayRec = records.find(r => new Date(r.date).toLocaleDateString() === todayDateStr);
            
            setTodayRecord(todayRec || null);
        } catch (error) {
            console.error('Error fetching attendance:', error);
            if (error.response?.status === 404) {
                toast.error('Employee profile not found. Please contact HR.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCheckIn = async () => {
        const token = getToken();
        if (!token) return;
        try {
            setCheckInLoading(true);
            const res = await axios.post(
                'http://localhost:5000/api/employee/attendance/check-in',
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Checked in successfully!');
            fetchAttendance();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to check in');
        } finally {
            setCheckInLoading(false);
        }
    };

    const handleCheckOut = async () => {
        const token = getToken();
        if (!token) return;
        try {
            setCheckOutLoading(true);
            const res = await axios.post(
                'http://localhost:5000/api/employee/attendance/check-out',
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Checked out successfully!');
            fetchAttendance();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to check out');
        } finally {
            setCheckOutLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Present': return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 uppercase tracking-tighter">Present</span>;
            case 'Absent': return <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 uppercase tracking-tighter">Absent</span>;
            case 'Working': return <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 uppercase tracking-tighter">Working</span>;
            case 'Late': return <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-600 uppercase tracking-tighter">Late</span>;
            default: return <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-50 text-slate-600 uppercase tracking-tighter">{status}</span>;
        }
    };

    const formatTime = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const hasCheckedIn = !!(todayRecord?.checkInTime);
    const hasCheckedOut = !!(todayRecord?.checkOutTime);
    const canCheckIn = !hasCheckedIn;
    const canCheckOut = hasCheckedIn && !hasCheckedOut;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header>
                <h1 className="text-3xl font-bold text-slate-900 font-sora">My Attendance</h1>
                <p className="text-slate-500 mt-1 font-medium">Track your daily work hours and check-in history</p>
            </header>

            {/* Today's Card */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex items-start gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Clock size={32} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 font-sora mb-1">Today's Session</h3>
                        <p className="text-slate-500 font-medium mb-4">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                        <div className="flex flex-wrap gap-6">
                            <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                <span className="text-emerald-500"><CheckCircle2 size={16} /></span>
                                Check In: <span className="text-slate-900">{formatTime(todayRecord?.checkInTime)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                <span className="text-red-500"><XCircle size={16} /></span>
                                Check Out: <span className="text-slate-900">{formatTime(todayRecord?.checkOutTime)}</span>
                            </div>
                            {todayRecord?.totalHours > 0 && (
                                <div className="flex items-center gap-2 text-sm font-bold text-slate-700 bg-blue-50 px-3 py-1 rounded-lg text-blue-700">
                                    Total: {todayRecord.totalHours}h
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button
                        onClick={handleCheckIn}
                        disabled={!canCheckIn || checkInLoading}
                        className={`min-w-[140px] px-8 py-3 rounded-xl shadow-lg transition-all ${canCheckIn ? 'shadow-primary/20 hover:scale-105' : ''}`}
                    >
                        {hasCheckedIn ? 'Checked In' : 'Check In'}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleCheckOut}
                        disabled={!canCheckOut || checkOutLoading}
                        className={`min-w-[140px] px-8 py-3 rounded-xl transition-all ${canCheckOut ? 'hover:bg-red-50 hover:text-red-600 hover:border-red-200' : ''}`}
                    >
                        {hasCheckedOut ? 'Checked Out' : 'Check Out'}
                    </Button>
                </div>
            </div>

            {/* Attendance Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex items-center gap-3">
                    <History size={20} className="text-slate-400" />
                    <h3 className="text-xl font-bold text-slate-900 font-sora">Attendance History</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50">
                                {['Date', 'Check In', 'Check Out', 'Hours', 'Status'].map(col => (
                                    <th key={col} className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">{col}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-12 text-center text-slate-400 font-medium">Loading history...</td>
                                </tr>
                            ) : attendanceRecords.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-12 text-center text-slate-400 font-medium">No records found.</td>
                                </tr>
                            ) : (
                                attendanceRecords.map((record) => (
                                    <tr key={record._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-5 text-sm font-bold text-slate-900">{new Date(record.date).toLocaleDateString()}</td>
                                        <td className="px-8 py-5 text-sm font-medium text-slate-500">{formatTime(record.checkInTime)}</td>
                                        <td className="px-8 py-5 text-sm font-medium text-slate-500">{formatTime(record.checkOutTime)}</td>
                                        <td className="px-8 py-5 text-sm font-bold text-slate-900">{record.totalHours > 0 ? `${record.totalHours}h` : '-'}</td>
                                        <td className="px-8 py-5 text-sm">{getStatusBadge(record.status)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
