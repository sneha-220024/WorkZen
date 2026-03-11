import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage.jsx';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';
import HRDashboard from '../pages/HRDashboard.jsx';
import EmployeeDashboard from '../pages/EmployeeDashboard.jsx';
 feature/emplyeedashboard(profile,attendance)
import Leaves from '../pages/Leaves.jsx';
import Payslips from '../pages/Payslips.jsx';
import Profile from '../pages/Profile.jsx';
import Documents from '../pages/Documents.jsx';
import Settings from '../pages/Settings.jsx';
import Attendance from '../pages/Attendance.jsx';
import Notifications from '../pages/Notifications.jsx';
import EmployeeDashboardStats from '../pages/EmployeeDashboardStats.jsx';
import LeaveManagement from '../pages/LeaveManagement.jsx';
import PayslipsPage from '../pages/PayslipsPage.jsx';
import NotificationsPage from '../pages/NotificationsPage.jsx';
 main
import ProtectedRoute from '../components/common/ProtectedRoute.jsx';
import DashboardLayout from '../components/common/DashboardLayout.jsx';
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
                        <DashboardLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<DashboardRedirect />} />
                
                <Route
                    path="employee"
                    element={
                        <EmployeeRoute>
                            <EmployeeDashboard />
                        </EmployeeRoute>
                    }
                />

                <Route
                    path="attendance"
                    element={
                        <EmployeeRoute>
                            <Attendance />
                        </EmployeeRoute>
                    }
                />

                <Route
                    path="leaves"
                    element={
                        <EmployeeRoute>
                            <Leaves />
                        </EmployeeRoute>
                    }
                />

                <Route
                    path="payslips"
                    element={
                        <EmployeeRoute>
                            <Payslips />
                        </EmployeeRoute>
                    }
                />

                <Route
                    path="profile"
                    element={
                        <EmployeeRoute>
                            <Profile />
                        </EmployeeRoute>
                    }
                />

                <Route
                    path="documents"
                    element={
                        <EmployeeRoute>
                            <Documents />
                        </EmployeeRoute>
                    }
                />

                <Route
                    path="notifications"
                    element={
                        <EmployeeRoute>
                            <Notifications />
                        </EmployeeRoute>
                    }
                />

                <Route
                    path="settings"
                    element={
                        <EmployeeRoute>
                            <Settings />
                        </EmployeeRoute>
                    }
                />
            </Route>

            <Route
                path="/dashboard/hr"
                element={
                    <HRRoute>
                        <HRDashboard />
                    </HRRoute>
                }
            />
 feature/emplyeedashboard(profile,attendance)


            <Route
                path="/dashboard/employee"
                element={
                    <EmployeeRoute>
                        <EmployeeDashboard />
                    </EmployeeRoute>
                }
            >
                <Route index element={<EmployeeDashboardStats />} />
                <Route path="leave" element={<LeaveManagement />} />
                <Route path="payslips" element={<PayslipsPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
            </Route>
main
        </Routes>
    );
}

// Helper to redirect from /dashboard to role-specific route
function DashboardRedirect() {
    const { user } = useContext(AuthContext);
    if (!user) return <Navigate to="/login" />;
    return <Navigate to={user.role === 'hr' ? '/dashboard/hr' : '/dashboard/employee'} />;
}
