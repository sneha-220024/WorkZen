import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage.jsx';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';
import HRDashboard from '../pages/HRDashboard.jsx';
import EmployeeDashboard from '../pages/EmployeeDashboard.jsx';
import ProtectedRoute from '../components/common/ProtectedRoute.jsx';
import { HRRoute, EmployeeRoute } from '../components/common/RoleRoute.jsx';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        {/* Auto-redirect to the correct role-specific dashboard */}
                        <DashboardRedirect />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/dashboard/hr"
                element={
                    <HRRoute>
                        <HRDashboard />
                    </HRRoute>
                }
            />

            <Route
                path="/dashboard/employee"
                element={
                    <EmployeeRoute>
                        <EmployeeDashboard />
                    </EmployeeRoute>
                }
            />
        </Routes>
    );
}

// Helper to redirect from /dashboard to role-specific route
function DashboardRedirect() {
    const { user } = useContext(AuthContext);
    if (!user) return <Navigate to="/login" />;
    return <Navigate to={user.role === 'hr' ? '/dashboard/hr' : '/dashboard/employee'} />;
}
