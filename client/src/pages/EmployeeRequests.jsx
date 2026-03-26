import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getAllRequestsHR, updateRequestStatusHR } from '../services/requestService';

const EmployeeRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            const data = await getAllRequestsHR();
            if (data.success) {
                setRequests(data.data);
            }
        } catch (error) {
            console.error('Error fetching requests:', error);
            toast.error('Failed to load employee requests');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
        const interval = setInterval(fetchRequests, 15000); // Poll every 15s
        return () => clearInterval(interval);
    }, []);

    const handleAction = async (id, status) => {
        try {
            const result = await updateRequestStatusHR(id, status);
            if (result.success) {
                toast.success(`Request ${status} successfully`);
                fetchRequests();
            }
        } catch (error) {
            console.error(`Error updating request to ${status}:`, error);
            toast.error(`Failed to ${status} request`);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Approved': return 'bg-green-100 text-green-700';
            case 'Rejected': return 'bg-red-100 text-red-700';
            default: return 'bg-yellow-100 text-yellow-700';
        }
    };

    return (
        <div className="w-full space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="font-sora font-bold text-3xl text-slate-900 mb-2">Employee Requests</h2>
                    <p className="text-slate-500 font-medium">Review and manage requests from employees</p>
                </div>
            </header>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b border-slate-50">
                    <h3 className="text-xl font-bold text-slate-900 font-sora">All Requests</h3>
                </div>
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-8 text-center text-slate-500">Loading requests...</div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 text-slate-500 text-sm border-b border-slate-100">
                                    <th className="p-4 font-medium pl-6">Employee</th>
                                    <th className="p-4 font-medium">Request Type</th>
                                    <th className="p-4 font-medium">Subject</th>
                                    <th className="p-4 font-medium">Date</th>
                                    <th className="p-4 font-medium">Status</th>
                                    <th className="p-4 font-medium text-center pr-6">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="p-8 text-center text-slate-500">
                                            No requests found
                                        </td>
                                    </tr>
                                ) : (
                                    requests.map(req => (
                                        <tr key={req._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                            <td className="p-4 pl-6">
                                                <div className="text-sm font-medium text-slate-900">
                                                    {req.employeeId?.firstName} {req.employeeId?.lastName}
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    {req.employeeId?.employeeId}
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm text-slate-600">{req.type}</td>
                                            <td className="p-4 text-sm text-slate-600 truncate max-w-[200px]" title={req.description}>
                                                <div className="font-medium text-slate-800">{req.subject}</div>
                                                <div className="text-xs text-slate-500 truncate">{req.description}</div>
                                            </td>
                                            <td className="p-4 text-sm text-slate-600">
                                                {new Date(req.appliedAt).toLocaleDateString()}
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusStyle(req.status)}`}>
                                                    {req.status}
                                                </span>
                                            </td>
                                            <td className="p-4 pr-6 text-center">
                                                {req.status === 'Pending' ? (
                                                    <div className="flex justify-center gap-2">
                                                        <button 
                                                            onClick={() => handleAction(req._id, 'Approved')}
                                                            className="px-3 py-1 bg-green-50 text-green-600 text-xs font-semibold rounded-md hover:bg-green-100 transition-colors"
                                                        >
                                                            Accept
                                                        </button>
                                                        <button 
                                                            onClick={() => handleAction(req._id, 'Rejected')}
                                                            className="px-3 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded-md hover:bg-red-100 transition-colors"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400 text-sm">Resolved</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmployeeRequests;
