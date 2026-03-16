import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Recycle, LogOut, User as UserIcon, FileText, Award } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-lg border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="bg-emerald-600 p-2 rounded-lg text-white">
                            <Recycle size={24} />
                        </div>
                        <span className="text-xl font-bold text-slate-900 tracking-tight">SmartWaste</span>
                    </Link>

                    <div className="flex items-center space-x-4">
                        {!user ? (
                            <>
                                <Link to="/login" className="text-slate-600 hover:text-emerald-600 font-medium transition-colors">Login</Link>
                                <Link to="/signup" className="bg-emerald-600 text-white px-5 py-2 rounded-xl font-medium hover:bg-emerald-700 transition-all shadow-md hover:shadow-emerald-200">Get Started</Link>
                            </>
                        ) : (
                            <div className="flex items-center space-x-6">
                                <Link to={`/${user.role}/dashboard`} className="flex items-center space-x-2 text-slate-700 hover:text-emerald-600 font-medium transition-colors">
                                    <UserIcon size={20} />
                                    <span>Dashboard</span>
                                </Link>
                                {user.role === 'citizen' && (
                                    <>
                                        <Link to="/citizen/my-reports" className="flex items-center space-x-2 text-slate-700 hover:text-emerald-600 font-medium transition-colors">
                                            <FileText size={20} />
                                            <span>My Reports</span>
                                        </Link>
                                        <Link to="/citizen/profile" className="flex items-center space-x-2 text-slate-700 hover:text-emerald-600 font-medium transition-colors">
                                            <Award size={20} />
                                            <span>Profile</span>
                                        </Link>
                                    </>
                                )}
                                <button 
                                    onClick={logout}
                                    className="flex items-center space-x-1 text-red-500 hover:text-red-600 font-medium transition-colors"
                                >
                                    <LogOut size={20} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
