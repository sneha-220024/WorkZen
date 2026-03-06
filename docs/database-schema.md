# Database Schema

## User
- _id, name, email, password, role, createdAt

## Employee
- _id, userId, department, position, salary, joiningDate

## Attendance
- _id, employeeId, date, status, checkIn, checkOut

## Leave
- _id, employeeId, type, startDate, endDate, reason, status

## Payroll
- _id, employeeId, month, year, basicSalary, deductions, netPay, payslipUrl
