import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';

const RoleRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (!allowedRoles.includes(user.role)) {
        // Redirect to their respective dashboard if they try to access the wrong one
        const fallback = user.role === 'hr' ? '/dashboard/hr' : '/dashboard/employee';
        return <Navigate to={fallback} />;
    }

    return children;
};

export const HRRoute = ({ children }) => (
    <RoleRoute allowedRoles={['hr']}>{children}</RoleRoute>
);

export const EmployeeRoute = ({ children }) => (
    <RoleRoute allowedRoles={['employee']}>{children}</RoleRoute>
);

export default RoleRoute;
