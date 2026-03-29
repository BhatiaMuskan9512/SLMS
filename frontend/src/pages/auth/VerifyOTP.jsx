import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BiShieldQuarter, BiLoaderAlt } from "react-icons/bi";

const VerifyOTP = () => {
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setLoading(true);
    //     const email = localStorage.getItem('userEmail');
    //     try {
    //         const response = await axios.post("http://localhost:8000/api/auth/verify-otp", {email,  otp });
    //         if (response.data.success || response === 200) {
    //             localStorage.removeItem('userEmail')
    //             toast.success("Account Verified Successfully!");
                 
    //             setTimeout(()=>{
    //                  navigate('/login');
    //             },1500);
               
    //         }
    //     } catch (error) {
    //         toast.error(error.response?.data?.message || "Invalid OTP");
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    const handleSubmit = async (e) => {
    e.preventDefault();
    const email = localStorage.getItem('userEmail'); // Check karo ye null toh nahi?
    
    if(!email) {
        toast.error("Email not found. Please signup again.");
        return;
    }

    try {
        const response = await axios.post("http://localhost:8000/api/auth/verify-otp", { 
            email : email, 
            otp: String(otp) // OTP ko string mein convert kar do safe side ke liye
        });

        // Agar database true ho gaya hai, toh ye block chalna hi chahiye
        if (response.status === 200 || response.data.success) {
            localStorage.removeItem('userEmail');
            toast.success("Verified! Redirecting...");
            navigate('/login');
        }
    } catch (error) {
        // Agar yahan 400 aa raha hai, toh error message print karo
        console.log("Error Detail:", error.response?.data);
        toast.error(error.response?.data?.message || "Verification Failed");
    }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-5 pt-[100px]">
            <div className="w-full max-w-[400px] bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-6 mx-auto">
                    <BiShieldQuarter />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">Verify OTP</h1>
                <p className="text-sm text-gray-400 mt-2 mb-8">Please enter the 6-digit code sent to your email.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <input 
                        type="text" 
                        maxLength="6"
                        placeholder="0 0 0 0 0 0"
                        className="w-full text-center text-2xl tracking-[15px] font-bold py-4 rounded-2xl border border-gray-100 bg-gray-50 outline-none focus:bg-white focus:border-black transition-all"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                    />
                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 rounded-2xl bg-black text-white font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? <BiLoaderAlt className="animate-spin" /> : "Verify Code"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default VerifyOTP;