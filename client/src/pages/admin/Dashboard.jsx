import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BarChart3, AlertTriangle, Users, CheckCircle, Clock, MapPin, TrendingUp, Loader2, AlertCircle, FileText, LayoutGrid, UserCheck, PieChart as PieChartIcon, Activity } from 'lucide-react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, LineChart, Line, Legend 
} from 'recharts';

const AdminDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [dashRes, analyticsRes, trendsRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/dashboard/admin', { headers: { 'x-auth-token': token } }),
                    axios.get('http://localhost:5000/api/analytics/overview', { headers: { 'x-auth-token': token } }),
                    axios.get('http://localhost:5000/api/analytics/trends', { headers: { 'x-auth-token': token } })
                ]);
                
                setData({
                    ...dashRes.data,
                    stats: analyticsRes.data.stats,
                    zoneData: analyticsRes.data.zoneData,
                    topCollectors: analyticsRes.data.topCollectors,
                    trends: trendsRes.data
                });
            } catch (err) {
                setError('Failed to fetch admin analytics. Please ensure "recharts" is installed.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
            </div>
        );
    }

    const { stats, problemAreas, zoneData, trends, topCollectors } = data || { 
        stats: { total: 0, resolved: 0, pending: 0, inProgress: 0, collectorsCount: 0 }, 
        problemAreas: [], 
        zoneData: [],
        trends: [],
        topCollectors: []
    };

    const statusPieData = [
        { name: 'Resolved', value: stats.resolved, color: '#10b981' },
        { name: 'Pending', value: stats.pending, color: '#f59e0b' },
        { name: 'In Progress', value: stats.inProgress, color: '#3b82f6' }
    ].filter(item => item.value > 0);

    return (
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fade-in">
            {/* Header Section */}
            <div className="mb-10 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-indigo-50">
                        👨‍💼
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                            Admin Dashboard
                        </h1>
                        <p className="text-slate-500 font-medium tracking-wide">City-wide waste management overview</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="px-5 py-2.5 bg-white border border-slate-200 rounded-2xl flex items-center space-x-2 shadow-sm">
                        <Activity className="text-emerald-500 w-5 h-5" />
                        <span className="text-slate-700 font-bold">System Online</span>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center space-x-3 text-rose-600 font-bold">
                    <AlertCircle size={20} />
                    <p>{error}</p>
                </div>
            )}

            {/* Top Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="glass-card p-6 rounded-[2rem] border-white/40 shadow-xl group hover:-translate-y-1 transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-colors duration-500">
                            <FileText size={20} />
                        </div>
                        <span className="text-xs font-black uppercase text-slate-400 tracking-widest">Total</span>
                    </div>
                    <span className="text-4xl font-black text-slate-900 tracking-tight">{stats.total}</span>
                    <p className="text-slate-400 text-xs font-bold mt-1">Reports received</p>
                </div>
                <div className="glass-card p-6 rounded-[2rem] border-white/40 shadow-xl group hover:-translate-y-1 transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-500">
                            <CheckCircle size={20} />
                        </div>
                        <span className="text-xs font-black uppercase text-emerald-600/70 tracking-widest">Resolved</span>
                    </div>
                    <span className="text-4xl font-black text-emerald-700 tracking-tight">{stats.resolved}</span>
                    <p className="text-emerald-600/50 text-xs font-bold mt-1">Issues fixed</p>
                </div>
                <div className="glass-card p-6 rounded-[2rem] border-white/40 shadow-xl group hover:-translate-y-1 transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors duration-500">
                            <Clock size={20} />
                        </div>
                        <span className="text-xs font-black uppercase text-amber-600/70 tracking-widest">Pending</span>
                    </div>
                    <span className="text-4xl font-black text-amber-700 tracking-tight">{stats.pending}</span>
                    <p className="text-amber-600/50 text-xs font-bold mt-1">Awaiting action</p>
                </div>
                <div className="glass-card p-6 rounded-[2rem] border-white/40 shadow-xl group hover:-translate-y-1 transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-500">
                            <Users size={20} />
                        </div>
                        <span className="text-xs font-black uppercase text-indigo-600/70 tracking-widest">Active</span>
                    </div>
                    <span className="text-4xl font-black text-indigo-700 tracking-tight">{stats.collectorsCount || 0}</span>
                    <p className="text-indigo-600/50 text-xs font-bold mt-1">Collectors in city</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
                {/* Visual Analytics Sections */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Monthly Trends - Line Chart */}
                    <div className="glass-card p-10 rounded-[2.5rem] shadow-xl border border-white/40 overflow-hidden relative group">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                                <Activity className="text-indigo-600" />
                                Reporting Trends
                            </h2>
                            <div className="px-4 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-black text-slate-400 tracking-widest uppercase">
                                Yearly View
                            </div>
                        </div>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={trends}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis 
                                        dataKey="month" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                                        dy={10}
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                                    />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px' }}
                                        itemStyle={{ fontWeight: 800, color: '#4f46e5' }}
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="reports" 
                                        stroke="#4f46e5" 
                                        strokeWidth={4} 
                                        dot={{ fill: '#4f46e5', r: 6, strokeWidth: 3, stroke: '#fff' }}
                                        activeDot={{ r: 8, strokeWidth: 0 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Status Breakdown - Pie Chart */}
                        <div className="glass-card p-8 rounded-[2.5rem] shadow-xl border border-white/40 flex flex-col items-center">
                            <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2 self-start">
                                <PieChartIcon className="text-indigo-600" size={20} />
                                Status Breakdown
                            </h2>
                            <div className="h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={statusPieData}
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={8}
                                            dataKey="value"
                                        >
                                            {statusPieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Legend verticalAlign="bottom" height={36}/>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Reports per Zone - Bar Chart */}
                        <div className="glass-card p-8 rounded-[2.5rem] shadow-xl border border-white/40 flex flex-col items-center">
                            <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2 self-start">
                                <MapPin className="text-indigo-600" size={20} />
                                Zone Activity
                            </h2>
                            <div className="h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={zoneData}>
                                        <XAxis 
                                            dataKey="name" 
                                            axisLine={false} 
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                        />
                                        <Tooltip 
                                            cursor={{fill: 'transparent'}}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                            cursorStyle={{ display: 'none' }}
                                        />
                                        <Bar dataKey="count" fill="#6366f1" radius={[10, 10, 10, 10]} barSize={30} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="lg:col-span-4 space-y-8">
                     {/* Quick Actions Card */}
                     <div className="glass-card p-8 rounded-[2.5rem] bg-indigo-900 text-white shadow-2xl relative overflow-hidden group border-none">
                        <div className="relative z-10">
                            <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                                <LayoutGrid size={24} className="text-indigo-400" />
                                Admin Panel
                            </h3>
                            <div className="space-y-4">
                                <Link to="/admin/reports" className="flex items-center justify-between p-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all group/item">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-300 group-hover/item:text-white transition-colors">
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <span className="font-extrabold block">All Reports</span>
                                            <span className="text-indigo-300/60 text-xs font-bold uppercase tracking-widest">Override Status</span>
                                        </div>
                                    </div>
                                    <TrendingUp size={18} className="text-white/20 group-hover/item:text-indigo-400 transition-colors" />
                                </Link>
                                <Link to="/admin/users" className="flex items-center justify-between p-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all group/item">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-300 group-hover/item:text-white transition-colors">
                                            <Users size={20} />
                                        </div>
                                        <div>
                                            <span className="font-extrabold block">Management</span>
                                            <span className="text-indigo-300/60 text-xs font-bold uppercase tracking-widest">Assign Zones</span>
                                        </div>
                                    </div>
                                    <UserCheck size={18} className="text-white/20 group-hover/item:text-amber-400 transition-colors" />
                                </Link>
                            </div>
                            <button 
                                onClick={async () => {
                                    const token = localStorage.getItem('token');
                                    try {
                                        await axios.post('http://localhost:5000/api/badges/seed', {}, { headers: { 'x-auth-token': token } });
                                        alert('Badges seeded successfully!');
                                    } catch (err) {
                                        alert('Failed to seed badges');
                                    }
                                }}
                                className="mt-4 w-full py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl font-black transition-all shadow-lg shadow-indigo-900/40 active:scale-95 flex items-center justify-center gap-2"
                            >
                                <Award size={20} />
                                SEED SYSTEM BADGES
                            </button>
                            <button className="mt-4 w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black transition-all shadow-lg shadow-emerald-900/40 active:scale-95">
                                EXPORT ANALYTICS PDF
                            </button>
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl" />
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-400/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                    </div>

                    {/* Top Performers List */}
                    <div className="glass-card p-10 rounded-[2.5rem] shadow-xl border border-white/40">
                        <h2 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
                            <TrendingUp className="text-emerald-500" size={24} />
                            Top Collectors
                        </h2>
                        <div className="space-y-4">
                            {topCollectors.length > 0 ? (
                                topCollectors.map((collector, index) => (
                                    <div key={index} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-white transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all font-black text-slate-400 text-sm">
                                                #{index + 1}
                                            </div>
                                            <div>
                                                <span className="font-black text-slate-800 block text-sm">{collector.name}</span>
                                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Performance High</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-indigo-600 font-extrabold text-lg block">{collector.completed}</span>
                                            <span className="text-slate-400 text-[10px] uppercase font-black">Resolved</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6 text-slate-400 font-bold italic">
                                    No performance data available
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

