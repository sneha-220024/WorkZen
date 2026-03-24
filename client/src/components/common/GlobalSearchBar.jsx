import React, { useState, useEffect, useRef } from 'react';
import { Search, X, User, ArrowRight } from 'lucide-react';

/**
 * GlobalSearchBar Component
 * A modern, overlay-style (command palette) search bar for HR modules.
 * 
 * @param {string} placeholder - Input placeholder text
 * @param {Array} data - The dataset to search through
 * @param {Array} searchKeys - Keys within the data objects to search (e.g., ['employeeId.firstName', 'employeeId.lastName'])
 * @param {function} onSearch - Callback fired on every input change (debounced)
 * @param {function} onResultClick - Callback fired when a dropdown result is clicked
 * @param {string} subtitleKey - Key for the subtitle in the dropdown result
 * @param {React.ElementType} icon - Icon to show next to results
 */
const GlobalSearchBar = ({ 
    placeholder = "Search employees...", 
    data = [], 
    onSearch, 
    onResultClick,
    searchKeys = ['employeeId.firstName', 'employeeId.lastName', 'employeeId.employeeId'],
    subtitleKey = 'employeeId.employeeId',
    icon: Icon = User
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            if (onSearch) onSearch(searchTerm);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm, onSearch]);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Extract value from nested object using string path (e.g., 'employeeId.firstName')
    const getValueByPath = (obj, path) => {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };

    // Filter data for dropdown results
    const filteredResults = debouncedSearch === '' ? [] : data.filter(item => {
        return searchKeys.some(key => {
            const value = getValueByPath(item, key);
            return String(value || '').toLowerCase().includes(debouncedSearch.toLowerCase());
        });
    }).slice(0, 5); // Limit to top 5 results to keep overlay clean

    const handleClear = () => {
        setSearchTerm('');
        setIsOpen(false);
        if (onSearch) onSearch('');
    };

    const highlightText = (text, highlight) => {
        if (!text) return '';
        if (!highlight.trim()) return text;
        const parts = String(text).split(new RegExp(`(${highlight})`, 'gi'));
        return (
            <span>
                {parts.map((part, i) => (
                    part.toLowerCase() === highlight.toLowerCase() ? 
                    <span key={i} className="text-indigo-600 font-bold underline decoration-indigo-200 decoration-2 underline-offset-2">{part}</span> : 
                    part
                ))}
            </span>
        );
    };

    return (
        <div ref={wrapperRef} className="relative w-full max-w-md mb-8 z-[100]">
            {/* Search Input Group */}
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder}
                    className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pl-12 pr-12 outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 shadow-sm transition-all text-sm font-medium text-slate-700 placeholder:text-slate-400"
                />
                {searchTerm && (
                    <button 
                        onClick={handleClear}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-all"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* Dropdown Results Overlay */}
            {isOpen && debouncedSearch && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-100 shadow-2xl shadow-indigo-100/50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-2">
                        {filteredResults.length > 0 ? (
                            <>
                                <p className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 mb-1">
                                    Search Results
                                </p>
                                {filteredResults.map((item, idx) => {
                                    const firstName = getValueByPath(item, searchKeys[0]) || '';
                                    const lastName = getValueByPath(item, searchKeys[1]) || '';
                                    const title = `${firstName} ${lastName}`.trim();
                                    const subtitle = getValueByPath(item, subtitleKey) || 'No ID';
                                    
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                if (onResultClick) onResultClick(item);
                                                setIsOpen(false);
                                            }}
                                            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-indigo-50/50 group transition-all text-left"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:shadow-sm transition-all">
                                                    <Icon size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 leading-tight">
                                                        {highlightText(title, debouncedSearch)}
                                                    </p>
                                                    <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                                                        {subtitle}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] text-slate-300 font-bold uppercase opacity-0 group-hover:opacity-100 transition-opacity">Select</span>
                                                <ArrowRight size={16} className="text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                            </div>
                                        </button>
                                    );
                                })}
                            </>
                        ) : (
                            <div className="p-8 text-center">
                                <p className="text-sm font-bold text-slate-400">No results found for "{debouncedSearch}"</p>
                                <p className="text-xs text-slate-400 mt-1">Try a different name or employee ID</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GlobalSearchBar;
