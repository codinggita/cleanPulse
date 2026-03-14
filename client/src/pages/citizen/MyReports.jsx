import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
    Trash2, 
    Edit, 
    Clock, 
    CheckCircle2, 
    AlertCircle, 
    MapPin, 
    Calendar, 
    ArrowLeft,
    Loader2,
    X,
    Filter
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const MyReports = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/reports', {
                headers: { 'x-auth-token': token }
            });
            setReports(res.data);
        } catch (err) {
            setError('Failed to fetch your reports. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this report? This action cannot be undone.')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/reports/${id}`, {
                headers: { 'x-auth-token': token }
            });
            setReports(reports.filter(report => report._id !== id));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete report.');
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'In Progress': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'Resolved': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'Rejected': return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    const getUrgencyIcon = (urgency) => {
        switch (urgency) {
            case 'High': return '🔴';
            case 'Medium': return '🟡';
            case 'Low': return '🟢';
            default: return '⚪';
        }
    };

    const filteredReports = filter === 'All' 
        ? reports 
        : reports.filter(r => r.status === filter);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
                <p className="text-slate-500 font-bold animate-pulse">Loading your reports...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50/50">
            <div className="max-w-5xl mx-auto animate-fade-in">
                
                {/* Header Area */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div className="flex items-center space-x-4">
                        <button 
                            onClick={() => navigate('/citizen/dashboard')}
                            className="p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all text-slate-600 hover:text-emerald-600"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Reports</h1>
                            <p className="text-slate-500 font-medium">Track and manage your garbage submissions</p>
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex items-center bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 overflow-x-auto no-scrollbar">
                        {['All', 'Pending', 'In Progress', 'Resolved'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                                    filter === status 
                                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
                                    : 'text-slate-500 hover:bg-slate-50'
                                }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {error && (
                    <div className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center space-x-3 text-rose-600">
                        <AlertCircle size={20} />
                        <p className="font-bold">{error}</p>
                    </div>
                )}

                {/* Reports Grid */}
                {filteredReports.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                        {filteredReports.map((report) => (
                            <div key={report._id} className="glass-card p-6 md:p-8 rounded-[2.5rem] shadow-lg border border-white/40 group hover:shadow-2xl transition-all duration-500 relative overflow-hidden bg-white/70">
                                {/* Status Chip */}
                                <div className="absolute top-6 right-6 flex items-center space-x-2">
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border-2 ${getStatusStyle(report.status)}`}>
                                        {report.status}
                                    </span>
                                </div>

                                <div className="space-y-6">
                                    {/* Location & Date */}
                                    <div>
                                        <div className="flex items-center space-x-2 text-slate-400 mb-2">
                                            <Calendar size={14} />
                                            <span className="text-xs font-bold uppercase tracking-tight">
                                                {new Date(report.createdAt).toLocaleDateString('en-US', { 
                                                    month: 'short', day: 'numeric', year: 'numeric' 
                                                })}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                                            <MapPin className="text-rose-500 w-5 h-5 shrink-0" />
                                            <span className="truncate">{report.location}</span>
                                        </h3>
                                        <p className="text-slate-500 text-sm font-medium mt-1 ml-7">
                                            {report.landmark ? `Near ${report.landmark}` : report.zone}
                                        </p>
                                    </div>

                                    {/* Details Grid */}
                                    <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50/50 rounded-3xl border border-slate-100/50">
                                        <div className="space-y-1">
                                            <span className="text-[10px] uppercase tracking-widest font-black text-slate-400">Waste Type</span>
                                            <p className="text-sm font-bold text-slate-700">{report.garbageType}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[10px] uppercase tracking-widest font-black text-slate-400">Urgency</span>
                                            <p className="text-sm font-bold text-slate-700">{getUrgencyIcon(report.urgency)} {report.urgency}</p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-3 pt-2">
                                        {report.status === 'Pending' ? (
                                            <>
                                                <button 
                                                    onClick={() => navigate(`/citizen/edit-report/${report._id}`)}
                                                    className="flex-1 flex items-center justify-center space-x-2 py-4 bg-white border-2 border-slate-100 rounded-2xl text-slate-600 font-bold hover:border-emerald-200 hover:text-emerald-600 hover:bg-emerald-50/30 transition-all shadow-sm"
                                                >
                                                    <Edit size={18} />
                                                    <span>Edit Report</span>
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(report._id)}
                                                    className="w-14 h-14 flex items-center justify-center bg-white border-2 border-slate-100 rounded-2xl text-slate-400 hover:border-rose-200 hover:text-rose-600 hover:bg-rose-50/30 transition-all shadow-sm"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </>
                                        ) : (
                                            <button 
                                                disabled
                                                className="w-full py-4 bg-slate-100/50 border-2 border-slate-100 rounded-2xl text-slate-400 font-bold flex items-center justify-center gap-2 cursor-not-allowed"
                                            >
                                                <Clock size={18} />
                                                <span>Under Processing</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 glass-card bg-white/50 rounded-[3rem] border border-dashed border-slate-200">
                        <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <Trash2 size={40} className="text-slate-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 tracking-tight">No reports found</h3>
                        <p className="text-slate-500 mt-2 font-medium">Reports with the status "{filter}" will appear here.</p>
                        <button 
                            onClick={() => navigate('/citizen/report')}
                            className="mt-8 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:scale-105 transition-transform"
                        >
                            + Submit New Report
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyReports;
