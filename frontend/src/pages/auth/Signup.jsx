import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
    BiUser, 
    BiEnvelope, 
    BiLockAlt, 
    BiShow, 
    BiHide, 
    BiUserPlus, 
    BiLoaderAlt,
    BiCheckCircle
} from "react-icons/bi";

const Signup = () => {
    const navigate = useNavigate();

    // --- States ---
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "student" // Default role
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // --- Input Handler ---
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- Signup Logic ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

try {
            const response = await axios.post(
                "http://localhost:8000/api/auth/sign-up", 
                formData,
                { withCredentials: true }
            );

            if (response.data) {
                localStorage.setItem('userEmail',formData.email)
                toast.success("Account created! Please verfiy your account...");
                navigate('/verify-otp')
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-5 pt-[100px] pb-10">
            <div className="w-full max-w-[500px] bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-10">
                
                {/* --- Header --- */}
                <div className="flex flex-col items-center mb-8 text-center">
                    <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg">
                        <BiUserPlus />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
                    <p className="text-sm text-gray-400 mt-2">Join our community of 10,000+ learners today.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* Role Selection Tabs */}
                    <div className="flex bg-gray-100 p-1.5 rounded-2xl gap-1">
                        <button 
                            type="button"
                            onClick={() => setFormData({...formData, role: 'student'})}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                                formData.role === 'student' ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            {formData.role === 'student' && <BiCheckCircle className="text-green-500" />} Student
                        </button>
                        <button 
                            type="button"
                            onClick={() => setFormData({...formData, role: 'educator'})}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                                formData.role === 'educator' ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            {formData.role === 'educator' && <BiCheckCircle className="text-green-500" />} Educator
                        </button>
                    </div>

                    {/* Name Field */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                        <div className="relative">
                            <BiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                            <input 
                                type="text" 
                                name="name"
                                placeholder="Enter your name"
                                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 bg-gray-50 outline-none focus:bg-white focus:border-black transition-all"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                        <div className="relative">
                            <BiEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                            <input 
                                type="email" 
                                name="email"
                                placeholder="name@example.com"
                                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 bg-gray-50 outline-none focus:bg-white focus:border-black transition-all"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Password</label>
                        <div className="relative">
                            <BiLockAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                            <input 
                                type={showPassword ? "text" : "password"} 
                                name="password"
                                placeholder="••••••••"
                                className="w-full pl-12 pr-12 py-4 rounded-2xl border border-gray-100 bg-gray-50 outline-none focus:bg-white focus:border-black transition-all"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                            >
                                {showPassword ? <BiHide size={20} /> : <BiShow size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 rounded-2xl font-bold text-white transition-all shadow-xl flex items-center justify-center gap-3 ${
                            loading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"
                        }`}
                    >
                        {loading ? <BiLoaderAlt className="animate-spin text-xl" /> : "Create Account"}
                    </button>
                </form>

                {/* --- Footer Links --- */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500">
                        Already have an account? 
                        <Link to="/login" className="ml-2 text-black font-bold hover:underline">Login here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;