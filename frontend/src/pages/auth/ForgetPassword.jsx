import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BiMailSend, BiArrowBack, BiLoaderAlt, BiEnvelope } from "react-icons/bi";

const ForgetPassword = () => {
    const navigate = useNavigate();
    
    // --- States ---
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    // --- Form Submission Logic ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email) {
            return toast.error("Please enter your email address");
        }

        setLoading(true);

        try {
            // Call the backend route to generate and send OTP
            const response = await axios.post(
                "http://localhost:8000/api/auth/forget-password", 
                { email },
                { withCredentials: true }
            );

            if (response.data) {
                toast.success("OTP sent to your email!");
                // Redirect to verify-otp page and pass the email via state
                navigate('/verify-otp', { state: { email } });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-5">
            
            {/* --- Back to Login --- */}
            <div className="w-full max-w-[450px] mb-6">
                <Link 
                    to="/login" 
                    className="flex items-center gap-2 text-gray-500 hover:text-black transition-all text-sm font-medium"
                >
                    <BiArrowBack /> Back to Login
                </Link>
            </div>

            {/* --- Main Card --- */}
            <div className="w-full max-w-[450px] bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-10">
                <div className="flex flex-col items-center mb-8 text-center">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-3xl mb-4">
                        <BiMailSend />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Forgot Password?</h1>
                    <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                        Enter your email address and we'll send you a 6-digit code to reset your password.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Input */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">
                            Email Address
                        </label>
                        <div className="relative">
                            <BiEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                            <input 
                                type="email" 
                                placeholder="name@example.com"
                                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 bg-gray-50 outline-none focus:bg-white focus:border-black transition-all"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
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
                        {loading ? (
                            <>
                                <BiLoaderAlt className="animate-spin text-xl" />
                                Sending Code...
                            </>
                        ) : (
                            "Send Reset OTP"
                        )}
                    </button>
                </form>

                {/* --- Help Text --- */}
                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-400">
                        Can't find the email? Check your spam folder or contact support.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgetPassword;