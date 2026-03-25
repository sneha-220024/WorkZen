import React from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, AreaChart, Area
} from 'recharts';

export const DailyAttendanceChart = ({ data }) => {
    return (
        <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                            <stop offset="100%" stopColor="#818cf8" stopOpacity={0.8} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                        dataKey="day" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#64748b', fontSize: 12 }}
                    />
                    <Tooltip 
                        cursor={{ fill: '#f8fafc' }}
                        contentStyle={{ 
                            borderRadius: '12px', 
                            border: 'none', 
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                            fontSize: '12px',
                            fontWeight: '600'
                        }}
                    />
                    <Bar 
                        dataKey="hours" 
                        fill="url(#barGradient)" 
                        radius={[6, 6, 0, 0]} 
                        barSize={30}
                        animationDuration={1500}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export const MonthlyAttendanceChart = ({ data }) => {
    return (
        <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="lineOpacity" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.2} />
                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                        dataKey="month" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip 
                        contentStyle={{ 
                            borderRadius: '12px', 
                            border: 'none', 
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                            fontSize: '12px',
                            fontWeight: '600'
                        }}
                    />
                    <Area 
                        type="monotone" 
                        dataKey="rate" 
                        stroke="#8b5cf6" 
                        strokeWidth={3}
                        fill="url(#lineOpacity)"
                        animationDuration={1500}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};
