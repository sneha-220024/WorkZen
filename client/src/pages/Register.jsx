import React from 'react';
import { Link } from 'react-router-dom';

export default function Register() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
                <h1 className="font-sora font-bold text-3xl text-text-primary mb-4">Register</h1>
                <p className="text-text-secondary mb-6">Coming soon — registration page</p>
                <Link to="/" className="text-primary hover:underline">← Back to Home</Link>
            </div>
        </div>
    );
}
