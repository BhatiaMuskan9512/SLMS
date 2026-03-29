import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BiArrowBack, BiCloudUpload, BiCheckCircle, BiLoaderAlt } from "react-icons/bi";

const EditLecture = () => {
    const navigate = useNavigate();
    const { lectureId } = useParams(); // Get lecture ID from the URL

    // --- States ---
    const [title, setTitle] = useState("");
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(false);

    // --- Form Submission Logic ---
    const handleUpdateLecture = async (e) => {
        e.preventDefault();
        
        // Validation: Title is required
        if (!title.trim()) return toast.error("Please enter a lecture title");

        setLoading(true);

        // We use FormData because we are uploading a physical file (video)
        const formData = new FormData();
        formData.append("title", title);
        if (video) {
            formData.append("videoUrl", video); // Key must match backend upload.single("videoUrl")
        }

        try {
            const response = await axios.post(
                `http://localhost:8000/api/course/edit-lecture/${lectureId}`, 
                formData, 
                { 
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.data) {
                toast.success("Lecture updated successfully!");
                // Navigate back to the previous page (the course editing area)
                navigate(-1); 
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to upload video");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-5">
            
            {/* --- Header / Back Button --- */}
            <div className="w-full max-w-[600px] mb-6">
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-2 text-gray-500 hover:text-black transition-all"
                >
                    <BiArrowBack /> Back to Course Editing
                </button>
            </div>

            {/* --- Main Card --- */}
            <div className="w-full max-w-[600px] bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12">
                <div className="flex flex-col items-center mb-8 text-center">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-3xl mb-4">
                        <BiCloudUpload />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Edit Lecture Content</h1>
                    <p className="text-sm text-gray-400 mt-2">
                        Update the title and upload the video file for this lesson.
                    </p>
                </div>

                <form onSubmit={handleUpdateLecture} className="space-y-6">
                    {/* Lecture Title */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Lecture Title</label>
                        <input 
                            type="text" 
                            placeholder="Change lecture name..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 transition-all"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    {/* Video Upload Area */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Video File (.mp4, .mov, etc.)</label>
                        <div className="relative group">
                            <input 
                                type="file" 
                                accept="video/*"
                                className="hidden" 
                                id="video-upload"
                                onChange={(e) => setVideo(e.target.files[0])}
                            />
                            <label 
                                htmlFor="video-upload"
                                className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                                    video ? "border-green-400 bg-green-50" : "border-gray-200 hover:border-blue-400 bg-gray-50"
                                }`}
                            >
                                {video ? (
                                    <div className="flex flex-col items-center text-green-600">
                                        <BiCheckCircle className="text-4xl mb-2" />
                                        <span className="text-sm font-medium">{video.name}</span>
                                        <span className="text-[10px] uppercase mt-1">Ready to upload</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center text-gray-400">
                                        <BiCloudUpload className="text-4xl mb-2 group-hover:text-blue-500" />
                                        <span className="text-sm">Click to browse video files</span>
                                    </div>
                                )}
                            </label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg flex items-center justify-center gap-3 ${
                            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        {loading ? (
                            <>
                                <BiLoaderAlt className="animate-spin text-xl" />
                                Uploading to Cloudinary...
                            </>
                        ) : (
                            "Update Lecture & Upload"
                        )}
                    </button>
                    
                    {loading && (
                        <p className="text-[11px] text-center text-gray-400 animate-pulse italic">
                            Large videos may take a few minutes. Please don't close this tab.
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default EditLecture;