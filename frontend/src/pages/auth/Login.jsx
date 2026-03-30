import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BiEnvelope, BiLockAlt, BiShow, BiHide, BiLogInCircle, BiLoaderAlt } from "react-icons/bi";
import { setUser, setIsAuthenticated } from '../../redux/authSlice';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // --- States ---
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // --- Input Handler ---
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- Login Logic ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(
                "http://localhost:8000/api/auth/log-in", 
                formData,
                { withCredentials: true } // Essential for receiving the HTTP-only cookie
            );

            if (response.data) {
                dispatch(setUser(response.data.user));
                dispatch(setIsAuthenticated(true));
                toast.success(`Welcome back, ${response.data.user.name}!`);
                
                // 1. Update Redux store
                
                if (response.data.user.role === 'student') {
                    navigate('/student/dashboard');
                }
                // window.location.href = "/student/dashboard";
                // // 2. Role-based Redirection
                // if (response.data.user.role === 'student') {
                //     navigate('/student/dashboard');
                // }
                // else if(response.data.user.role === 'educator'){
                //     navigate('/educator/dashboard');
                // }
                // else{
                //     navigate('/')
                // }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-5 pt-[100px]">
            <div className="w-full max-w-[450px] bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-10">
                
                {/* --- Header --- */}
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg">
                        <BiLogInCircle />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Login to Account</h1>
                    <p className="text-sm text-gray-400 mt-2">Enter your credentials to access your courses.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    
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
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Password</label>
                            <Link to="/forget-password" name="email" className="text-xs text-blue-600 hover:underline font-semibold">Forgot Password?</Link>
                        </div>
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
                        {loading ? <BiLoaderAlt className="animate-spin text-xl" /> : "Log In"}
                    </button>
                </form>

                {/* --- Footer Links --- */}
                <div className="mt-10 text-center">
                    <p className="text-sm text-gray-500">
                        Don't have an account? 
                        <Link to="/signup" className="ml-2 text-black font-bold hover:underline">Create Account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;