import React, { useState, useEffect, useContext } from 'react';
import Button from '../components/common/Button.jsx';
import LeaveHistoryTable from '../components/leave/LeaveHistoryTable.jsx';
import LeaveApplicationForm from '../components/leave/LeaveApplicationForm.jsx';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';

const LeaveManagement = () => {
    const { user } = useContext(AuthContext);
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLeaves = async () => {
        try {
            setLoading(true);
            const token = user?.token;
            if (!token) return;
            const res = await axios.get('http://localhost:5001/api/employee/leaves/history', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setLeaves(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching leaves:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, [user]);

    const handleApplyLeave = async (leaveData) => {
        try {
            const token = user?.token;
            if (!token) return;

            // map fields if necessary
            const payload = {
                leaveType: leaveData.type,
                startDate: leaveData.fromDate,
                endDate: leaveData.toDate,
                reason: leaveData.reason
            };

            const res = await axios.post('http://localhost:5001/api/employee/leaves/apply', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                toast.success('Leave application submitted successfully');
                fetchLeaves();
                setIsApplyModalOpen(false);
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || 
                            (error.response?.data?.errors ? error.response.data.errors[0].message : null) || 
                            'Failed to submit leave application';
            toast.error(errorMsg);
        }
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
