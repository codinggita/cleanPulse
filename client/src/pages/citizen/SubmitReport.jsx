import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
    AlertCircle, 
    Camera, 
    MapPin, 
    Trash2, 
    Send, 
    Info, 
    CheckCircle2,
    FileText,
    ArrowLeft
} from 'lucide-react';
import axios from 'axios';

const SubmitReport = ({ isEdit = false }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        garbageType: 'Household',
        location: '',
        landmark: '',
        zone: '',
        description: '',
        urgency: 'Medium',
        photo: null
    });
    
    const [preview, setPreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (isEdit && id) {
            fetchReportData();
        }
    }, [isEdit, id]);

    const fetchReportData = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:5000/api/reports/${id}`, {
                headers: { 'x-auth-token': token }
            });
            const { garbageType, location, landmark, zone, description, photo, urgency } = res.data;
            setFormData({ garbageType, location, landmark, zone, description, urgency, photo: null }); // Don't put string in file input
            if (photo) setPreview(photo);
        } catch (err) {
            setError('Failed to fetch report data.');
            console.error(err);
        }
    };

    const onChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const onFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, photo: file });
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        // Basic Validation
        if (!formData.location || !formData.zone) {
            setError('Please fill in required fields (Location and Zone)');
            setIsSubmitting(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const dataToSend = {
                ...formData,
                // In a real app, we'd handle photo upload differently. 
                // Here we keep existing photo if no new one is uploaded.
                photo: preview // Simplified for this exercise
            };

            if (isEdit) {
                await axios.put(`http://localhost:5000/api/reports/${id}`, dataToSend, {
                    headers: { 'x-auth-token': token }
                });
            } else {
                await axios.post('http://localhost:5000/api/reports', dataToSend, {
                    headers: { 'x-auth-token': token }
                });
            }

            setSuccess(true);
            setTimeout(() => navigate('/citizen/my-reports'), 2000);
        } catch (err) {
            console.error('Submission error:', err);
            const message = err.response?.data?.message || err.message || 'Failed to submit report. Please try again.';
            setError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50/50">
            <div className="max-w-3xl mx-auto animate-fade-in">
                {/* Back Button */}
                <button 
                    onClick={() => navigate('/citizen/dashboard')}
                    className="flex items-center space-x-2 text-slate-500 hover:text-emerald-600 transition-colors mb-6 group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold">Back to Dashboard</span>
                </button>

                <div className="glass-card p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-white/40">
                    <div className="mb-10 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                                {isEdit ? 'Update Garbage Report' : 'Report Garbage Issue'}
                            </h1>
                            <p className="text-slate-500 mt-2 font-medium">
                                {isEdit ? 'Modify your previously submitted report' : 'Help us keep your neighborood clean'}
                            </p>
                        </div>
                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center shadow-inner">
                            <Trash2 size={32} />
                        </div>
                    </div>

                    {error && (
                        <div className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center space-x-3 text-rose-600 animate-shake">
                            <AlertCircle size={20} />
                            <p className="font-bold">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="mb-8 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center space-x-3 text-emerald-600">
                            <CheckCircle2 size={20} />
                            <p className="font-bold">
                                {isEdit ? 'Report updated successfully!' : 'Report submitted successfully!'} Redirecting...
                            </p>
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Garbage Type */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Garbage Type</label>
                                <select 
                                    name="garbageType"
                                    value={formData.garbageType}
                                    onChange={onChange}
                                    className="input-field w-full appearance-none bg-white font-bold"
                                >
                                    <option value="Household">Household Waste</option>
                                    <option value="Industrial">Industrial Waste</option>
                                    <option value="Medical">Medical Waste</option>
                                    <option value="Construction">Construction Waste</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            {/* City Zone */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">City Zone</label>
                                <select 
                                    name="zone"
                                    required
                                    value={formData.zone}
                                    onChange={onChange}
                                    className="input-field w-full appearance-none bg-white font-bold"
                                >
                                    <option value="">Select Zone</option>
                                    <option value="Zone A">Zone A (Old City)</option>
                                    <option value="Zone B">Zone B (Urban North)</option>
                                    <option value="Zone C">Zone C (Industrial East)</option>
                                    <option value="Zone D">Zone D (Garden West)</option>
                                </select>
                            </div>

                            {/* Location */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Area / Location</label>
                                <div className="relative">
                                    <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input 
                                        type="text"
                                        name="location"
                                        placeholder="e.g. MG Road, Near Market"
                                        required
                                        value={formData.location}
                                        onChange={onChange}
                                        className="input-field pl-12 w-full"
                                    />
                                </div>
                            </div>

                            {/* Landmark */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Landmark (Optional)</label>
                                <div className="relative">
                                    <Info size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input 
                                        type="text"
                                        name="landmark"
                                        placeholder="e.g. Near City Bank"
                                        value={formData.landmark}
                                        onChange={onChange}
                                        className="input-field pl-12 w-full"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Description</label>
                            <div className="relative">
                                <FileText size={18} className="absolute left-4 top-4 text-slate-400" />
                                <textarea 
                                    name="description"
                                    rows="4"
                                    placeholder="Briefly describe the issue..."
                                    value={formData.description}
                                    onChange={onChange}
                                    className="input-field pl-12 w-full resize-none pt-4"
                                />
                            </div>
                        </div>

                        {/* Urgency Level */}
                        <div className="space-y-4">
                            <label className="text-sm font-bold text-slate-700 ml-1 block">Urgency Level</label>
                            <div className="flex flex-wrap gap-4">
                                {['Low', 'Medium', 'High'].map((level) => (
                                    <button
                                        key={level}
                                        type="button"
                                        onClick={() => setFormData({...formData, urgency: level})}
                                        className={`px-8 py-3 rounded-2xl font-bold transition-all transform active:scale-95 ${
                                            formData.urgency === level 
                                                ? level === 'Low' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                                                : level === 'Medium' ? 'bg-amber-500 text-white shadow-lg shadow-amber-200'
                                                : 'bg-rose-600 text-white shadow-lg shadow-rose-200'
                                                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                                        }`}
                                    >
                                        {level === 'Low' && '🟢 '}
                                        {level === 'Medium' && '🟡 '}
                                        {level === 'High' && '🔴 '}
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Photo Upload */}
                        <div className="space-y-4 pt-4">
                            <label className="text-sm font-bold text-slate-700 ml-1 block">Photo Evidence</label>
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                <label className="w-full md:w-64 h-40 flex flex-col items-center justify-center border-3 border-dashed border-slate-200 rounded-[2rem] cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/10 transition-all group overflow-hidden relative">
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={onFileChange}
                                        className="hidden" 
                                    />
                                    {preview ? (
                                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <>
                                            <Camera className="w-10 h-10 text-slate-300 group-hover:text-emerald-500 transition-colors mb-2" />
                                            <span className="text-slate-400 font-bold group-hover:text-emerald-600 transition-colors">Upload Photo</span>
                                        </>
                                    )}
                                </label>
                                <div className="flex-1 text-slate-500 text-sm font-medium leading-relaxed bg-blue-50/50 p-6 rounded-3xl border border-blue-100">
                                    <p className="flex items-center gap-2 mb-2">
                                        <Info size={16} className="text-blue-500" />
                                        <strong>Why upload a photo?</strong>
                                    </p>
                                    <p>Uploading a clear photo helps waste collectors identify the location and amount of waste quickly, leading to faster resolution times.</p>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-8">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full btn-primary flex items-center justify-center space-x-3 group py-5"
                            >
                                {isSubmitting ? (
                                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        <span className="text-lg">
                                            {isEdit ? 'Save Changes' : 'Submit Garbage Report'}
                                        </span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SubmitReport;
