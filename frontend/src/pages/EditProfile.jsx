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
        <div className="min-h-screen bg-gray-50 pt-[100px] pb-20 px-5 flex flex-col items-center">
            
            {/* --- Header / Back Button --- */}
            <div className="w-full max-w-[500px] mb-8">
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-2 text-gray-500 hover:text-black transition-all"
                >
                    <BiArrowBack /> Back to Profile
                </button>
            </div>

            {/* --- Edit Form Card --- */}
            <div className="w-full max-w-[500px] bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-10">
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="relative group">
                        <img 
                            src={preview} 
                            alt="Profile Preview" 
                            className="w-32 h-32 rounded-full object-cover border-4 border-gray-50 shadow-md group-hover:opacity-80 transition-all"
                        />
                        <label 
                            htmlFor="profile-upload" 
                            className="absolute bottom-1 right-1 bg-black text-white p-2 rounded-full cursor-pointer hover:scale-110 transition-all shadow-lg"
                        >
                            <BiCloudUpload className="text-xl" />
                            <input 
                                type="file" 
                                id="profile-upload" 
                                hidden 
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </label>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mt-6">Edit Your Profile</h1>
                    <p className="text-sm text-gray-400 mt-1">Update your display name and profile picture.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Input */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                        <div className="relative">
                            <BiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                            <input 
                                type="text" 
                                placeholder="Enter your name"
                                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 bg-gray-50 outline-none focus:bg-white focus:border-black transition-all"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Email Display (Read-only for security as per video) */}
                    <div className="space-y-2 opacity-60">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                        <input 
                            type="email" 
                            disabled 
                            className="w-full px-4 py-4 rounded-2xl border border-gray-100 bg-gray-200 cursor-not-allowed"
                            value={user?.email || ""}
                        />
                        <p className="text-[10px] text-gray-400 ml-1 italic">Email cannot be changed for security reasons.</p>
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
                                Updating Profile...
                            </>
                        ) : (
                            <>
                                <BiSave className="text-xl" />
                                Save Changes
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;