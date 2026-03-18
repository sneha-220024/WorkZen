import React from 'react';

const LeaveHistoryTable = ({ leaves }) => {

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Approved':
                return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Approved</span>;
            case 'Rejected':
                return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">Rejected</span>;
            case 'Pending':
            default:
                return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">Pending</span>;
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateStr).toLocaleDateString(undefined, options);
    };

    return (
        <div className="bg-white rounded-2xl shadow-card border border-border-color overflow-hidden">
            <div className="p-6 border-b border-border-color">
                <h3 className="font-sora font-bold text-xl text-text-primary">Leave History</h3>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-background border-b border-border-color text-text-secondary text-sm">
                            <th className="p-4 font-semibold">Leave Type</th>
                            <th className="p-4 font-semibold">From Date</th>
                            <th className="p-4 font-semibold">To Date</th>
                            <th className="p-4 font-semibold text-center">Days</th>
                            <th className="p-4 font-semibold">Applied On</th>
                            <th className="p-4 font-semibold">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaves && leaves.length > 0 ? (
                            leaves.map((leave) => (
                                <tr key={leave._id || leave.id} className="border-b border-border-color hover:bg-background/50 transition-colors">
                                    <td className="p-4 text-text-primary font-medium">{leave.leaveType || leave.type}</td>
                                    <td className="p-4 text-text-secondary">{formatDate(leave.startDate || leave.fromDate)}</td>
                                    <td className="p-4 text-text-secondary">{formatDate(leave.endDate || leave.toDate)}</td>
                                    <td className="p-4 text-text-primary text-center font-medium">{leave.days}</td>
                                    <td className="p-4 text-text-secondary">{formatDate(leave.createdAt || leave.appliedAt || leave.appliedOn)}</td>
                                    <td className="p-4">{getStatusBadge(leave.status)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="p-8 text-center text-text-secondary italic">
                                    No leave records found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LeaveHistoryTable;
