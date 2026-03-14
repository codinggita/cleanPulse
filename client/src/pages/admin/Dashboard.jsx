import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart3, AlertTriangle, Users, CheckCircle, Clock, MapPin, TrendingUp, Loader2, AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/dashboard/admin', {
                    headers: { 'x-auth-token': token }
                });
                setData(res.data);
            } catch (err) {
                setError('Failed to fetch admin analytics. Please try again.');
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

    const { stats, problemAreas, zoneStats } = data || { 
        stats: { total: 0, resolved: 0, pending: 0, collectorsCount: 0 }, 
        problemAreas: [], 
        zoneStats: [] 
    };

    return (
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fade-in">
            {/* Header Section */}
            <div className="mb-10 flex items-center space-x-4">
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

            {error && (
                <div className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center space-x-3 text-rose-600">
                    <AlertCircle size={20} />
                    <p className="font-bold">{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* City Waste Overview Card */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-card p-10 rounded-[2.5rem] shadow-xl border border-white/40 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-indigo-500/10 transition-all duration-700" />
                        
                        <div className="flex items-center justify-between mb-10 relative z-10">
                            <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-3">
                                <BarChart3 className="text-indigo-600 w-7 h-7" />
                                <span>City Waste Overview</span>
                            </h2>
                            <div className="px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold border border-indigo-100 italic">
                                Last 7 Days
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
                            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                <span className="block text-slate-400 text-xs font-bold mb-2 uppercase tracking-widest text-center">Total Reports</span>
                                <span className="block text-4xl font-black text-slate-900 text-center tracking-tight">{stats.total}</span>
                            </div>
                            <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                <span className="block text-emerald-600/70 text-xs font-bold mb-2 uppercase tracking-widest text-center">Resolved</span>
                                <span className="block text-4xl font-black text-emerald-700 text-center tracking-tight">{stats.resolved}</span>
                            </div>
                            <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                <span className="block text-amber-600/70 text-xs font-bold mb-2 uppercase tracking-widest text-center">Pending</span>
                                <span className="block text-4xl font-black text-amber-700 text-center tracking-tight">{stats.pending}</span>
                            </div>
                            <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100 hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                <span className="block text-indigo-600/70 text-xs font-bold mb-2 uppercase tracking-widest text-center">Collectors</span>
                                <span className="block text-4xl font-black text-indigo-700 text-center tracking-tight">{stats.collectorsCount}</span>
                            </div>
                        </div>
                    </div>

                    {/* Problem Areas List */}
                    <div className="glass-card p-10 rounded-[2.5rem] shadow-xl border border-white/40">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-3">
                                <AlertTriangle className="text-rose-500 w-7 h-7 animate-pulse" />
                                <span>Problem Areas This Week</span>
                            </h2>
                        </div>
                        
                        <div className="space-y-5">
                            {problemAreas.length > 0 ? (
                                problemAreas.map((area, index) => (
                                    <div key={index} className="flex items-center justify-between p-7 bg-slate-50/50 rounded-3xl border border-slate-100 hover:border-indigo-200 hover:bg-white transition-all group">
                                        <div className="flex items-center space-x-6">
                                            <span className="text-2xl font-black text-slate-300 group-hover:text-indigo-600 transition-colors w-6">
                                                {index + 1}.
                                            </span>
                                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                                                <MapPin size={24} className="text-rose-500" />
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <span className="font-bold text-slate-800 tracking-tight text-xl">{area.location}</span>
                                                <span className="text-slate-400 font-bold mx-2">→</span>
                                                <span className="text-rose-600 font-black text-2xl">{area.count}</span>
                                                <span className="text-slate-500 font-bold text-lg">reports</span>
                                            </div>
                                        </div>
                                        <TrendingUp className="w-6 h-6 text-rose-500" />
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                                    <p className="text-slate-400 font-bold">No reports in the last 7 days.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Info (Extra Polish) */}
                <div className="space-y-8">
                    <div className="glass-card p-8 rounded-[2.5rem] bg-indigo-900 text-white shadow-2xl relative overflow-hidden group border-none">
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold mb-4 flex items-center space-x-2">
                                <Users size={24} className="text-indigo-400" />
                                <span>Zone Status</span>
                            </h3>
                            <div className="space-y-6 mt-8">
                                {zoneStats.map((zone, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="flex justify-between text-sm font-bold uppercase tracking-widest text-indigo-300">
                                            <span>{zone.zone}</span>
                                            <span>{Math.round(zone.efficiency)}% Efficiency</span>
                                        </div>
                                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full shadow-lg ${zone.efficiency > 70 ? 'bg-emerald-400 shadow-emerald-400/50' : zone.efficiency > 40 ? 'bg-amber-400 shadow-amber-400/50' : 'bg-rose-400 shadow-rose-400/50'}`} 
                                                style={{ width: `${zone.efficiency}%` }} 
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="mt-10 w-full py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl font-bold transition-all backdrop-blur-sm group-hover:scale-[1.02]">
                                Generate Monthly Report
                            </button>
                        </div>
                        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

