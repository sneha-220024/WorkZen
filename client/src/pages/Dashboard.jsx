import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import Button from '../components/common/Button.jsx';

export default function Dashboard() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-background p-8 font-inter">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="font-sora font-bold text-4xl text-text-primary">
                            Welcome back, <span className="text-primary">{user?.name}</span>
                        </h1>
                        <p className="text-text-secondary mt-1">Here's what's happening in your workspace today.</p>
                    </div>
                    <Button variant="outline" onClick={handleLogout}>
                        Logout
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl shadow-card border border-border-color h-40 flex items-center justify-center text-text-secondary italic">
                            Stats Card {i} Placeholder
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
