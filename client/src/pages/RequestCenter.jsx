import React, { useState, useEffect, useContext } from 'react';
import Button from '../components/common/Button.jsx';
import { AuthContext } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';
import { BadgeDollarSign, AlertTriangle, FileText, Eye } from 'lucide-react';
import RequestFormModal from '../components/employee/RequestFormModal.jsx';
import RequestDetailsModal from '../components/employee/RequestDetailsModal.jsx';

const RequestCenter = () => {
    const { user } = useContext(AuthContext);
    const [requests, setRequests] = useState([]);
    
    // Modal states
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    
    // Pre-filled request type from Cards
    const [defaultRequestType, setDefaultRequestType] = useState('General Request');
    
    // Selected request for details
    const [selectedRequest, setSelectedRequest] = useState(null);

    // Initialize with dummy data on mount (since backend is not required)
    useEffect(() => {
        // Load from localStorage or mock
        const stored = localStorage.getItem('workzen_employee_requests');
        if (stored) {
            setRequests(JSON.parse(stored));
        } else {
            const mock = [
                { id: 'REQ-001', type: 'General Request', subject: 'New Monitor', date: new Date().toISOString().split('T')[0], status: 'Pending', description: 'Need a new monitor for work', priority: 'Medium' }
            ];
            setRequests(mock);
            localStorage.setItem('workzen_employee_requests', JSON.stringify(mock));
        }
    }, []);

    const handleOpenForm = (type = 'General Request') => {
        setDefaultRequestType(type);
        setIsFormOpen(true);
    };

    const handleSubmit = (formData) => {
        const newReq = {
            id: `REQ-00${requests.length + 2}`,
            date: new Date().toISOString().split('T')[0],
            status: 'Pending',
            ...formData
        };
        const updated = [newReq, ...requests];
        setRequests(updated);
        localStorage.setItem('workzen_employee_requests', JSON.stringify(updated));
        toast.success('Request submitted successfully');
        setIsFormOpen(false);
    };

    const handleViewDetails = (req) => {
        setSelectedRequest(req);
        setIsDetailsOpen(true);
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Approved': return 'bg-emerald-100 text-emerald-700';
            case 'Rejected': return 'bg-red-100 text-red-700';
            case 'In Review': return 'bg-blue-100 text-blue-700';
            default: return 'bg-amber-100 text-amber-700';
        }
    };

    return (
        <div className="w-full space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="font-sora font-bold text-3xl text-slate-900 mb-2">Request Center</h2>
                    <p className="text-slate-500 font-medium">Raise and track your requests</p>
                </div>
                <Button onClick={() => handleOpenForm('General Request')}>
                    + New Request
                </Button>
            </header>

            {/* Quick Actions (Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div 
                    onClick={() => handleOpenForm('Salary Hike')}
                    className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
                >
                    <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <BadgeDollarSign className="text-orange-500" size={24} />
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg mb-1">Salary Hike Request</h3>
                    <p className="text-sm text-slate-500">Request a review of your compensation</p>
                </div>
                
                <div 
                    onClick={() => handleOpenForm('Complaint')}
                    className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
                >
                    <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <AlertTriangle className="text-red-500" size={24} />
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg mb-1">Complaint Against Employee</h3>
                    <p className="text-sm text-slate-500">Report an issue confidentially</p>
                </div>

                <div 
                    onClick={() => handleOpenForm('General Request')}
                    className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
                >
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <FileText className="text-blue-500" size={24} />
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg mb-1">General Request</h3>
                    <p className="text-sm text-slate-500">IT assets, documents, or other needs</p>
                </div>
            </div>

            {/* Request History Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b border-slate-50">
                    <h3 className="text-xl font-bold text-slate-900 font-sora">Request History</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-500 text-sm border-b border-slate-100">
                                <th className="p-4 font-medium pl-6">Request ID</th>
                                <th className="p-4 font-medium">Request Type</th>
                                <th className="p-4 font-medium">Subject</th>
                                <th className="p-4 font-medium">Date Submitted</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium text-center pr-6">Action</th>
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
                                    <tr key={req.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4 pl-6 text-sm font-medium text-slate-900">{req.id}</td>
                                        <td className="p-4 text-sm text-slate-600">{req.type}</td>
                                        <td className="p-4 text-sm text-slate-600 truncate max-w-[200px]">{req.subject}</td>
                                        <td className="p-4 text-sm text-slate-600">{req.date}</td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusStyle(req.status)}`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="p-4 pr-6 text-center">
                                            <button 
                                                onClick={() => handleViewDetails(req)}
                                                className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals */}
            {isFormOpen && (
                <RequestFormModal 
                    onClose={() => setIsFormOpen(false)} 
                    onSubmit={handleSubmit} 
                    defaultType={defaultRequestType} 
                />
            )}

            {isDetailsOpen && (
                <RequestDetailsModal 
                    onClose={() => setIsDetailsOpen(false)} 
                    request={selectedRequest} 
                />
            )}
        </div>
    );
};

export default RequestCenter;
