import React, { useState } from 'react';
//import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BiLockOpenAlt, BiLoaderAlt } from "react-icons/bi";
import { useNavigate, useLocation } from 'react-router-dom';


const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const email = location.state?.email;
    
    //const email = localStorage.getItem('resetEmail'); // ✅ Email lo
    console.log("Reset email:", email); // ✅ Debug ke liye

    if (!email) {
        toast.error("Session expired. Please try again.");
        navigate('/forget-password');
        return;
    }
    
    try {
        const response = await axios.post(
            "http://localhost:8000/api/auth/reset-password", // ✅ Sahi URL
            { email, password } // ✅ Email bhi bhejo
        );
        if (response.data) {
            localStorage.removeItem('resetEmail'); // ✅ Cleanup
            toast.success("Password reset successful! Please login.");
            navigate('/login');
        }
    } catch (error) {
        toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
        setLoading(false);
    }
};
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-5 pt-[100px]">
            <div className="w-full max-w-[400px] bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center">
                <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center text-3xl mb-6 mx-auto">
                    <BiLockOpenAlt />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">New Password</h1>
                <p className="text-sm text-gray-400 mt-2 mb-8">Set a strong password for your account.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <input 
                        type="password" 
                        placeholder="Enter new password"
                        className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 outline-none focus:border-[#d4a843] focus:ring-2 focus:ring-[#d4a843]/20 transition-all"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 rounded-2xl bg-[#d4a843] font-bold hover:[#c49833] text-[#1a1a1a] transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? <BiLoaderAlt className="animate-spin" /> : "Update Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;