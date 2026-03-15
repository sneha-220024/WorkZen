import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage.jsx';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';
import HRDashboard from '../pages/HRDashboard.jsx';
import EmployeeDashboard from '../pages/EmployeeDashboard.jsx';
import Profile from '../pages/Profile.jsx';
import Documents from '../pages/Documents.jsx';
import Settings from '../pages/Settings.jsx';
import Attendance from '../pages/Attendance.jsx';
import LeaveManagement from '../pages/LeaveManagement.jsx';
import Payslips from '../pages/Payslips.jsx';
import PayslipsPage from '../pages/PayslipsPage.jsx';
import NotificationsPage from '../pages/NotificationsPage.jsx';
import Employees from '../pages/Employees.jsx';
import HRAttendance from '../pages/HRAttendance.jsx';
import HRLeaveManagement from '../pages/HRLeaveManagement.jsx';
import HRPayrollManagement from '../pages/HRPayrollManagement.jsx';
import ProtectedRoute from '../components/common/ProtectedRoute.jsx';
import DashboardLayout from '../components/common/DashboardLayout.jsx';
import { HRRoute, EmployeeRoute } from '../components/common/RoleRoute.jsx';
import { AuthContext } from '../context/AuthContext.jsx';
import HRLayout from '../components/common/HRLayout.jsx';
import HRNotificationsPanel from '../components/notifications/HRNotificationsPanel.jsx';

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
                            <LeaveManagement />
                        </EmployeeRoute>
                    }
                />

                <Route
                    path="payslips"
                    element={
                        <EmployeeRoute>
                            <PayslipsPage />
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
                            <NotificationsPage />
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
                        <HRLayout />
                    </HRRoute>
                }
            >
                <Route index element={<HRDashboard />} />
                <Route path="employees" element={<Employees />} />
                <Route path="attendance" element={<HRAttendance />} />
                <Route path="leaves" element={<HRLeaveManagement />} />
                <Route path="payroll" element={<HRPayrollManagement />} />
                <Route path="payslips" element={<Payslips />} />
                <Route path="notifications" element={<HRNotificationsPanel />} />
            </Route>
        </Routes>
    );
}

// Helper to redirect from /dashboard to role-specific route
function DashboardRedirect() {
    const { user } = useContext(AuthContext);
    if (!user) return <Navigate to="/login" />;
    return <Navigate to={user.role === 'hr' ? '/dashboard/hr' : '/dashboard/employee'} />;
}
