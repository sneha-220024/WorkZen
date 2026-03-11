import React from 'react';

const PayslipRow = ({ payslip, onView, onDownload }) => {
    const getStatusBadge = (status) => {
        switch (status) {
            case 'Paid':
                return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Paid</span>;
            case 'Failed':
                return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">Failed</span>;
            case 'Pending':
            default:
                return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">Pending</span>;
        }
    };

    return (
        <tr className="border-b border-border-color hover:bg-background/50 transition-colors">
            <td className="p-4 text-text-primary font-medium">{payslip.month}</td>
            <td className="p-4 text-text-secondary">{payslip.date}</td>
            <td className="p-4 text-text-primary font-medium">{payslip.gross}</td>
            <td className="p-4 text-text-primary font-bold">{payslip.net}</td>
            <td className="p-4">{getStatusBadge(payslip.status)}</td>
            <td className="p-4 flex gap-3 items-center">
                <button
                    onClick={() => onView(payslip)}
                    className="p-2 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    title="View Payslip"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                </button>
                <button
                    onClick={() => onDownload(payslip)}
                    className="p-2 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    title="Download PDF"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                </button>
            </td>
        </tr>
    );
};

export default PayslipRow;
