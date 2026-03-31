
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BiPlus, BiEditAlt } from "react-icons/bi";
import useGetCreatorCourse from '../../customHook/getCreaterCourse';

const Courses = () => {
    const navigate = useNavigate();
    
    // 1. Trigger the custom hook to fetch the latest courses for this creator
    useGetCreatorCourse();

    // 2. Get the creator-specific courses from the Redux store
    const { creatorCourses } = useSelector((state) => state.course);

    return (
        <div className="p-4 sm:p-8 bg-white min-h-screen">
            {/* --- Header Section --- */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">My Courses</h1>
                    <p className="text-sm text-gray-500">Manage and edit your existing courses or create a new one.</p>
                </div>
                <button 
                    onClick={() => navigate('/educator/create-course')}
                    className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-all shadow-md"
                >
                    <BiPlus className="text-xl" /> Create New Course
                </button>
            </div>

            {/* --- Courses Table --- */}
            <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
                        <tr>
                            <th className="px-6 py-4">Course Thumbnail & Title</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {creatorCourses && creatorCourses.length > 0 ? (
                            creatorCourses.map((course) => (
                                <tr key={course._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 flex items-center gap-4">
                                        <img 
                                            src={course.thumbnail || "https://via.placeholder.com/150"} 
                                            alt={course.title} 
                                            className="w-16 h-10 object-cover rounded-md border"
                                        />
                                        <span className="font-medium text-gray-800 line-clamp-1 max-w-[300px]">
                                            {course.title}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 font-medium">
                                        ₹{course.price || "0"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase ${
                                            course.isPublished 
                                            ? "bg-green-100 text-green-600" 
                                            : "bg-yellow-100 text-yellow-600"
                                        }`}>
                                            {course.isPublished ? "Published" : "Draft"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button 
                                            onClick={() => navigate(`/educator/edit-course/${course._id}`)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                                            title="Edit Course"
                                        >
                                            <BiEditAlt className="text-xl" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-6 py-20 text-center text-gray-400 italic">
                                    You haven't created any courses yet. Click "Create New Course" to get started!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Courses;