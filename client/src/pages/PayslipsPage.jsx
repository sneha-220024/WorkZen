import React, { useState } from 'react';
import PayslipTable from '../components/payslips/PayslipTable.jsx';
import Button from '../components/common/Button.jsx';

const PayslipsPage = () => {
    // Initial dummy data
    const [payslips] = useState([
        {
            id: '1',
            month: 'February 2026',
            date: 'Mar 1, 2026',
            gross: '$8,500',
            net: '$6,820',
            status: 'Paid'
        },
        {
            id: '2',
            month: 'January 2026',
            date: 'Feb 1, 2026',
            gross: '$8,500',
            net: '$6,820',
            status: 'Paid'
        },
        {
            id: '3',
            month: 'December 2025',
            date: 'Jan 1, 2026',
            gross: '$8,500',
            net: '$6,820',
            status: 'Paid'
        },
        {
            id: '4',
            month: 'November 2025',
            date: 'Dec 1, 2025',
            gross: '$8,000',
            net: '$6,400',
            status: 'Paid'
        },
        {
            id: '5',
            month: 'October 2025',
            date: 'Nov 1, 2025',
            gross: '$8,000',
            net: '$6,400',
            status: 'Paid'
        }
    ]);

    const handleView = (payslip) => {
        alert(`Viewing Payslip: ${payslip.month}\nGross: ${payslip.gross}\nNet: ${payslip.net}`);
    };

    const handleDownload = (payslip) => {
        // Mock download by creating a simple blob and trigger a download link
        const content = `Payslip Details\nMonth: ${payslip.month}\nGenerated On: ${payslip.date}\nGross Salary: ${payslip.gross}\nNet Salary: ${payslip.net}\nStatus: ${payslip.status}`;

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');

        a.href = url;
        a.download = `Payslip_${payslip.month.replace(' ', '_')}.txt`; // Providing .txt as mock because generating PDF client-side needs heavy libs
        document.body.appendChild(a);
        a.click();

        // Cleanup
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="w-full">
            <header className="flex justify-between items-end">
                <div>
                    <h2 className="font-sora font-bold text-3xl text-text-primary mb-2">Payslips</h2>
                    <p className="text-text-secondary">View and download your monthly payslips</p>
                </div>
            </header>

            <PayslipTable
                payslips={payslips}
                onView={handleView}
                onDownload={handleDownload}
            />
        </div>
    );
};

export default PayslipsPage;
