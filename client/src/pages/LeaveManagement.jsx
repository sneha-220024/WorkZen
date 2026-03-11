import React, { useState } from 'react';
import Button from '../components/common/Button.jsx';
import LeaveHistoryTable from '../components/leave/LeaveHistoryTable.jsx';
import LeaveApplicationForm from '../components/leave/LeaveApplicationForm.jsx';

const LeaveManagement = () => {
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

    // Initial dummy data
    const [leaves, setLeaves] = useState([
        {
            id: '1',
            type: 'Vacation',
            fromDate: '2026-03-20',
            toDate: '2026-03-22',
            days: 3,
            appliedOn: '2026-03-10',
            status: 'Pending'
        },
        {
            id: '2',
            type: 'Sick Leave',
            fromDate: '2026-03-06',
            toDate: '2026-03-06',
            days: 1,
            appliedOn: '2026-03-05',
            status: 'Approved'
        },
        {
            id: '3',
            type: 'Personal Leave',
            fromDate: '2026-02-14',
            toDate: '2026-02-14',
            days: 1,
            appliedOn: '2026-02-10',
            status: 'Approved'
        },
        {
            id: '4',
            type: 'Vacation',
            fromDate: '2025-12-24',
            toDate: '2026-01-02',
            days: 10,
            appliedOn: '2025-12-01',
            status: 'Approved'
        }
    ]);

    const handleApplyLeave = (newLeave) => {
        // Add new leave to the top of the list
        setLeaves([newLeave, ...leaves]);
        setIsApplyModalOpen(false);
    };

    return (
        <div className="w-full">
            <header className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="font-sora font-bold text-3xl text-text-primary mb-2">Leave Management</h2>
                    <p className="text-text-secondary">Apply for leave and track your requests</p>
                </div>
                <Button onClick={() => setIsApplyModalOpen(true)}>
                    + Apply Leave
                </Button>
            </header>

            <LeaveHistoryTable leaves={leaves} />

            {isApplyModalOpen && (
                <LeaveApplicationForm
                    onClose={() => setIsApplyModalOpen(false)}
                    onSubmit={handleApplyLeave}
                />
            )}
        </div>
    );
};

export default LeaveManagement;
