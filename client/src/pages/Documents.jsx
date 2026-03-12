import React from 'react';
import Button from '../components/common/Button.jsx';
import { FileText, Download, Clock, Info } from 'lucide-react';

export default function Documents() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header>
                <h1 className="text-3xl font-bold text-slate-900 font-sora">My Documents</h1>
                <p className="text-slate-500 mt-1 font-medium">Access and download your employment related documents</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    { name: "Employment Contract", ext: "pdf", date: "Jan 1, 2025", size: "1.2 MB", type: "Contract" },
                    { name: "ID Copy", ext: "jpg", date: "Jan 5, 2025", size: "2.5 MB", type: "Identity" },
                    { name: "Code of Conduct", ext: "pdf", date: "Jan 1, 2025", size: "540 KB", type: "Policy" },
                ].map((doc, i) => (
                    <div key={i} className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-4 bg-slate-50 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary rounded-2xl transition-colors">
                                    <FileText size={32} />
                                </div>
                                <span className="bg-slate-50 px-3 py-1 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    {doc.type}
                                </span>
                            </div>
                            <h3 className="font-bold text-lg text-slate-900 mb-1 group-hover:text-primary transition-colors">{doc.name}.{doc.ext}</h3>
                            <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                                <span className="flex items-center gap-1"><Clock size={12} /> {doc.date}</span>
                                <span className="flex items-center gap-1"><Info size={12} /> {doc.size}</span>
                            </div>
                        </div>
                        <Button 
                            variant="outline" 
                            className="mt-8 py-3 rounded-2xl border-slate-100 text-slate-500 hover:text-primary hover:border-primary/20 hover:bg-primary/5 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all flex items-center justify-center gap-2 font-bold"
                        >
                            <Download size={18} />
                            Download
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
