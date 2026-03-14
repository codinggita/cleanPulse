import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { PlusCircle, FileText, CheckCircle, Clock, RefreshCcw, MapPin, AlertCircle, Loader2 } from 'lucide-react';

const CitizenDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/dashboard/citizen', {
                    headers: { 'x-auth-token': token }
                });
                setData(res.data);
            } catch (err) {
                setError('Failed to fetch dashboard data. Please try again.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Resolved': return <CheckCircle className="text-emerald-500" size={18} />;
            case 'In Progress': return <RefreshCcw className="text-blue-500" size={18} />;
            case 'Pending': return <Clock className="text-amber-500" size={18} />;
            default: return <Clock size={18} />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
            </div>
        );
    }

    const { stats, recentReports } = data || { stats: { total: 0, resolved: 0, pending: 0, inProgress: 0 }, recentReports: [] };

    return (
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fade-in">
            <div className="mb-10 flex items-center space-x-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-2xl">
                    👋
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                        Hello, {user?.name || 'Rahul'}!
                    </h1>
                    <p className="text-slate-500 font-medium">Here's an overview of your reports.</p>
                </div>
            </div>

            {error && (
                <div className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center space-x-3 text-rose-600">
                    <AlertCircle size={20} />
                    <p className="font-bold">{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* My Reports Overview Card */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-card p-8 rounded-[2rem] shadow-xl">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                                <FileText className="text-emerald-600" />
                                <span>My Reports Information</span>
                            </h2>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col items-center">
                                <span className="text-slate-400 text-sm font-semibold mb-1 uppercase tracking-wider">Total</span>
                                <span className="text-3xl font-bold text-slate-900">{stats.total}</span>
                            </div>
                            <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 flex flex-col items-center">
                                <span className="text-emerald-600/70 text-sm font-semibold mb-1 uppercase tracking-wider flex items-center space-x-1">
                                    <CheckCircle size={14} /> <span>Resolved</span>
                                </span>
                                <span className="text-3xl font-bold text-emerald-700">{stats.resolved}</span>
                            </div>
                            <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 flex flex-col items-center">
                                <span className="text-amber-600/70 text-sm font-semibold mb-1 uppercase tracking-wider flex items-center space-x-1">
                                    <Clock size={14} /> <span>Pending</span>
                                </span>
                                <span className="text-3xl font-bold text-amber-700">{stats.pending}</span>
                            </div>
                            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex flex-col items-center">
                                <span className="text-blue-600/70 text-sm font-semibold mb-1 uppercase tracking-wider flex items-center space-x-1">
                                    <RefreshCcw size={14} /> <span>In Progress</span>
                                </span>
                                <span className="text-3xl font-bold text-blue-700">{stats.inProgress}</span>
                            </div>
                        </div>

                        <button 
                            onClick={() => navigate('/citizen/report')}
                            className="mt-10 w-full btn-primary flex items-center justify-center space-x-2 group"
                        >
                            <PlusCircle size={22} className="group-hover:rotate-90 transition-transform duration-300" />
                            <span>Submit New Report</span>
                        </button>
                    </div>

                    {/* Recent Reports List */}
                    <div className="glass-card p-8 rounded-[2rem] shadow-xl overflow-hidden">
                        <div className="flex items-center justify-between mb-6">
                             <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                                <MapPin className="text-emerald-600" />
                                <span>Recent Reports</span>
                             </h2>
                             <button 
                                onClick={() => navigate('/citizen/my-reports')}
                                className="text-emerald-600 font-bold hover:underline flex items-center gap-1"
                             >
                                 View All <PlusCircle size={14} className="rotate-45" />
                             </button>
                        </div>
                        
                        <div className="space-y-4">
                            {recentReports.length > 0 ? (
                                recentReports.map((report) => (
                                    <div key={report._id} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:bg-white transition-all group">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                                                <MapPin size={20} className="text-rose-500" />
                                            </div>
                                            <div>
                                                <span className="font-bold text-slate-800 tracking-tight text-lg block">{report.location}</span>
                                                <span className="text-slate-400 text-xs font-semibold">{new Date(report.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-50">
                                            {getStatusIcon(report.status)}
                                            <span className="font-semibold text-slate-600">{report.status}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                    <p className="text-slate-400 font-bold">No reports submitted yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar / Additional Info */}
                <div className="space-y-8">
                    <div className="glass-card p-8 rounded-[2.5rem] bg-emerald-600 text-white shadow-emerald-100 shadow-2xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold mb-4">You're making a difference!</h3>
                            <p className="text-emerald-50 leading-relaxed font-light mb-6 text-lg">
                                Your efforts in reporting waste have contributed to a cleaner neighborhood. Keep it up!
                            </p>
                            <div className="p-4 bg-white/10 rounded-2xl border border-white/20">
                                <span className="text-emerald-100 text-sm font-medium">Achievement unlocked</span>
                                <p className="text-xl font-bold">🌱 Green Warrior</p>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CitizenDashboard;

