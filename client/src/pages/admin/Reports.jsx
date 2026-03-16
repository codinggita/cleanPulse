import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    FileText, 
    Search, 
    Filter, 
    Trash2, 
    AlertCircle, 
    MapPin, 
    Clock, 
    CheckCircle2, 
    ArrowLeft,
    Loader2,
    X,
    ChevronDown,
    LayoutGrid
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminReports = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Parse status from URL query params
    const queryParams = new URLSearchParams(location.search);
    const initialStatus = queryParams.get('status') || 'All';
    
    const [statusFilter, setStatusFilter] = useState(initialStatus);
    const [urgencyFilter, setUrgencyFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [zoneFilter, setZoneFilter] = useState('');
    
    // Pagination
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalReports, setTotalReports] = useState(0);

    // Sync filter state with URL changes
    useEffect(() => {
        const status = new URLSearchParams(location.search).get('status');
        if (status) {
            setStatusFilter(status);
        }
    }, [location.search]);

    useEffect(() => {
        fetchReports();
    }, [statusFilter, urgencyFilter, zoneFilter, page]);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:5000/api/reports`, {
                headers: { 'x-auth-token': token },
                params: {
                    status: statusFilter,
                    urgency: urgencyFilter,
                    zone: zoneFilter,
                    search: searchTerm,
                    page,
                    limit: 10
                }
            });
            setReports(res.data.reports);
            setTotalPages(res.data.totalPages);
            setTotalReports(res.data.totalReports);
        } catch (err) {
            setError('Failed to load reports. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this report permanently?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/reports/${id}`, {
                headers: { 'x-auth-token': token }
            });
            fetchReports();
        } catch (err) {
            alert('Failed to delete report.');
        }
    };

    return (
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center space-x-4">
                    <button 
                        onClick={() => navigate('/admin/dashboard')}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <ArrowLeft size={24} className="text-slate-600" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            <LayoutGrid className="text-indigo-600" size={32} />
                            All City Reports
                        </h1>
                        <p className="text-slate-500 font-bold">Manage and monitor all garbage issues ({totalReports} total)</p>
                    </div>
                </div>
            </div>

            {/* Advanced Filters */}
            <div className="glass-card p-8 rounded-[2.5rem] bg-white/70 backdrop-blur-md border border-white/40 shadow-xl mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input 
                            type="text"
                            placeholder="Search location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && fetchReports()}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
                        />
                    </div>

                    <div className="relative">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl appearance-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-bold text-slate-700"
                        >
                            <option value="All">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                    </div>

                    <div className="relative">
                        <AlertCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <select 
                            value={urgencyFilter}
                            onChange={(e) => setUrgencyFilter(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl appearance-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-bold text-slate-700"
                        >
                            <option value="All">All Urgency</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                    </div>

                    <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input 
                            type="text"
                            placeholder="Filter by Zone..."
                            value={zoneFilter}
                            onChange={(e) => setZoneFilter(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="py-20 flex flex-col items-center justify-center">
                    <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                    <p className="mt-4 text-slate-500 font-bold">Scanning city reports...</p>
                </div>
            ) : reports.length > 0 ? (
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-8 py-5 text-sm font-black text-slate-400 uppercase tracking-widest">Location</th>
                                <th className="px-8 py-5 text-sm font-black text-slate-400 uppercase tracking-widest">Zone</th>
                                <th className="px-8 py-5 text-sm font-black text-slate-400 uppercase tracking-widest">Urgency</th>
                                <th className="px-8 py-5 text-sm font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-sm font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {reports.map((report) => (
                                <tr key={report._id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-rose-500">
                                                <MapPin size={20} />
                                            </div>
                                            <div>
                                                <span className="font-extrabold text-slate-800 block">{report.location}</span>
                                                <span className="text-slate-400 text-xs font-bold">{report.garbageType}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg font-black text-xs">{report.zone}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${
                                                report.urgency === 'High' ? 'bg-rose-500' : report.urgency === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                                            }`} />
                                            <span className="font-bold text-slate-700">{report.urgency}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                                            report.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' :
                                            report.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                                            'bg-amber-100 text-amber-700'
                                        }`}>
                                            {report.status === 'Resolved' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                                            {report.status}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right flex items-center justify-end gap-3">
                                        <select 
                                            value={report.status}
                                            onChange={async (e) => {
                                                const newStatus = e.target.value;
                                                const token = localStorage.getItem('token');
                                                try {
                                                    await axios.put(`http://localhost:5000/api/reports/${report._id}/status`, { status: newStatus }, {
                                                        headers: { 'x-auth-token': token }
                                                    });
                                                    fetchReports();
                                                } catch (err) {
                                                    alert('Failed to update status');
                                                }
                                            }}
                                            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-700 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Resolved">Resolved</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                        <button 
                                            onClick={() => handleDelete(report._id)}
                                            className="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Simple Pagination */}
                    <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-slate-500 font-bold">Page {page} of {totalPages}</span>
                        <div className="flex gap-2">
                            <button 
                                disabled={page === 1}
                                onClick={() => setPage(p => p - 1)}
                                className="px-6 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:border-indigo-300 disabled:opacity-50 transition-all"
                            >
                                Previous
                            </button>
                            <button 
                                disabled={page === totalPages}
                                onClick={() => setPage(p => p + 1)}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 transition-all"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-300">
                    <X size={48} className="text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-500 font-black text-xl">No reports found matching your filters.</p>
                </div>
            )}
        </div>
    );
};

export default AdminReports;
