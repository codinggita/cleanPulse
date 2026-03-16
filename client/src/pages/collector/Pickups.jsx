import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Truck, 
    MapPin, 
    Clock, 
    CheckCircle2, 
    AlertCircle, 
    ChevronRight, 
    Search, 
    Filter,
    Loader2,
    Calendar,
    ArrowLeft,
    Play,
    Check
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const CollectorPickups = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Parse status from URL query params
    const queryParams = new URLSearchParams(location.search);
    const initialStatus = queryParams.get('status') || 'All';
    const [filter, setFilter] = useState(initialStatus);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Sync filter state with URL changes
    useEffect(() => {
        const status = new URLSearchParams(location.search).get('status');
        if (status) {
            setFilter(status);
        }
    }, [location.search]);

    useEffect(() => {
        if (user?.zone) {
            fetchPickups();
        }
    }, [filter, user?.zone]);

    const fetchPickups = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            // Fetch reports in collector's zone
            const res = await axios.get(`http://localhost:5000/api/reports?zone=${user.zone}&status=${filter}`, {
                headers: { 'x-auth-token': token }
            });
            setReports(res.data.reports);
        } catch (err) {
            setError('Failed to load pickups. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/reports/${id}/status`, { status }, {
                headers: { 'x-auth-token': token }
            });
            fetchPickups();
        } catch (err) {
            console.error('Failed to update status:', err);
        }
    };

    const filteredReports = reports.filter(report => 
        report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.landmark?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto animate-fade-in">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                    <button 
                        onClick={() => navigate('/collector/dashboard')}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <ArrowLeft size={24} className="text-slate-600" />
                    </button>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                        <Truck className="text-emerald-600" size={32} />
                        Pickup Management
                    </h1>
                </div>
                <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
                    <span className="text-emerald-700 font-bold tracking-tight">Zone: {user.zone}</span>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                        type="text"
                        placeholder="Search by location or landmark..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-medium text-slate-700 placeholder:text-slate-400 shadow-sm"
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <Filter className="text-slate-400 ml-2" size={20} />
                    {['All', 'Pending', 'In Progress', 'Resolved'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                                filter === status 
                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
                                : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-300 hover:text-emerald-600 shadow-sm'
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-4">
                    <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
                    <p className="text-slate-500 font-medium animate-pulse">Fetching pickups for your zone...</p>
                </div>
            ) : error ? (
                <div className="bg-rose-50 border border-rose-100 p-8 rounded-3xl text-center space-y-4">
                    <AlertCircle size={48} className="text-rose-500 mx-auto" />
                    <p className="text-rose-600 font-bold text-lg">{error}</p>
                    <button onClick={fetchPickups} className="btn-primary px-8 py-3">Try Again</button>
                </div>
            ) : filteredReports.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                    {filteredReports.map((report) => (
                        <div key={report._id} className="glass-card p-6 rounded-[2rem] border border-white/40 bg-white/70 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all group overflow-hidden relative">
                            {/* Priority Indicator */}
                            <div className={`absolute top-0 right-0 px-6 py-2 rounded-bl-3xl text-xs font-black uppercase tracking-widest text-white shadow-md ${
                                report.urgency === 'High' ? 'bg-rose-500' : report.urgency === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}>
                                {report.urgency}
                            </div>

                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                <div className="space-y-4 flex-1">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                                            <MapPin className="text-rose-500" size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-slate-800 tracking-tight mb-1">{report.location}</h3>
                                            <p className="text-slate-500 font-bold flex items-center gap-2">
                                                <ChevronRight size={16} className="text-emerald-500" />
                                                {report.landmark}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-4 text-sm font-bold">
                                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl text-slate-600">
                                            <Clock size={16} />
                                            <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl text-emerald-700">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                            <span>{report.garbageType}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center gap-4">
                                    {report.status === 'Pending' && (
                                        <button 
                                            onClick={() => handleUpdateStatus(report._id, 'In Progress')}
                                            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black tracking-tight transform hover:scale-105 active:scale-95 transition-all shadow-lg shadow-emerald-200"
                                        >
                                            <Play size={20} />
                                            <span>Accept Pickup</span>
                                        </button>
                                    )}
                                    {report.status === 'In Progress' && (
                                        <button 
                                            onClick={() => handleUpdateStatus(report._id, 'Resolved')}
                                            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black tracking-tight transform hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-200"
                                        >
                                            <Check size={20} />
                                            <span>Mark Complete</span>
                                        </button>
                                    )}
                                    {report.status === 'Resolved' && (
                                        <div className="flex items-center gap-2 px-8 py-4 bg-emerald-100 text-emerald-700 rounded-2xl border-2 border-emerald-200 font-black">
                                            <CheckCircle2 size={24} />
                                            <span>COMPLETED</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 glass-card rounded-[2.5rem] border border-dashed border-slate-300">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Calendar size={40} className="text-slate-300" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 mb-2">Clean Streets!</h3>
                    <p className="text-slate-400 font-medium text-lg">No {filter !== 'All' ? filter : ''} pickups found in your zone.</p>
                </div>
            )}
        </div>
    );
};

export default CollectorPickups;
