import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
    BiBookBookmark, 
    BiGroup, 
    BiRupee, 
    BiTrendingUp, 
    BiPlusCircle 
} from "react-icons/bi";
import useGetCreatorCourse from '../../customHook/getCreaterCourse';

const Dashboard = () => {
    const navigate = useNavigate();
    
    // 1. Fetch the creator's courses using our custom hook
    useGetCreatorCourse();

    // 2. Extract course data from Redux
    const { creatorCourses } = useSelector((state) => state.course);

    // 3. Logic to calculate stats dynamically
    const totalCourses = creatorCourses?.length || 0;
    
    // Calculate total students across all courses (based on enrolled field)
    const totalStudents = creatorCourses?.reduce((acc, course) => {
        return acc + (course.enrolled?.length || 0);
    }, 0);

    // Calculate total earnings (Price * Number of Enrolled Students)
    const totalEarnings = creatorCourses?.reduce((acc, course) => {
        return acc + (course.price * (course.enrolled?.length || 0));
    }, 0);

    // Get the 5 most recent courses for the "Latest" section
    const latestCourses = creatorCourses?.slice(0, 5) || [];

    return (
        <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
            {/* --- Welcome Header --- */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        Instructor Dashboard <BiTrendingUp className="text-green-500" />
                    </h1>
                    <p className="text-sm text-gray-500">Monitor your sales, courses, and student growth.</p>
                </div>
                <button 
                    onClick={() => navigate('/educator/create-course')}
                    className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all shadow-lg font-medium"
                >
                    <BiPlusCircle className="text-xl" /> Create New Course
                </button>
            </div>

            {/* --- Stats Cards Grid --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {/* Total Courses Card */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl">
                        <BiBookBookmark />
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Total Courses</p>
                        <h2 className="text-2xl font-bold text-gray-800">{totalCourses}</h2>
                    </div>
                </div>

                {/* Total Students Card */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl">
                        <BiGroup />
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Total Students</p>
                        <h2 className="text-2xl font-bold text-gray-800">{totalStudents}</h2>
                    </div>
                </div>

                {/* Total Earnings Card */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-2xl">
                        <BiRupee />
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Total Earnings</p>
                        <h2 className="text-2xl font-bold text-gray-800">₹{totalEarnings.toLocaleString()}</h2>
                    </div>
                </div>
            </div>

            {/* --- Recent Courses Section --- */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-800">Your Recent Courses</h3>
                    <button 
                        onClick={() => navigate('/educator/courses')}
                        className="text-sm font-semibold text-blue-600 hover:underline"
                    >
                        View All
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="text-xs text-gray-400 uppercase font-bold border-b border-gray-50">
                            <tr>
                                <th className="pb-4">Course Name</th>
                                <th className="pb-4">Price</th>
                                <th className="pb-4">Enrolled</th>
                                <th className="pb-4 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {latestCourses.length > 0 ? (
                                latestCourses.map((course) => (
                                    <tr key={course._id} className="hover:bg-gray-50 transition-all cursor-pointer" onClick={() => navigate(`/educator/edit-course/${course._id}`)}>
                                        <td className="py-4 font-medium text-gray-700 truncate max-w-[200px]">{course.title}</td>
                                        <td className="py-4 text-gray-600 font-medium">₹{course.price}</td>
                                        <td className="py-4 text-gray-600">{course.enrolled?.length || 0}</td>
                                        <td className="py-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                                                course.isPublished ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"
                                            }`}>
                                                {course.isPublished ? "Published" : "Draft"}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="py-10 text-center text-gray-400 italic">No courses found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;