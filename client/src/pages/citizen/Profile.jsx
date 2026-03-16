import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, Phone, MapPin, Award, Calendar, BarChart2, CheckCircle, Clock, Trash2, ShieldCheck, Trophy, Flame, Star, Crown, X, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const CitizenProfile = () => {
    const { user, updateUser, token } = useAuth();
    const [stats, setStats] = useState({ totalRec: 0, resolvedRec: 0, pendingRec: 0 });
    const [badges, setBadges] = useState([]);
    const [allAvailableBadges, setAllAvailableBadges] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Edit Profile State
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        zone: user?.zone || ''
    });
    const [updateLoading, setUpdateLoading] = useState(false);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const [dashRes, badgeRes, allBadgeRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/dashboard/citizen', { headers: { 'x-auth-token': token } }),
                    axios.get('http://localhost:5000/api/badges/user', { headers: { 'x-auth-token': token } }),
                    axios.get('http://localhost:5000/api/badges')
                ]);

                setStats({
                    totalRec: dashRes.data.totalReports,
                    resolvedRec: dashRes.data.resolvedReports,
                    pendingRec: dashRes.data.pendingReports
                });
                setBadges(badgeRes.data);
                setAllAvailableBadges(allBadgeRes.data);
            } catch (err) {
                console.error('Error fetching profile data:', err);
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchProfileData();
    }, [token]);

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);
        try {
            const res = await axios.put('http://localhost:5000/api/auth/profile', editForm, {
                headers: { 'x-auth-token': token }
            });
            updateUser(res.data);
            setIsEditing(false);
            // Optional: Success message
        } catch (err) {
            console.error('Error updating profile:', err);
            alert(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setUpdateLoading(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>;

    const earnedBadgeIds = badges.map(b => b.badgeId._id);

    return (
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fade-in text-slate-900">
            {/* Profile Header */}
            <div className="glass-card p-10 rounded-[3rem] mb-12 relative overflow-hidden flex flex-col md:flex-row items-center gap-10 shadow-2xl border-white/40">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                
                <div className="relative">
                    <div className="w-32 h-32 bg-gradient-to-tr from-emerald-500 to-teal-500 rounded-[2.5rem] flex items-center justify-center text-4xl text-white shadow-xl">
                        {user.name.charAt(0)}
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-xl shadow-lg border border-slate-100">
                        <Award size={20} className="text-emerald-500" />
                    </div>
                </div>

                <div className="flex-grow text-center md:text-left space-y-4">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">{user.name}</h1>
                        <p className="text-emerald-600 font-bold uppercase tracking-widest text-xs mt-1">Certified Citizen Reporter</p>
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-slate-500 font-medium">
                        <div className="flex items-center gap-2">
                            <MapPin size={18} className="text-slate-400" />
                            <span>{user.zone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Mail size={18} className="text-slate-400" />
                            <span>{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone size={18} className="text-slate-400" />
                            <span>{user.phone}</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-3 bg-white border border-slate-100 rounded-2xl font-black text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
                    >
                        EDIT PROFILE
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Stats Section */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="glass-card p-8 rounded-[2.5rem] shadow-xl border-white/40">
                        <h2 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
                            <BarChart2 className="text-indigo-500" />
                            Activity Stats
                        </h2>
                        
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-slate-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                                        <Award size={20} />
                                    </div>
                                    <span className="font-bold text-slate-600">Total Reports</span>
                                </div>
                                <span className="text-2xl font-black text-slate-800">{stats.totalRec}</span>
                            </div>

                            <div className="flex items-center justify-between p-5 bg-emerald-50/30 rounded-2xl border border-emerald-100/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-500 shadow-sm">
                                        <CheckCircle size={20} />
                                    </div>
                                    <span className="font-bold text-emerald-800/70">Resolved Cases</span>
                                </div>
                                <span className="text-2xl font-black text-emerald-600">{stats.resolvedRec}</span>
                            </div>

                            <div className="flex items-center justify-between p-5 bg-amber-50/30 rounded-2xl border border-amber-100/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-amber-500 shadow-sm">
                                        <Clock size={20} />
                                    </div>
                                    <span className="font-bold text-amber-800/70">Pending Action</span>
                                </div>
                                <span className="text-2xl font-black text-amber-600">{stats.pendingRec}</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-8 rounded-[2.5rem] bg-slate-900 text-white shadow-xl relative overflow-hidden group">
                        <div className="relative z-10">
                            <h3 className="text-xl font-black mb-4 flex items-center gap-3">
                                <ShieldCheck className="text-emerald-400" />
                                Verify Citizen Status
                            </h3>
                            <p className="text-slate-400 text-sm font-medium leading-relaxed mb-6">
                                Your account is verified and you are contributing to a cleaner city. Keep reporting to earn more badges!
                            </p>
                            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min((stats.resolvedRec / 10) * 100, 100)}%` }}></div>
                            </div>
                            <p className="text-slate-500 text-[10px] font-black uppercase mt-3 tracking-widest text-right">
                                {10 - stats.resolvedRec > 0 ? `${10 - stats.resolvedRec} more for City Legend` : 'Max Level Reached'}
                            </p>
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-700" />
                    </div>
                </div>

                {/* Badges Section */}
                <div className="lg:col-span-8">
                    <div className="glass-card p-10 rounded-[3rem] shadow-xl border-white/40 min-h-full">
                        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
                            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-4">
                                <Trophy className="text-amber-500" size={28} />
                                Achievements & Badges
                            </h2>
                            <div className="px-6 py-2 bg-amber-50 border border-amber-100 rounded-2xl text-amber-600 font-extrabold text-sm shadow-sm">
                                Level {Math.floor(stats.resolvedRec / 5) + 1}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
                            {allAvailableBadges.map((badge) => {
                                const isEarned = earnedBadgeIds.includes(badge._id);
                                return (
                                    <div key={badge._id} className={`flex flex-col items-center text-center group cursor-help ${!isEarned ? 'opacity-40 grayscale hover:grayscale-0 transition-all' : ''}`}>
                                        <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center text-4xl mb-4 transition-all duration-500 relative ${
                                            isEarned 
                                            ? 'bg-gradient-to-tr from-amber-100 to-yellow-50 shadow-lg group-hover:scale-110 group-hover:rotate-6' 
                                            : 'bg-slate-50 border-2 border-dashed border-slate-200 group-hover:border-emerald-300'
                                        }`}>
                                            {badge.icon}
                                            {isEarned && (
                                                <div className="absolute -top-1 -right-1 bg-emerald-500 text-white rounded-full p-1 shadow-md border-2 border-white">
                                                    <CheckCircle size={10} strokeWidth={4} />
                                                </div>
                                            )}
                                        </div>
                                        <h4 className="font-black text-slate-800 text-sm mb-1 group-hover:text-emerald-600 transition-colors">
                                            {badge.name}
                                        </h4>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">
                                            {isEarned ? 'UNLOCKED' : `LOCKED: ${badge.conditionValue} ${badge.conditionType.replace('_', ' ')}`}
                                        </p>
                                        
                                        {/* Tooltip effect */}
                                        <div className="absolute mt-32 w-48 bg-slate-900 text-white rounded-2xl p-4 text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-2xl">
                                            <p className="font-black mb-1 text-emerald-400">{badge.name}</p>
                                            <p className="text-slate-300 font-medium italic">{badge.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {badges.length === 0 && (
                            <div className="text-center py-16 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200 mt-10">
                                <Award size={48} className="text-slate-300 mx-auto mb-4" />
                                <p className="text-slate-500 font-black text-lg">No badges earned yet.</p>
                                <p className="text-slate-400 text-sm font-medium">Submit reports and get them resolved to unlock achievements!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {isEditing && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-white/20 overflow-hidden animate-scale-up">
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">Edit Profile</h2>
                                <p className="text-slate-500 text-sm font-medium">Update your citizen account details</p>
                            </div>
                            <button 
                                onClick={() => setIsEditing(false)}
                                className="p-3 hover:bg-white rounded-2xl text-slate-400 hover:text-slate-600 transition-all shadow-sm border border-transparent hover:border-slate-100"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateProfile} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                                <div className="relative group">
                                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                    <input 
                                        type="text"
                                        name="name"
                                        value={editForm.name}
                                        onChange={handleEditChange}
                                        required
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none font-bold text-slate-700 transition-all"
                                        placeholder="Enter your name"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
                                    <div className="relative group">
                                        <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                        <input 
                                            type="tel"
                                            name="phone"
                                            value={editForm.phone}
                                            onChange={handleEditChange}
                                            required
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none font-bold text-slate-700 transition-all"
                                            placeholder="Phone number"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Assigned Zone</label>
                                    <div className="relative group">
                                        <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                        <select 
                                            name="zone"
                                            value={editForm.zone}
                                            onChange={handleEditChange}
                                            required
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none font-bold text-slate-700 transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="">Select Zone</option>
                                            <option value="North">North Zone</option>
                                            <option value="South">South Zone</option>
                                            <option value="East">East Zone</option>
                                            <option value="West">West Zone</option>
                                            <option value="Central">Central Zone</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button 
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="flex-1 px-6 py-4 border border-slate-100 rounded-2xl font-black text-slate-500 hover:bg-slate-50 transition-all"
                                >
                                    CANCEL
                                </button>
                                <button 
                                    type="submit"
                                    disabled={updateLoading}
                                    className="flex-1 px-6 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {updateLoading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Save size={18} />
                                            SAVE CHANGES
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CitizenProfile;
