import { useAuth } from '../../context/AuthContext';
import { Truck, CheckCircle, Clock, MapPin, Play, Check, ClipboardList } from 'lucide-react';

const CollectorDashboard = () => {
    const { user } = useAuth();
    
    const pickups = [
        { id: 1, location: "MG Road", status: "completed", action: "Mark Complete", icon: <Check size={18} /> },
        { id: 2, location: "Bus Stand", status: "pending", action: "Start Pickup", icon: <Play size={18} /> }
    ];

    return (
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto animate-fade-in">
            {/* Header Section */}
            <div className="mb-8 flex items-center space-x-3">
                <Truck className="text-emerald-600 w-8 h-8" />
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
                    Collector Dashboard
                </h1>
            </div>

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
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-slate-100 rounded-2xl flex items-center justify-center">
                                <ClipboardList className="text-slate-500 w-6 h-6" />
                            </div>
                            <span className="text-lg font-bold text-slate-700">Assigned: <span className="text-2xl text-slate-900 ml-2">5</span></span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-emerald-100 rounded-2xl flex items-center justify-center">
                                <CheckCircle className="text-emerald-600 w-6 h-6" />
                            </div>
                            <span className="text-lg font-bold text-slate-700">Completed: <span className="text-2xl text-emerald-600 ml-2">3</span></span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-amber-100 rounded-2xl flex items-center justify-center">
                                <Clock className="text-amber-600 w-6 h-6" />
                            </div>
                            <span className="text-lg font-bold text-slate-700">Pending: <span className="text-2xl text-amber-600 ml-2">2</span></span>
                        </div>
                    </div>
                </div>

                {/* Assigned Pickup List */}
                <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-6 tracking-tight">Assigned Pickup List</h3>
                    <div className="space-y-4">
                        {pickups.map((pickup) => (
                            <div key={pickup.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-slate-50/80 rounded-3xl border border-slate-100 hover:border-emerald-200 hover:bg-white transition-all group">
                                <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                                    <MapPin size={24} className="text-rose-500" />
                                    <span className="font-bold text-slate-800 tracking-tight text-xl">{pickup.location}</span>
                                    <span className="text-slate-400 font-bold mx-2">→</span>
                                </div>
                                <button className={`flex items-center space-x-2 px-8 py-3 rounded-2xl font-black tracking-tight transform hover:scale-105 active:scale-95 transition-all shadow-md ${
                                    pickup.status === 'completed' 
                                    ? 'bg-white text-slate-900 border-2 border-slate-200 hover:bg-slate-50' 
                                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                                }`}>
                                    <span>[ {pickup.action} ]</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CollectorDashboard;
