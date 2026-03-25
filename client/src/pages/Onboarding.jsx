import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import Button from '../components/common/Button.jsx';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function Onboarding() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [hrEmail, setHrEmail] = useState('');
    const [department, setDepartment] = useState('');
    const [loading, setLoading] = useState(false);

    const departments = [
        'Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!hrEmail || !department) {
            toast.error('Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/employee/onboard', { hrEmail, department });

            if (res.data.success) {
                toast.success('Onboarding complete!');
                navigate('/dashboard/employee');
            } else {
                toast.error(res.data.message || 'Onboarding failed');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-inter">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <h2 className="text-3xl font-sora font-extrabold text-text-primary">
                    Employee Onboarding
                </h2>
                <p className="mt-2 text-sm text-text-secondary">
                    Step 1 of 2
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-card border border-border-color rounded-2xl sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-semibold text-text-primary mb-1.5">
                                Full Name
                            </label>
                            <input
                                type="text"
                                disabled
                                value={user?.name || ''}
                                className="appearance-none block w-full px-4 py-3 border border-border-color rounded-xl bg-gray-50 text-text-secondary cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-text-primary mb-1.5">
                                Employee Email
                            </label>
                            <input
                                type="email"
                                disabled
                                value={user?.email || ''}
                                className="appearance-none block w-full px-4 py-3 border border-border-color rounded-xl bg-gray-50 text-text-secondary cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label htmlFor="hrEmail" className="block text-sm font-semibold text-text-primary mb-1.5">
                                HR Email
                            </label>
                            <input
                                id="hrEmail"
                                type="email"
                                required
                                value={hrEmail}
                                onChange={(e) => setHrEmail(e.target.value)}
                                className="appearance-none block w-full px-4 py-3 border border-border-color rounded-xl shadow-sm placeholder-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-text-primary"
                                placeholder="hr@company.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="department" className="block text-sm font-semibold text-text-primary mb-1.5">
                                Department
                            </label>
                            <select
                                id="department"
                                required
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                className="appearance-none block w-full px-4 py-3 border border-border-color rounded-xl shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-text-primary"
                            >
                                <option value="" disabled>Select Department</option>
                                {departments.map(dep => (
                                    <option key={dep} value={dep}>{dep}</option>
                                ))}
                            </select>
                        </div>

                        <div className="pt-2">
                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full justify-center py-3 shadow-glow"
                                loading={loading}
                            >
                                Continue
                            </Button>
                        </div>
                    </form>

                    <div className="mt-6 text-center text-sm text-text-secondary">
                        Need help? Contact HR
                    </div>
                </div>
            </div>
        </div>
    );
}
