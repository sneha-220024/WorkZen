import React, { useState } from 'react';
import Button from '../common/Button.jsx';

const LeaveApplicationForm = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        leaveType: 'Vacation',
        startDate: '',
        endDate: '',
        reason: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Calculate number of days (basic calculation)
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        const newLeave = {
            id: Date.now(),
            type: formData.leaveType,
            fromDate: formData.startDate,
            toDate: formData.endDate,
            days: diffDays > 0 ? diffDays : 0,
            appliedOn: new Date().toISOString().split('T')[0],
            status: 'Pending',
            reason: formData.reason
        };

        onSubmit(newLeave);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl shadow-card w-full max-w-md p-6 border border-border-color">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-sora font-bold text-text-primary">Apply Leave</h3>
                    <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-text-secondary mb-1">Leave Type</label>
                        <select
                            name="leaveType"
                            value={formData.leaveType}
                            onChange={handleChange}
                            className="w-full p-2.5 rounded-xl border border-border-color bg-background text-text-primary focus:outline-none focus:border-primary transition-colors"
                            required
                        >
                            <option value="Vacation">Vacation</option>
                            <option value="Sick Leave">Sick Leave</option>
                            <option value="Personal Leave">Personal Leave</option>
                            <option value="Maternity Leave">Maternity Leave</option>
                            <option value="Paternity Leave">Paternity Leave</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-text-secondary mb-1">Start Date</label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                className="w-full p-2.5 rounded-xl border border-border-color bg-background text-text-primary focus:outline-none focus:border-primary transition-colors"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-text-secondary mb-1">End Date</label>
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                min={formData.startDate}
                                className="w-full p-2.5 rounded-xl border border-border-color bg-background text-text-primary focus:outline-none focus:border-primary transition-colors"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-text-secondary mb-1">Reason for Leave</label>
                        <textarea
                            name="reason"
                            value={formData.reason}
                            onChange={handleChange}
                            rows="3"
                            className="w-full p-2.5 rounded-xl border border-border-color bg-background text-text-primary focus:outline-none focus:border-primary transition-colors resize-none"
                            placeholder="Briefly explain the reason for your leave..."
                            required
                        ></textarea>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
                        <Button type="submit">Submit Request</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LeaveApplicationForm;
