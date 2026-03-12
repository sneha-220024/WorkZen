import React from 'react';
import PayslipRow from './PayslipRow.jsx';

const PayslipTable = ({ payslips, onView, onDownload }) => {
    return (
        <div className="bg-white rounded-2xl shadow-card border border-border-color overflow-hidden mt-8">
            <div className="p-6 border-b border-border-color flex justify-between items-center">
                <h3 className="font-sora font-bold text-xl text-text-primary">Recent Payslips</h3>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                        <tr className="bg-background border-b border-border-color text-text-secondary text-sm">
                            <th className="p-4 font-semibold whitespace-nowrap">Month</th>
                            <th className="p-4 font-semibold whitespace-nowrap">Date Generated</th>
                            <th className="p-4 font-semibold whitespace-nowrap">Gross Salary</th>
                            <th className="p-4 font-semibold whitespace-nowrap">Net Salary</th>
                            <th className="p-4 font-semibold whitespace-nowrap">Status</th>
                            <th className="p-4 font-semibold whitespace-nowrap">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payslips && payslips.length > 0 ? (
                            payslips.map((payslip) => (
                                <PayslipRow
                                    key={payslip.id}
                                    payslip={payslip}
                                    onView={onView}
                                    onDownload={onDownload}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="p-8 text-center text-text-secondary italic">
                                    No payslip records found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PayslipTable;
