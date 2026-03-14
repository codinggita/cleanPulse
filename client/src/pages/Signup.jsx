import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Phone, MapPin, ArrowRight, UserPlus } from 'lucide-react';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        zone: '',
        role: 'citizen'
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await signup(formData);
            navigate(`/${formData.role}/dashboard`);
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-200/20 rounded-full blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-200/20 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2" />

            <div className="max-w-2xl w-full animate-fade-in">
                <div className="glass-card p-10 md:p-12 rounded-[2.5rem] shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-teal-500" />

                    <div className="flex flex-col md:flex-row items-center justify-between mb-10 pb-8 border-b border-slate-100">
                        <div className="text-center md:text-left mb-6 md:mb-0">
                            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create Account</h2>
                            <p className="mt-2 text-slate-500 font-medium italic">"Every report counts towards a greener city"</p>
                        </div>
                        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
                            <UserPlus size={32} />
                        </div>
                    </div>

                    <form className="space-y-8" onSubmit={onSubmit}>
                        {error && (
                            <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm border border-red-100 text-center animate-pulse">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="space-y-2 group">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute top-3.5 left-4 h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                    <input
                                        name="name"
                                        type="text"
                                        required
                                        className="input-field pl-12"
                                        placeholder="Rahul Sharma"
                                        value={formData.name}
                                        onChange={onChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 group">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute top-3.5 left-4 h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        className="input-field pl-12"
                                        placeholder="rahul@example.com"
                                        value={formData.email}
                                        onChange={onChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 group">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute top-3.5 left-4 h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        minLength="8"
                                        className="input-field pl-12"
                                        placeholder="Min 8 characters"
                                        value={formData.password}
                                        onChange={onChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 group">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute top-3.5 left-4 h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                    <input
                                        name="phone"
                                        type="text"
                                        required
                                        className="input-field pl-12"
                                        placeholder="+91 98765 43210"
                                        value={formData.phone}
                                        onChange={onChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 group">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Select Your Zone</label>
                                <div className="relative">
                                    <MapPin className="absolute top-3.5 left-4 h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                    <select
                                        name="zone"
                                        required
                                        className="input-field pl-12 appearance-none"
                                        value={formData.zone}
                                        onChange={onChange}
                                    >
                                        <option value="">Choose your residential area...</option>
                                        <option value="Zone A">Zone A (Old City)</option>
                                        <option value="Zone B">Zone B (Urban North)</option>
                                        <option value="Zone C">Zone C (Industrial East)</option>
                                        <option value="Zone D">Zone D (Garden West)</option>
                                    </select>
                                    <div className="absolute right-4 top-4 pointer-events-none text-slate-400">
                                        <ArrowRight size={16} className="rotate-90" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 group">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Register As</label>
                                <div className="relative">
                                    <User className="absolute top-3.5 left-4 h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                    <select
                                        name="role"
                                        required
                                        className="input-field pl-12 appearance-none"
                                        value={formData.role}
                                        onChange={onChange}
                                    >
                                        <option value="citizen">Citizen</option>
                                        <option value="collector">Collector</option>
                                    </select>
                                    <div className="absolute right-4 top-4 pointer-events-none text-slate-400">
                                        <ArrowRight size={16} className="rotate-90" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn-primary w-full flex items-center justify-center space-x-3 group"
                            >
                                {isLoading ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span>Create Free Account</span>
                                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="text-center">
                            <p className="text-slate-600 font-medium">
                                Already helping us? {' '}
                                <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-bold underline decoration-2 underline-offset-4 decoration-emerald-100 hover:decoration-emerald-500 transition-all">
                                    Log in to your account
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
