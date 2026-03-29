import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BiVideoPlus, BiArrowBack } from "react-icons/bi";

const CreateLecture = () => {
    const navigate = useNavigate();
    const { courseId } = useParams(); // Get courseId from URL to link the lecture

    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);

    // Form Submission Logic
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!title.trim()) {
            return toast.error("Lecture title is required");
        }

        setLoading(true);

        try {
            // Call the backend route to create a lecture placeholder
            const response = await axios.post(
                `http://localhost:8000/api/course/create-lecture/${courseId}`, 
                { title },
                { withCredentials: true }
            );

            if (response.data) {
                toast.success("Lecture created! Now upload the video.");
                // Redirect back to the Edit Course page to manage the new lecture
                navigate(`/educator/edit-course/${courseId}`);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create lecture");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-5">
            
            {/* --- Back Button --- */}
            <button 
                onClick={() => navigate(`/educator/edit-course/${courseId}`)}
                className="mb-6 flex items-center gap-2 text-gray-500 hover:text-black transition-colors self-start max-w-[500px] mx-auto w-full"
            >
                <BiArrowBack /> Back to Edit Course
            </button>

            {/* --- Form Card --- */}
            <div className="w-full max-w-[500px] bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex flex-col items-center mb-6">
                    <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-3xl mb-4">
                        <BiVideoPlus />
                    </div>
                    <h1 className="text-xl font-bold text-gray-800">Add New Lecture</h1>
                    <p className="text-sm text-gray-400 mt-1 text-center">
                        Enter a descriptive title for your new lesson.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Lecture Title Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Lecture Title</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Introduction to React Hooks"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-purple-500 transition-all"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3.5 rounded-xl font-bold text-white transition-all shadow-md ${
                            loading ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
                        }`}
                    >
                        {loading ? "Creating..." : "Create Lecture"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateLecture;