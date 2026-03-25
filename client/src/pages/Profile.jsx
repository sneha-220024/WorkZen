import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { 
    User, 
    Mail, 
    Phone, 
    Building2, 
    MapPin, 
    Calendar, 
    Hash, 
    ShieldCheck,
    Briefcase,
    Edit
} from 'lucide-react';
import Button from '../components/common/Button.jsx';
import toast from 'react-hot-toast';
import axios from 'axios';
import EditProfileModal from '../components/common/EditProfileModal.jsx';

export default function Profile() {
    const { user } = useContext(AuthContext);
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = user?.token;
                if (!token) return;
                const res = await axios.get('http://localhost:5005/api/employee/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    setEmployee(res.data.data);
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user, refreshTrigger]);

    const handleRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
        // Optionally reload window if Context needs full refresh without complex context updating: 
        // window.location.reload(); 
    };

    const handleEditClick = () => {
        setIsEditModalOpen(true);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    };

    const getInitials = (name) => {
        if (!name) return '??';
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const employeeId = employee?.employeeId || 'N/A';
    const department = employee?.department || 'N/A';
    const location = employee?.address || 'N/A';
    const phone = employee?.phone || 'N/A';
    const designation = employee?.designation || (user?.role === 'hr' ? 'HR Manager' : 'Employee');

    const infoCards = [
        {
            title: 'Personal Details',
            items: [
                { label: 'Email Address', value: user?.email || 'N/A', icon: Mail, color: 'text-blue-500', bg: 'bg-blue-50' },
                { label: 'Department', value: department, icon: Building2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                { label: 'Location', value: location, icon: MapPin, color: 'text-orange-500', bg: 'bg-orange-50' },
            ]
        },
        {
            title: 'Work Information',
            items: [
                { label: 'Phone Number', value: phone, icon: Phone, color: 'text-indigo-500', bg: 'bg-indigo-50' },
                { label: 'Job Role', value: designation, icon: Briefcase, color: 'text-rose-500', bg: 'bg-rose-50' },
                { label: 'Emergency Contact', value: employee?.emergencyContact || 'N/A', icon: User, color: 'text-rose-500', bg: 'bg-rose-50' },
                { label: 'Join Date', value: formatDate(employee?.joinDate || user?.createdAt), icon: Calendar, color: 'text-amber-500', bg: 'bg-amber-50' },
            ]
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 font-sora">My Profile</h1>
                    <p className="text-slate-500 mt-1 font-medium">Your personal and work information</p>
                </div>
                <Button 
                    variant="outline" 
                    className="flex items-center gap-2 border-slate-200 hover:bg-slate-50 text-slate-600 font-bold"
                    onClick={handleEditClick}
                >
                    <Edit size={18} />
                    Edit Profile
                </Button>
            </header>

            {/* Profile Summary Card */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-primary/10 transition-all duration-500"></div>
                
                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-[2.5rem] bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20 overflow-hidden text-4xl font-bold font-sora">
                            {user?.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                getInitials(user?.name)
                            )}
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-xl border-4 border-white shadow-lg">
                            <ShieldCheck size={16} />
                        </div>
                    </div>

                    <div className="text-center md:text-left">
                        <h2 className="text-3xl font-bold text-slate-900 font-sora mb-2">{user?.name || 'John Doe'}</h2>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                            <span className="px-4 py-1.5 rounded-full bg-slate-900 text-white text-xs font-bold uppercase tracking-widest">
                                {user?.role === 'hr' ? 'HR Manager' : 'Software Engineer'}
                            </span>
                            <span className="text-slate-400 font-bold">•</span>
                            <span className="text-slate-600 font-bold text-sm">{department}</span>
                            <span className="hidden sm:inline text-slate-400 font-bold">•</span>
                            <div className="flex items-center gap-1.5 text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                <Hash size={14} />
                                <span className="text-xs font-bold uppercase tracking-wider">ID: {employeeId}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {infoCards.map((section, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                        <h3 className="text-xl font-bold text-slate-900 font-sora mb-8 flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                            {section.title}
                        </h3>
                        <div className="space-y-8">
                            {section.items.map((item, i) => (
                                <div key={i} className="flex items-center gap-5 group">
                                    <div className={`${item.bg} ${item.color} w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                                        <item.icon size={22} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">{item.label}</p>
                                        <p className="text-base font-bold text-slate-900">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <EditProfileModal 
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onRefresh={handleRefresh}
                employeeData={employee}
                userData={user}
            />
        </div>
    );
}
