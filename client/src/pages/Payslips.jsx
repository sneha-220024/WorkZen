import React, { useContext, useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';
import { 
    Download, 
    Eye,
    Search,
    User
} from 'lucide-react';
import GlobalSearchBar from '../components/common/GlobalSearchBar';

const Payslips = () => {
    const { user } = useContext(AuthContext);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [payrollRecords, setPayrollRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);

    const fetchPayrolls = async () => {
        try {
            setIsLoading(true);
            const userStr = localStorage.getItem('user');
            if (!userStr) return;
            const token = JSON.parse(userStr).token;

            const response = await axios.get('http://localhost:5005/api/hr/payroll', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setPayrollRecords(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching payrolls for payslips", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPayrolls();
    }, []);

    const handleGenerateAll = async () => {
        const month = prompt("Enter month (e.g., March):");
        const year = prompt("Enter year (e.g., 2026):");
        if (!month || !year) return;

        try {
            setIsGenerating(true);
            const userStr = localStorage.getItem('user');
            const token = JSON.parse(userStr).token;

            const response = await axios.post('http://localhost:5005/api/hr/payslip/generate-all', {
                month,
                year: parseInt(year)
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                alert(response.data.message);
                fetchPayrolls();
            }
        } catch (error) {
            console.error("Error generating all payslips", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleGenerateSingle = async (payrollId) => {
        try {
            const userStr = localStorage.getItem('user');
            const token = JSON.parse(userStr).token;

            const response = await axios.post(`http://localhost:5005/api/hr/payslip/generate/${payrollId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                fetchPayrolls();
            }
        } catch (error) {
            console.error("Error generating single payslip", error);
        }
    };

    const handleDownload = async (payrollId, employeeName) => {
        try {
            const userStr = localStorage.getItem('user');
            const token = JSON.parse(userStr).token;

            const response = await axios({
                url: `http://localhost:5005/api/hr/payslip/download/${payrollId}`,
                method: 'GET',
                responseType: 'blob',
                headers: { Authorization: `Bearer ${token}` }
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Payslip_${employeeName.replace(' ', '_')}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error downloading payslip", error);
            alert("No payslip found for this record. Generate it first.");
        }
    };

    const filtered = useMemo(() => {
        return payrollRecords.filter(p => {
            const firstName = p.employeeId?.firstName?.toLowerCase() || '';
            const lastName = p.employeeId?.lastName?.toLowerCase() || '';
            const empId = p.employeeId?.employeeId?.toLowerCase() || '';
            const search = debouncedSearchTerm.toLowerCase();
            return firstName.includes(search) || lastName.includes(search) || empId.includes(search);
        });
    }, [payrollRecords, debouncedSearchTerm]);

    const getInitials = (firstName, lastName) => {
        return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
    };

    return (
        <div className="w-full animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-[28px] font-bold text-slate-900 leading-tight">Payslip Generation</h1>
                    <p className="text-slate-500 text-sm mt-1">Generate and download employee payslips based on payroll records</p>
                </div>
                <button 
                    onClick={handleGenerateAll}
                    disabled={isGenerating}
                    className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-50"
                >
                    <Download size={18} />
                    <span>{isGenerating ? 'Processing...' : 'Generate All Payslips'}</span>
                </button>
            </div>

            {/* Global Search Bar */}
            <GlobalSearchBar 
                data={payrollRecords}
                onSearch={(term) => setDebouncedSearchTerm(term)}
                placeholder="Search payslips..."
                searchKeys={['employeeId.firstName', 'employeeId.lastName', 'employeeId.employeeId']}
                subtitleKey="employeeId.employeeId"
                icon={User}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    <div className="col-span-full py-12 text-center text-slate-400">Loading payroll records...</div>
                ) : filtered.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-slate-400">No payroll records found.</div>
                ) : filtered.map((p) => {
                    const fullName = `${p.employeeId?.firstName} ${p.employeeId?.lastName}`;
                    return (
                        <div key={p._id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                                    {getInitials(p.employeeId?.firstName, p.employeeId?.lastName)}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 leading-tight">{fullName}</h3>
                                    <p className="text-xs font-semibold text-slate-400 mt-0.5">{p.month} {p.year}</p>
                                </div>
                            </div>

                            <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-5 mb-6 flex-1">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-xs text-slate-500 font-bold uppercase">Gross Salary</span>
                                    <span className="text-sm font-bold text-slate-800">${p.grossSalary?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-xs text-slate-500 font-bold uppercase">Deductions</span>
                                    <span className="text-sm font-bold text-red-500">-${p.deductions?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                                    <span className="text-sm font-bold text-slate-800">Net Pay</span>
                                    <span className="text-lg font-black text-blue-600">${p.netSalary?.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mt-auto">
                                <button 
                                    onClick={() => handleDownload(p._id, fullName)}
                                    className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold transition-colors text-xs shadow-sm"
                                >
                                    <Download size={16} />
                                    <span>Download</span>
                                </button>
                                <button 
                                    onClick={() => handleGenerateSingle(p._id)}
                                    className="flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700 py-3 rounded-xl font-bold shadow-md transition-all text-xs"
                                >
                                    <span>Regenerate</span>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Payslips;
