import React from 'react';
import Button from '../components/common/Button.jsx';

const EmployeeDashboardStats = () => {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-card border border-border-color flex flex-col items-center">
                    <p className="text-text-secondary text-sm mb-4 font-semibold uppercase">Daily Attendance</p>
                    <div className="flex gap-4">
                        <Button>Check In</Button>
                        <Button variant="outline">Check Out</Button>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-card border border-border-color">
                    <p className="text-text-secondary text-sm mb-1 font-semibold uppercase">Leaves Remaining</p>
                    <h3 className="text-3xl font-bold text-primary">12 Days</h3>
                    <p className="text-xs text-text-secondary mt-2">Annual Leave quota</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-card border border-border-color">
                    <p className="text-text-secondary text-sm mb-1 font-semibold uppercase">Last Payslip</p>
                    <h3 className="text-xl font-bold text-text-primary">February 2026</h3>
                    <p className="text-primary text-sm font-bold mt-2 cursor-pointer hover:underline">View Details →</p>
                </div>
            </div>

            <div className="mt-10 bg-white p-8 rounded-2xl shadow-card border border-border-color">
                <h4 className="font-sora font-bold text-xl mb-6">Quick Actions</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 border border-border-color rounded-xl text-center hover:bg-primary/5 transition-colors cursor-not-allowed">
                        <span className="block text-2xl mb-2">🏖️</span>
                        <span className="font-semibold text-text-primary">Apply Leave</span>
                    </div>
                    <div className="p-4 border border-border-color rounded-xl text-center hover:bg-primary/5 transition-colors cursor-not-allowed">
                        <span className="block text-2xl mb-2">👤</span>
                        <span className="font-semibold text-text-primary">Edit Profile</span>
                    </div>
                    <div className="p-4 border border-border-color rounded-xl text-center hover:bg-primary/5 transition-colors cursor-not-allowed">
                        <span className="block text-2xl mb-2">📄</span>
                        <span className="font-semibold text-text-primary">View Documents</span>
                    </div>
                    <div className="p-4 border border-border-color rounded-xl text-center hover:bg-primary/5 transition-colors cursor-not-allowed">
                        <span className="block text-2xl mb-2">⚙️</span>
                        <span className="font-semibold text-text-primary">Account Settings</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EmployeeDashboardStats;
