import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Truck, CheckCircle, Clock, MapPin, Play, Check, ClipboardList, Loader2, AlertCircle } from 'lucide-react';

const CollectorDashboard = () => {
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/dashboard/collector', {
                    headers: { 'x-auth-token': token }
                });
                setData(res.data);
            } catch (err) {
                setError('Failed to fetch pickup data. Please try again.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const handleUpdateStatus = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            // Optimistic update could be added here
            await axios.put(`http://localhost:5000/api/reports/${id}/status`, { status }, {
                headers: { 'x-auth-token': token }
            });
            // Refetch data
            const res = await axios.get('http://localhost:5000/api/dashboard/collector', {
                headers: { 'x-auth-token': token }
            });
            setData(res.data);
        } catch (err) {
            console.error('Failed to update status:', err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
            </div>
        );
    }

    const { stats, pickups } = data || { stats: { assigned: 0, completed: 0, pending: 0 }, pickups: [] };

    return (
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto animate-fade-in">
            {/* Header Section */}
            <div className="mb-8 flex items-center space-x-3">
                <Truck className="text-emerald-600 w-8 h-8" />
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
                    Collector Dashboard
                </h1>
            </div>

            {error && (
                <div className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center space-x-3 text-rose-600">
                    <AlertCircle size={20} />
                    <p className="font-bold">{error}</p>
                </div>
            )}

            {/* Main Content Card (Matching the Image Box) */}
            <div className="glass-card p-10 rounded-[2.5rem] shadow-xl border border-white/40 bg-white/70 backdrop-blur-md">
                
                {/* Greeting */}
                <div className="flex items-center space-x-4 mb-10">
                    <span className="text-3xl animate-bounce">👋</span>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Hello, {user?.name || 'Suresh'} (Collector)
                    </h2>
                </div>

                {/* Today's Pickups Stats */}
                <div className="mb-12">
                    <h3 className="text-xl font-bold text-slate-800 mb-6 tracking-tight">Today's Pickups</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
                        <Link to="/collector/pickups?status=Pending" className="flex items-center space-x-4 p-4 hover:bg-slate-50 rounded-2xl transition-all group">
                            <div className="p-3 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                                <ClipboardList className="text-slate-500 w-6 h-6" />
                            </div>
                            <span className="text-lg font-bold text-slate-700">Pending in Zone: <span className="text-2xl text-slate-900 ml-2">{stats.pending}</span></span>
                        </Link>
                        <Link to="/collector/pickups?status=Resolved" className="flex items-center space-x-4 p-4 hover:bg-emerald-50 rounded-2xl transition-all group">
                            <div className="p-3 bg-emerald-100 rounded-2xl flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                                <CheckCircle className="text-emerald-600 w-6 h-6" />
                            </div>
                            <span className="text-lg font-bold text-slate-700">My Completed: <span className="text-2xl text-emerald-600 ml-2">{stats.completed}</span></span>
                        </Link>
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-amber-100 rounded-2xl flex items-center justify-center">
                                <Clock className="text-amber-600 w-6 h-6" />
                            </div>
                            <span className="text-lg font-bold text-slate-700">Pending: <span className="text-2xl text-amber-600 ml-2">{stats.pending}</span></span>
                        </div>
                    </div>
                </div>

                {/* Assigned Pickup List */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-slate-800 tracking-tight">Assigned Pickup List</h3>
                        <Link 
                            to="/collector/pickups"
                            className="text-emerald-600 font-bold hover:underline flex items-center gap-1 group/all"
                        >
                            Manage All <Truck size={16} className="group-hover/all:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {pickups.length > 0 ? (
                            pickups.map((pickup) => (
                                <div key={pickup._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-slate-50/80 rounded-3xl border border-slate-100 hover:border-emerald-200 hover:bg-white transition-all group">
                                    <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                                        <MapPin size={24} className="text-rose-500" />
                                        <div>
                                            <span className="font-bold text-slate-800 tracking-tight text-xl block">{pickup.location}</span>
                                            <span className="text-slate-400 text-xs font-semibold">{pickup.garbageType} • {pickup.urgency} Priority</span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => {
                                            if (pickup.status === 'Pending') handleUpdateStatus(pickup._id, 'In Progress');
                                            else if (pickup.status === 'In Progress') handleUpdateStatus(pickup._id, 'Resolved');
                                        }}
                                        disabled={pickup.status === 'Resolved'}
                                        className={`flex items-center space-x-2 px-8 py-3 rounded-2xl font-black tracking-tight transform hover:scale-105 active:scale-95 transition-all shadow-md ${
                                            pickup.status === 'Resolved' 
                                            ? 'bg-white text-slate-400 border-2 border-slate-100 cursor-not-allowed' 
                                            : pickup.status === 'In Progress'
                                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                : 'bg-emerald-600 text-white hover:bg-emerald-700'
                                        }`}
                                    >
                                        {pickup.status === 'Pending' && <><Play size={18} className="mr-2" /> <span>[ Accept Pickup ]</span></>}
                                        {pickup.status === 'In Progress' && <><Check size={18} className="mr-2" /> <span>[ Mark Complete ]</span></>}
                                        {pickup.status === 'Resolved' && <><CheckCircle size={18} className="mr-2" /> <span>[ Completed ]</span></>}
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                                <p className="text-slate-400 font-bold">No pickups available in your zone.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CollectorDashboard;

