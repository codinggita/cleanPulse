import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Users as UsersIcon, 
    Search, 
    Filter, 
    ShieldCheck, 
    ShieldAlert, 
    User,
    UserCircle,
    Mail,
    Phone,
    MapPin,
    ArrowLeft,
    Loader2,
    CheckCircle2,
    XCircle,
    UserCheck,
    UserX
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminUsers = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusUpdating, setStatusUpdating] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, [roleFilter]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:5000/api/admin/users`, {
                headers: { 'x-auth-token': token },
                params: {
                    role: roleFilter,
                    search: searchTerm
                }
            });
            setUsers(res.data);
        } catch (err) {
            setError('Failed to fetch users.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (userId, currentStatus) => {
        try {
            setStatusUpdating(userId);
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/admin/users/${userId}/status`, { isActive: !currentStatus }, {
                headers: { 'x-auth-token': token }
            });
            fetchUsers();
        } catch (err) {
            alert('Failed to update user status.');
        } finally {
            setStatusUpdating(null);
        }
    };

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.zone.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                            <UsersIcon className="text-indigo-600" size={32} />
                            User Management
                        </h1>
                        <p className="text-slate-500 font-bold">Control access and manage city workers</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                        type="text"
                        placeholder="Search by name, email or zone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium shadow-sm"
                    />
                </div>
                <div className="flex items-center justify-end space-x-3">
                    <Filter size={20} className="text-slate-400" />
                    {['All', 'Citizen', 'Collector'].map((r) => (
                        <button
                            key={r}
                            onClick={() => setRoleFilter(r)}
                            className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${
                                roleFilter === r 
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                                : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300'
                            }`}
                        >
                            {r}s
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="py-20 flex flex-col items-center justify-center">
                    <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                    <p className="mt-4 text-slate-400 font-bold">Loading user directory...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredUsers.map((u) => (
                        <div key={u._id} className={`glass-card p-8 rounded-[2.5rem] border border-white/40 shadow-xl transition-all relative overflow-hidden group ${!u.isActive ? 'bg-slate-50 opacity-80' : 'bg-white hover:shadow-2xl'}`}>
                            
                            {/* Role Badge */}
                            <div className={`absolute top-0 right-0 px-6 py-2 rounded-bl-3xl text-[10px] font-black uppercase tracking-[0.2em] text-white ${
                                u.role === 'admin' ? 'bg-indigo-600' : u.role === 'collector' ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}>
                                {u.role}
                            </div>

                            <div className="flex items-center gap-4 mb-8">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${
                                    u.role === 'collector' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                                }`}>
                                    <UserCircle size={32} />
                                </div>
                                <div className="overflow-hidden">
                                    <h3 className="text-xl font-black text-slate-800 truncate tracking-tight">{u.name}</h3>
                                    <div className="flex items-center gap-1.5 text-slate-400 font-bold text-xs uppercase tracking-wider">
                                        <MapPin size={12} />
                                        <span>Zone {u.zone}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 mb-10">
                                <div className="flex items-center gap-3 text-slate-600 font-medium">
                                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 border border-slate-200">
                                        <Mail size={14} />
                                    </div>
                                    <span className="truncate text-sm">{u.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600 font-medium">
                                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 border border-slate-200">
                                        <Phone size={14} />
                                    </div>
                                    <span className="text-sm">{u.phone}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-slate-100 mb-4">
                                <div className="flex items-center gap-2">
                                    <MapPin size={14} className="text-slate-400" />
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Zone</span>
                                </div>
                                {u.role === 'collector' ? (
                                    <select 
                                        value={u.zone}
                                        onChange={(e) => {
                                            const newZone = e.target.value;
                                            const token = localStorage.getItem('token');
                                            axios.put(`http://localhost:5000/api/admin/users/${u._id}/zone`, { zone: newZone }, {
                                                headers: { 'x-auth-token': token }
                                            }).then(() => fetchUsers()).catch(() => alert('Failed to update zone'));
                                        }}
                                        className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                    >
                                        {['A', 'B', 'C', 'D', 'E'].map(z => (
                                            <option key={z} value={z}>Zone {z}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <span className="text-xs font-black text-slate-700">Zone {u.zone}</span>
                                )}
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-2">
                                    {u.isActive ? (
                                        <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-black uppercase tracking-widest">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            Active
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1.5 text-rose-500 text-xs font-black uppercase tracking-widest">
                                            <XCircle size={14} />
                                            Deactivated
                                        </div>
                                    )}
                                </div>

                                <button 
                                    onClick={() => toggleStatus(u._id, u.isActive)}
                                    disabled={statusUpdating === u._id}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs transition-all tracking-wider ${
                                        u.isActive 
                                        ? 'bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white' 
                                        : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white'
                                    } disabled:opacity-50`}
                                >
                                    {statusUpdating === u._id ? (
                                        <Loader2 size={14} className="animate-spin" />
                                    ) : u.isActive ? (
                                        <><UserX size={14} /> DEACTIVATE</>
                                    ) : (
                                        <><UserCheck size={14} /> ACTIVATE</>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
