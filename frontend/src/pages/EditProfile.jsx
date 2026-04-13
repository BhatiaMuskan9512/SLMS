import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BiUser, BiCloudUpload, BiArrowBack, BiLoaderAlt, BiSave } from "react-icons/bi";
import { setUser } from '../redux/authSlice';

const EditProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // 1. Get current user data from Redux
    const { user } = useSelector((state) => state.auth);

    // 2. Local States
    const [name, setName] = useState("");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(false);

    // 3. Populate existing data on load
    useEffect(() => {
        if (user) {
            setName(user.name);
            setPreview(user.photoUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png");
        }
    }, [user]);

    // 4. Handle Image Selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file)); // Create local preview URL
        }
    };

    // 5. Submit Form Logic
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // We use FormData for file uploads
        const formData = new FormData();
        formData.append("name", name);
        if (image) {
            formData.append("photoUrl", image); // Key must match backend upload.single("photoUrl")
        }

        try {
            const response = await axios.post(
                "http://localhost:8000/api/user/profile", 
                formData,
                { 
                    withCredentials: true,
                    headers: { 'Content-Type': 'multipart/form-data' }
                }
            );

            if (response.data) {
                // Update global Redux state with new user data
                dispatch(setUser(response.data.user));
                toast.success("Profile updated successfully!");
                navigate('/my-profile');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

return (
    /* 🌟 Is container ko humne 'fixed' rakha hai par 'top-[70px]' diya hai 
       taaki upar se Navbar dikhta rahe aur niche scroller na aaye */
    <div className="!fixed !inset-0 !top-[70px] !bg-[#FDFCF9] !flex !flex-col !items-center !justify-center !p-4 !overflow-hidden !z-10">
        
        <div className="w-full !max-w-[450px] !px-6 animate-fadeIn">
            
            {/* Back to Profile Link */}
            <button 
                onClick={() => navigate('/my-profile')} 
                className="mb-4 text-gray-400 hover:text-gray-600 flex items-center gap-2 font-bold text-[10px] bg-transparent border-none cursor-pointer uppercase tracking-widest"
            >
                <BiArrowBack /> Back to Profile
            </button>

            {/* Main Edit Card */}
            <div className="bg-white rounded-[35px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-50 p-8">
                
                {/* Profile Picture Section */}
                <div className="flex flex-col items-center mb-8">
                    <div className="relative group">
                        <img 
                            src={preview} 
                            alt="Profile Preview" 
                            className="w-24 h-24 rounded-full object-cover border-4 border-gray-50 shadow-sm"
                        />
                        <label className="absolute bottom-1 right-1 bg-black text-white p-2 rounded-full cursor-pointer hover:scale-110 transition-all shadow-lg flex items-center justify-center">
                            <BiCloudUpload size={18} />
                            <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                        </label>
                    </div>
                    <h2 className="text-xl font-black text-gray-800 mt-4">Edit Your Profile</h2>
                    <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider mt-1">Update display name & photo</p>
                </div>

                {/* Form Section */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="relative">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                        <div className="relative">
                            <BiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-lg" />
                            <input 
                                type="text" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full mt-1 pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-black/5 font-bold text-gray-700"
                                required
                            />
                        </div>
                    </div>

                    <div className="relative">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                        <input 
                            type="email" 
                            value={user?.email} 
                            disabled
                            className="w-full mt-1 p-4 bg-gray-100 border-none rounded-2xl text-gray-400 font-medium cursor-not-allowed"
                        />
                        <p className="text-[9px] text-gray-400 mt-1 ml-1 italic">Email is fixed for security.</p>
                    </div>

                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 py-4 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:shadow-2xl transition-all disabled:bg-gray-300 border-none cursor-pointer flex items-center justify-center gap-2"
                    >
                        {loading ? <BiLoaderAlt className="animate-spin" /> : <BiSave size={18} />}
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    </div>
);
};

export default EditProfile;