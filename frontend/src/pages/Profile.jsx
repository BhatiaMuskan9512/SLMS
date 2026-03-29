import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
    BiUserCircle, 
    BiEnvelope, 
    BiShieldQuarter, 
    BiEditAlt, 
    BiChevronRight,
    BiBookOpen,
    BiLogOut
} from "react-icons/bi";
import { useDispatch } from 'react-redux';
import { logoutUser } from '../redux/authSlice';
import toast from 'react-hot-toast';

const Profile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    // 1. Get user data from Redux
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    // 2. Handle Logout
    const handleLogout = async () => {
        try {
            await dispatch(logoutUser()).unwrap();
            toast.success("Logged out successfully");
            navigate("/login");
        } catch (error) {
            toast.error("Logout failed");
        }
    };

    // 3. Security Redirect: If not logged in, go to login
    if (!isAuthenticated) {
        navigate('/login');
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-[120px] pb-20 px-5 flex flex-col items-center">
            
            <div className="w-full max-w-[600px]">
                {/* --- Profile Header Card --- */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-6 flex flex-col sm:flex-row items-center gap-6">
                    <img 
                        src={user?.photoUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                        alt="Profile" 
                        className="w-24 h-24 rounded-full object-cover border-4 border-gray-50 shadow-sm"
                    />
                    <div className="text-center sm:text-left flex-1">
                        <h1 className="text-2xl font-bold text-gray-800">{user?.name}</h1>
                        <p className="text-gray-500 text-sm flex items-center justify-center sm:justify-start gap-1 mt-1">
                            <BiEnvelope /> {user?.email}
                        </p>
                        <span className="inline-block mt-3 px-3 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                            {user?.role}
                        </span>
                    </div>
                    <button 
                        onClick={() => navigate('/edit-profile')}
                        className="p-3 bg-gray-50 text-gray-600 rounded-2xl hover:bg-black hover:text-white transition-all shadow-sm"
                        title="Edit Profile"
                    >
                        <BiEditAlt size={22} />
                    </button>
                </div>

                {/* --- Quick Actions / Menu --- */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    
                    {/* My Courses Link */}
                    <button 
                        onClick={() => navigate('/my-courses')}
                        className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-all border-b border-gray-50 group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl">
                                <BiBookOpen />
                            </div>
                            <span className="font-semibold text-gray-700">My Enrolled Courses</span>
                        </div>
                        <BiChevronRight className="text-gray-300 group-hover:text-black transition-all text-2xl" />
                    </button>

                    {/* Account Security Info (Static) */}
                    <div className="w-full flex items-center justify-between p-5 border-b border-gray-50">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center text-xl">
                                <BiShieldQuarter />
                            </div>
                            <div>
                                <span className="block font-semibold text-gray-700">Account Status</span>
                                <span className="text-[11px] text-green-500 font-bold uppercase">Verified Member</span>
                            </div>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center justify-between p-5 hover:bg-red-50 transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center text-xl">
                                <BiLogOut />
                            </div>
                            <span className="font-semibold text-red-600">Logout from Device</span>
                        </div>
                        <BiChevronRight className="text-gray-300 group-hover:text-red-600 transition-all text-2xl" />
                    </button>
                </div>

                {/* --- Footer Note --- */}
                <p className="text-center text-gray-400 text-[11px] mt-8 uppercase tracking-widest font-medium">
                    Joined Virtual Course LMS in 2026
                </p>
            </div>

        </div>
    );
};

export default Profile;