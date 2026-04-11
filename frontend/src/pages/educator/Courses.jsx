
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaEdit, FaVideo, FaEye, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import useGetCreatorCourse from '../../customHook/getCreaterCourse';
import { BiArrowBack } from 'react-icons/bi';

const Courses = () => {
    const navigate = useNavigate();
    useGetCreatorCourse();
    const { creatorCourses } = useSelector((state) => state.course);
    

    // Step A: Delete Handler Function (Table ke upar dalo)
    const deleteCourseHandler = async (courseId) => {
        if (window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
            try {
                const res = await axios.delete(`http://localhost:8000/api/course/remove/${courseId}`, { withCredentials: true });
                if (res.data.success) {
                    toast.success("Course deleted successfully!");
                    // Table refresh karne ke liye page reload ya state update
                    window.location.reload(); 
                }
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to delete course");
            }
        }
    };

    

    return (
        
        <div className="min-h-screen bg-[#FDFBF7] pt-[110px] pb-10 px-5 md:px-12 font-jakarta">
            <div className="max-w-7xl mx-auto">
                <button 
                       onClick={() => navigate('/educator/dashboard')}
                       className="mb-6 flex items-center gap-2 text-gray-500 hover:text-black transition-colors "
                   >
                       <BiArrowBack /> Back to Dashboard
                   </button>
                   <br></br>
                
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-5">
                    <div>
                        <h1 className="text-3xl font-bold text-[#1A1A1A]">Manage <span className="text-[#D4A373]">Courses</span></h1>
                        <p className="text-gray-500 mt-1">Full control over your course content and lectures.</p>
                    </div>
                    <button 
                        onClick={() => navigate('/educator/create-course')}
                        className="bg-[#1A1A1A] text-white px-6 py-3 rounded-2xl font-bold hover:bg-black shadow-lg flex items-center gap-2"
                    >
                        <FaPlus /> Create New Course
                    </button>
                </div>

                <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#FAF9F6] text-gray-400 text-xs font-bold uppercase">
                                <tr>
                                    <th className="px-8 py-5">Course Details</th>
                                    <th className="px-8 py-5">Price</th>
                                    <th className="px-8 py-5">Status</th>
                                    <th className="px-8 py-5 text-right">Actions & Management</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {creatorCourses?.length > 0 ? creatorCourses.map((course) => (
                                    <tr key={course._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <img src={course.thumbnail} className="w-16 h-10 rounded-lg object-cover border" alt="" />
                                                <span className="font-bold text-[#1A1A1A] line-clamp-1">{course.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 font-bold text-gray-700">₹{course.price}</td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${course.isPublished ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                                {course.isPublished ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex justify-end gap-3">
                                                <button onClick={() => navigate(`/educator/edit-course/${course._id}`)} className="p-3 bg-gray-100 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm" title="Edit Info">
                                                    <FaEdit size={16} />
                                                </button>
                                                <button onClick={() => navigate(`/educator/create-lecture/${course._id}`)} className="p-3 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-600 hover:text-white transition-all shadow-sm" title="Manage Lectures">
                                                    <FaVideo size={16} />
                                                </button>
                                                {/* <button onClick={() => navigate(`/course-detail/${course._id}`)} className="p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm" title="Preview">
                                                    <FaEye size={16} />
                                                </button> */}
                                                <button 
                                                    onClick={() => navigate(`/course-detail/${course._id}`)} // Redirect to student view
                                                    className="p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm" 
                                                    title="View Preview"
                                                >
                                                    <FaEye size={16} />
                                                </button>
                                                {/* <button className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm" title="Delete">
                                                    <FaTrash size={16} />
                                                </button> */}
                                               
                                                <button 
                                                    onClick={() => deleteCourseHandler(course._id)} // Call delete function
                                                    className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm" 
                                                    title="Delete Course"
                                                >
                                                    <FaTrash size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="4" className="py-20 text-center text-gray-400 italic">No courses found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Courses;