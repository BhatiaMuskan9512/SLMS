import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BiEnvelope, BiShieldQuarter, BiEditAlt, BiChevronRight, BiBookOpen, BiLockAlt, BiCheckCircle,BiLogOut } from "react-icons/bi";
import { logoutUser } from '../redux/authSlice';
import toast from 'react-hot-toast';
import axios from 'axios';

const Profile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    // --- Dynamic States ---
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(false);

    // 1. Handle Password Input Change
    const handleChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    // 2. Handle Password Update (Backend Integration)
    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        console.log("State values:", { 
        new: passwordData.newPassword, 
        confirm: passwordData.confirmPassword 
    });
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return toast.error("Passwords do not match!");
        }

        setLoading(true);
        try {
            const res = await axios.put("http://localhost:8000/api/user/change-password", {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            }, { withCredentials: true });

            if (res.data.success) {
                toast.success("Password updated successfully! 🎉");
                setIsChangingPassword(false);
                setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    // Ensure kijiye ki ye function 'const Profile = () => {' ke andar hi hai
const handleLogout = async () => {
    try {
        const res = await axios.get("http://localhost:8000/api/auth/log-out", {
            withCredentials: true 
        });

        if (res.data.success) {
            dispatch(logoutUser());
            localStorage.clear();
            toast.success(res.data.message || "Logged out successfully");
            navigate("/login");
        }
    } catch (error) {
        console.log(error);
        toast.error("Logout failed!");
    }
};

    return (
        <div className="fixed inset-0 bg-[#F9F6EE] flex items-center justify-center p-4 overflow-hidden font-sans">
            <div className="w-full max-w-[480px] animate-fadeIn">

                {isChangingPassword ? (
                    /* 🌟 VIEW: CHANGE PASSWORD FORM (Reference Image Look) 🌟 */
                    <>

                    <button 
                            onClick={() => setIsChangingPassword(false)} 
                            className="mb-6 text-gray-400 hover:text-gray-600 flex items-center gap-2 font-bold text-xs bg-transparent border-none cursor-pointer uppercase tracking-widest"
                        >
                            ← Back to Profile
                        </button>
                    
                    <div className="bg-white rounded-[35px] shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-50 p-10">
                        {/* <button 
                            onClick={() => setIsChangingPassword(false)} 
                            className="mb-6 text-gray-400 hover:text-gray-600 flex items-center gap-2 font-bold text-xs bg-transparent border-none cursor-pointer uppercase tracking-widest"
                        >
                            ← Back to Profile
                        </button> */}

                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-black text-gray-800">Change Password</h2>
                            <p className="text-gray-400 text-sm mt-1 font-medium">Update your account security settings.</p>
                        </div>

                        <form onSubmit={handleUpdatePassword} className="space-y-4">
                            <div className="relative">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Current Password</label>
                                <input 
                                    name="currentPassword" type="password" required placeholder="Verify old password"
                                    value={passwordData.currentPassword} onChange={handleChange}
                                    className="w-full mt-1 p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#d4a843]/20 font-medium"
                                />
                            </div>

                            <div className="relative">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                                <input 
                                    name="newPassword" type="password" required placeholder="Enter new password"
                                    value={passwordData.newPassword} onChange={handleChange}
                                    className="w-full mt-1 p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#d4a843]/20 font-medium"
                                />
                            </div>

                            <div className="relative">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                                <input 
                                    name="confirmPassword" type="password" required placeholder="Re-type new password"
                                    value={passwordData.confirmPassword} onChange={handleChange}
                                    className="w-full mt-1 p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#d4a843]/20 font-medium"
                                />
                            </div>

                            <button 
                                type="submit" disabled={loading}
                                className="w-full mt-4 py-4 bg-[#1e293b] text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200"
                            >
                                {loading ? "Updating..." : "🔐 Update Security Settings"}
                            </button>
                        </form>
                    </div>
                    </>
                ) : (
                    /* 🌟 VIEW: MAIN PROFILE 🌟 */
                    <>
                    
                                            <button 
                                onClick={() => navigate(-1)} 
                                className="mb-4 text-gray-400 hover:text-gray-600 flex items-center gap-2 font-bold text-xs bg-transparent border-none cursor-pointer uppercase tracking-widest"
                            >
                                ← Back
                            </button>
                        <div className="bg-white rounded-[35px] shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-50 p-8 mb-6 flex flex-col sm:flex-row items-center gap-8">
                            <img 
                                src={user?.photoUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                                alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-gray-50 shadow-sm"
                            />
                            <div className="text-center sm:text-left flex-1">
                                <h1 className="text-2xl font-black text-gray-800 tracking-tight">{user?.name}</h1>
                                <p className="text-gray-400 text-sm font-medium">{user?.email}</p>
                                <span className="inline-block mt-3 px-4 py-1 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-lg">{user?.role}</span>
                            </div>
                            <button onClick={() => navigate('/edit-profile')} className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:bg-black hover:text-white transition-all border-none cursor-pointer"><BiEditAlt size={22} /></button>
                        </div>

                        <div className="bg-white rounded-[35px] shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-50 overflow-hidden">
                            {/* <button onClick={() => navigate('/my-courses')} className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-all border-b border-gray-50 group border-none bg-transparent cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl"><BiBookOpen /></div>
                                    <span className="font-bold text-gray-700 text-base">My Enrolled Courses</span>
                                </div>
                                <BiChevronRight className="text-gray-300 group-hover:text-black transition-all" size={24} />
                            </button> */}

                            <button onClick={() => setIsChangingPassword(true)} className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-all border-b border-gray-50 group border-none bg-transparent cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center text-xl">🔐</div>
                                    <span className="font-bold text-gray-700 text-base">Change Password</span>
                                </div>
                                <BiChevronRight className="text-gray-300 group-hover:text-black transition-all" size={24} />
                            </button>

                            <div className="flex items-center justify-between p-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-xl"><BiShieldQuarter /></div>
                                    <div>
                                        <span className="block font-bold text-gray-700 text-base">Account Status</span>
                                        <span className="text-[11px] text-emerald-500 font-black uppercase tracking-widest">Verified Member</span>
                                    </div>
                                </div>
                            </div>

                            {/* 🌟 Naya Logout Section 🌟 */}
                                <button 
                                    onClick={handleLogout} 
                                    className="w-full flex items-center justify-between p-6 hover:bg-red-50 transition-all group border-none bg-transparent cursor-pointer"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center text-xl">
                                            <BiLogOut />
                                        </div>
                                        <span className="font-bold text-red-600 text-base group-hover:tracking-wide transition-all">Logout from Device</span>
                                    </div>
                                    <BiChevronRight className="text-gray-300 group-hover:text-red-600 transition-all" size={24} />
                                </button>
                        </div>
                        <p className="text-center text-gray-300 text-[10px] mt-8 uppercase tracking-[0.2em] font-black">Joined SkillLink in 2026</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default Profile;