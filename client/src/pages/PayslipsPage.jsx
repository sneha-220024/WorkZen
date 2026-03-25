import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, FileText } from 'lucide-react';
import PayslipTable from '../components/payslips/PayslipTable.jsx';

const PayslipsPage = () => {
    const [payslips, setPayslips] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPayslip, setSelectedPayslip] = useState(null);

    const fetchMyPayroll = async () => {
        try {
            setIsLoading(true);
            const userStr = localStorage.getItem('user');
            if (!userStr) return;
            const token = JSON.parse(userStr).token;

            const response = await axios.get('http://localhost:5001/api/employee/payroll', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                // Map backend payroll to table structure
                const formatted = response.data.data.map(p => ({
                    id: p._id,
                    month: `${p.month} ${p.year}`,
                    date: new Date(p.generatedAt || p.createdAt).toLocaleDateString(),
                    gross: `$${p.grossSalary?.toLocaleString()}`,
                    net: `$${p.netSalary?.toLocaleString()}`,
                    status: p.status
                }));
                setPayslips(formatted);
            }
        } catch (error) {
            console.error("Error fetching employee payroll", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMyPayroll();
    }, []);

    const handleView = (payslip) => {
        setSelectedPayslip(payslip);
    };

    const closeModal = () => {
        setSelectedPayslip(null);
    };

    const handleDownload = async (payslip) => {
        try {
            const userStr = localStorage.getItem('user');
            const token = JSON.parse(userStr).token;

            const response = await axios({
                url: `http://localhost:5001/api/employee/payslip/download/${payslip.id}`,
                method: 'GET',
                responseType: 'blob',
                headers: { Authorization: `Bearer ${token}` }
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Payslip_${payslip.month.replace(' ', '_')}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error downloading payslip", error);
            alert("No payslip found for this month. Please contact HR.");
        }
    };

    return (
        <div className="w-full relative">
            <header className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="font-sora font-bold text-3xl text-slate-800 mb-2">My Payslips</h2>
                    <p className="text-slate-500">View and download your monthly salary statements</p>
                </div>
            </header>

            {isLoading ? (
                <div className="py-12 text-center text-slate-400">Loading your records...</div>
            ) : (
                <PayslipTable
                    payslips={payslips}
                    onView={handleView}
                    onDownload={handleDownload}
                />
            )}

            {/* Payslip View Modal */}
            {selectedPayslip && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="relative p-6 border-b border-slate-100 bg-slate-50/50 flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                <FileText className="text-primary" size={24} />
                            </div>
                            <div className="flex-1 pr-8">
                                <h3 className="text-xl font-bold font-sora text-slate-800">Payslip Details</h3>
                                <p className="text-slate-500 text-sm mt-1">{selectedPayslip.month}</p>
                            </div>
                            <button 
                                onClick={closeModal}
                                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-4">
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 group hover:border-primary/20 transition-colors">
                                <div className="text-sm font-medium text-slate-500 mb-1">Gross Salary</div>
                                <div className="text-lg font-bold text-slate-800">{selectedPayslip.gross}</div>
                            </div>
                            
                            <div className="p-4 bg-green-50 rounded-xl border border-green-100 group hover:border-green-200 transition-colors">
                                <div className="text-sm font-medium text-green-700/70 mb-1">Net Payable</div>
                                <div className="text-xl font-bold text-green-700">{selectedPayslip.net}</div>
                            </div>

                            <div className="flex items-center justify-between pt-4 pb-2">
                                <span className="text-sm font-medium text-slate-500">Status</span>
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                                    {selectedPayslip.status}
                                </span>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-3">
                            <button 
                                onClick={closeModal}
                                className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                Close
                            </button>
                            <button 
                                onClick={() => {
                                    handleDownload(selectedPayslip);
                                }}
                                className="px-4 py-2 bg-primary hover:bg-primary-dark active:scale-95 text-white font-bold rounded-lg shadow-sm transition-all"
                            >
                                Download PDF
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PayslipsPage;
