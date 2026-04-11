import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BiBookAdd, BiArrowBack } from "react-icons/bi";

const CreateCourse = () => {
    const navigate = useNavigate();

    // 1. Local state for form inputs
    const [formData, setFormData] = useState({
        title: "",
        category: "Web Development", // Default category
        price: ""
    });

    const [loading, setLoading] = useState(false);

    // 2. Handle Input Changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 3. Form Submission Logic
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Call the backend route to create the course
            const response = await axios.post(
                "http://localhost:8000/api/course/create", 
                formData,
                { withCredentials: true }
            );

            if (response.data) {
                toast.success("Course initialized! Now add details.");
                // Redirect to the Edit page using the new course's ID
                navigate(`/educator/edit-course/${response.data._id}`);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create course");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-5">
            
            {/* --- Back Button --- */}
            <button 
                onClick={() => navigate('/educator/dashboard')}
                className="mb-6 flex items-center gap-2 text-gray-500 hover:text-black transition-colors self-start max-w-[1200px] mx-auto w-full"
            >
                <BiArrowBack /> Back to Dashboard            </button>

            {/* --- Form Card --- */}
            <div className="w-full max-w-[600px] bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-3xl mb-4">
                        <BiBookAdd />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Create New Course</h1>
                    <p className="text-sm text-gray-400 mt-1 text-center">
                        Give your course a name and price. You can add videos and images in the next step.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Course Title */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Course Title</label>
                        <input 
                            type="text" 
                            name="title"
                            placeholder="e.g. Master React in 30 Days"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-black transition-all"
                            required
                            value={formData.title}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Category Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Category</label>
                        <select 
                            name="category"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-black transition-all bg-white"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            <option value="Web Development">Web Development</option>
                            <option value="App Development">App Development</option>
                            <option value="Data Science">Data Science</option>
                            <option value="UI/UX Design">UI/UX Design</option>
                            <option value="AI & ML">AI & ML</option>
                            <option value="Cyber Security">Cyber Security</option>
                        </select>
                    </div>

                    {/* Price Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Price (INR)</label>
                        <input 
                            type="number" 
                            name="price"
                            placeholder="999"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-black transition-all"
                            required
                            value={formData.price}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg ${
                            loading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"
                        }`}
                    >
                        {loading ? "Creating..." : "Continue to Edit Details"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateCourse;