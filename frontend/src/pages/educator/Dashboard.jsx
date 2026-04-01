// import React, { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { 
//     FaPlus, FaEdit, FaVideo, FaEye, FaTrash, 
//     FaBook, FaUsers, FaChartBar, FaEllipsisV 
// } from 'react-icons/fa';
// import toast from 'react-hot-toast';

// const Dashboard = () => {
//     const navigate = useNavigate();
//     const { user } = useSelector((state) => state.auth);
//     const [courses, setCourses] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchEducatorData = async () => {
//             try {
//                 const res = await axios.get("http://localhost:8000/api/course/get-creator", { withCredentials: true });
//                 console.log("backend se aaya data", res.data);
//                 if (res.data) {
//                     setCourses(res.data);
                  
//                 }
//             } catch (error) {
//                 toast.error("Database connection error!");
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchEducatorData();
//     }, []);

//     return (
//         <div className="min-h-screen bg-[#FDFBF7] pt-[110px] pb-10 px-5 md:px-12 font-jakarta">
//             <div className="max-w-7xl mx-auto">
                
//                 {/* --- TOP ACTION BAR --- */}
//                 <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-5">
//                     <div>
//                         <h1 className="text-4xl font-bold text-[#1A1A1A]">Instructor <span className="text-[#D4A373]">Console</span></h1>
//                         <p className="text-gray-500 mt-1 font-medium">Manage, Create, and Edit your digital academy.</p>
//                     </div>
//                     <div className="flex gap-3">
//                         {/* All Courses dekhne ke liye button */}
//                         <button 
//                             onClick={() => navigate('/educator/courses')}
//                             className="bg-white border-2 border-[#1A1A1A] text-[#1A1A1A] px-6 py-3 rounded-2xl font-bold hover:bg-gray-50 transition-all flex items-center gap-2"
//                         >
//                             <FaBook /> View All Courses
//                         </button>
//                         {/* New Course create karne ke liye */}
//                         <button 
//                             onClick={() => navigate('/educator/create-course')}
//                             className="bg-[#1A1A1A] text-white px-6 py-3 rounded-2xl font-bold hover:bg-black shadow-lg flex items-center gap-2"
//                         >
//                             <FaPlus className="text-[#D4A373]" /> Create New
//                         </button>
//                     </div>
//                 </div>

//                 {/* --- STATS OVERVIEW --- */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
//                     <div className="bg-white p-6 rounded-[30px] shadow-sm border border-gray-100 flex items-center gap-5">
//                         <div className="bg-blue-50 p-4 rounded-2xl text-blue-500 text-xl"><FaChartBar /></div>
//                         <div>
//                             <p className="text-gray-400 text-xs font-bold uppercase">Total Published</p>
//                             <h3 className="text-2xl font-bold">{courses.length}</h3>
//                         </div>
//                     </div>
//                     <div className="bg-white p-6 rounded-[30px] shadow-sm border border-gray-100 flex items-center gap-5">
//                         <div className="bg-green-50 p-4 rounded-2xl text-green-500 text-xl"><FaUsers /></div>
//                         <div>
//                             <p className="text-gray-400 text-xs font-bold uppercase">Total Students</p>
//                             <h3 className="text-2xl font-bold">1,240</h3>
//                         </div>
//                     </div>
//                     <div className="bg-white p-6 rounded-[30px] shadow-sm border border-gray-100 flex items-center gap-5">
//                         <div className="bg-orange-50 p-4 rounded-2xl text-orange-500 text-xl font-bold">₹</div>
//                         <div>
//                             <p className="text-gray-400 text-xs font-bold uppercase">Total Earnings</p>
//                             <h3 className="text-2xl font-bold">42,500</h3>
//                         </div>
//                     </div>
//                 </div>

//                 {/* --- COURSE MANAGEMENT TABLE --- */}
//                 <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
//                     <div className="p-8 border-b border-gray-50">
//                         <h2 className="text-2xl font-bold text-[#1A1A1A]">Manage Your Content</h2>
//                     </div>

//                     <div className="overflow-x-auto">
//                         <table className="w-full text-left">
//                             <thead className="bg-[#FAF9F6] text-gray-1000 text-[11px] font-black uppercase tracking-wider">
//                                 <tr>
//                                     <th className="px-8 py-5">Course Details</th>
//                                     <th className="px-8 py-5 text-center">Status</th>
//                                     <th className="px-8 py-5 text-center">Price</th>
//                                     <th className="px-8 py-5 text-right">Quick Controls</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="divide-y divide-gray-50">
//                                 {courses.length > 0 ? courses.map((course) => (
//                                     <tr key={course._id} className="hover:bg-gray-50/50 transition-colors">
//                                         <td className="px-8 py-6">
//                                             <div className="flex items-center gap-4">
//                                                 <img src={course.courseThumbnail} className="w-14 h-14 rounded-xl object-cover" alt="" />
//                                                 <span className="font-bold text-[#1A1A1A]">{course.title}</span>
//                                             </div>
//                                         </td>
//                                         <td className="px-8 py-6 text-center">
//                                             <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${course.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
//                                                 {course.isPublished ? 'Live' : 'Draft'}
//                                             </span>
//                                         </td>
//                                         {/* <td className="px-8 py-6 text-center font-bold text-gray-800">₹{course.coursePrice}</td> */}
//                                         <td className="px-8 py-6 text-center font-bold text-gray-700">
//                                         {course.price ? `₹${course.price}` : <span className="text-gray-400 font-normal italic">Free</span>}
//                                         </td>
//                                         <td className="px-8 py-6">
//                                             <div className="flex justify-end gap-2">
//                                                 {/* Edit Course Details */}
//                                                 <button 
//                                                     onClick={() => navigate(`/educator/edit-course/${course._id}`)}
//                                                     className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-[#1A1A1A] hover:text-white transition-all shadow-sm"
//                                                     title="Edit Course Info"
//                                                 >
//                                                     <FaEdit size={16} />
//                                                 </button>
//                                                 {/* Add/Edit Lectures */}
//                                                 <button 
//                                                     onClick={() => navigate(`/educator/create-lecture/${course._id}`)}
//                                                     className="p-3 bg-[#D4A373]/10 text-[#D4A373] rounded-xl hover:bg-[#D4A373] hover:text-white transition-all shadow-sm"
//                                                     title="Manage Lectures"
//                                                 >
//                                                     <FaVideo size={16} />
//                                                 </button>
//                                                 {/* Preview Course */}
//                                                 <button 
//                                                     onClick={() => navigate(`/course-detail/${course._id}`)}
//                                                     className="p-3 bg-blue-50 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all shadow-sm"
//                                                     title="View Preview"
//                                                 >
//                                                     <FaEye size={16} />
//                                                 </button>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 )) : (
//                                     <tr>
//                                         <td colSpan="4" className="py-20 text-center text-gray-400 font-medium italic">
//                                             No courses found. Start your journey by creating one!
//                                         </td>
//                                     </tr>
//                                 )}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Dashboard;
// // import React from 'react';
// // import { useSelector } from 'react-redux';
// // import { useNavigate } from 'react-router-dom';
// // import { 
// //     BiBookBookmark, 
// //     BiGroup, 
// //     BiRupee, 
// //     BiTrendingUp, 
// //     BiPlusCircle 
// // } from "react-icons/bi";
// // import useGetCreatorCourse from '../../customHook/getCreaterCourse';

// // const Dashboard = () => {
// //     const navigate = useNavigate();
    
// //     // 1. Fetch the creator's courses using our custom hook
// //     useGetCreatorCourse();

// //     // 2. Extract course data from Redux
// //     const { creatorCourses } = useSelector((state) => state.course);

// //     // 3. Logic to calculate stats dynamically
// //     const totalCourses = creatorCourses?.length || 0;
    
// //     // Calculate total students across all courses (based on enrolled field)
// //     const totalStudents = creatorCourses?.reduce((acc, course) => {
// //         return acc + (course.enrolled?.length || 0);
// //     }, 0);

// //     // Calculate total earnings (Price * Number of Enrolled Students)
// //     const totalEarnings = creatorCourses?.reduce((acc, course) => {
// //         return acc + (course.price * (course.enrolled?.length || 0));
// //     }, 0);

// //     // Get the 5 most recent courses for the "Latest" section
// //     const latestCourses = creatorCourses?.slice(0, 5) || [];

// //     return (
// //         <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
// //             {/* --- Welcome Header --- */}
// //             <br></br>
// //             <br></br>
// //             <br></br>
// //             <br></br>
// //             <br></br>
// //             <br></br>
// //             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
// //                 <div>
// //                     <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
// //                         Educator Dashboard <BiTrendingUp className="text-green-500" />
// //                     </h1>
// //                     <p className="text-sm text-gray-500">Monitor your sales, courses, and student growth.</p>
// //                 </div>
// //                 <button 
// //                     onClick={() => navigate('/educator/create-course')}
// //                     className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all shadow-lg font-medium"
// //                 >
// //                     <BiPlusCircle className="text-xl" /> Create New Course
// //                 </button>
// //             </div>

// //             {/* --- Stats Cards Grid --- */}
// //             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
// //                 {/* Total Courses Card */}
// //                 <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
// //                     <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl">
// //                         <BiBookBookmark />
// //                     </div>
// //                     <div>
// //                         <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Total Courses</p>
// //                         <h2 className="text-2xl font-bold text-gray-800">{totalCourses}</h2>
// //                     </div>
// //                 </div>

// //                 {/* Total Students Card */}
// //                 <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
// //                     <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl">
// //                         <BiGroup />
// //                     </div>
// //                     <div>
// //                         <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Total Students</p>
// //                         <h2 className="text-2xl font-bold text-gray-800">{totalStudents}</h2>
// //                     </div>
// //                 </div>

// //                 {/* Total Earnings Card */}
// //                 <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
// //                     <div className="w-14 h-14 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-2xl">
// //                         <BiRupee />
// //                     </div>
// //                     <div>
// //                         <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Total Earnings</p>
// //                         <h2 className="text-2xl font-bold text-gray-800">₹{totalEarnings.toLocaleString()}</h2>
// //                     </div>
// //                 </div>
// //             </div>

// //             {/* --- Recent Courses Section --- */}
// //             <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
// //                 <div className="flex justify-between items-center mb-6">
// //                     <h3 className="text-lg font-bold text-gray-800">Your Recent Courses</h3>
// //                     <button 
// //                         onClick={() => navigate('/educator/courses')}
// //                         className="text-sm font-semibold text-blue-600 hover:underline"
// //                     >
// //                         View All
// //                     </button>
// //                 </div>

// //                 <div className="overflow-x-auto">
// //                     <table className="w-full text-left">
// //                         <thead className="text-xs text-gray-400 uppercase font-bold border-b border-gray-50">
// //                             <tr>
// //                                 <th className="pb-4">Course Name</th>
// //                                 <th className="pb-4">Price</th>
// //                                 <th className="pb-4">Enrolled</th>
// //                                 <th className="pb-4 text-center">Status</th>
// //                             </tr>
// //                         </thead>
// //                         <tbody className="divide-y divide-gray-50">
// //                             {latestCourses.length > 0 ? (
// //                                 latestCourses.map((course) => (
// //                                     <tr key={course._id} className="hover:bg-gray-50 transition-all cursor-pointer" onClick={() => navigate(`/educator/edit-course/${course._id}`)}>
// //                                         <td className="py-4 font-medium text-gray-700 truncate max-w-[200px]">{course.title}</td>
// //                                         <td className="py-4 text-gray-600 font-medium">₹{course.price}</td>
// //                                         <td className="py-4 text-gray-600">{course.enrolled?.length || 0}</td>
// //                                         <td className="py-4 text-center">
// //                                             <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
// //                                                 course.isPublished ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"
// //                                             }`}>
// //                                                 {course.isPublished ? "Published" : "Draft"}
// //                                             </span>
// //                                         </td>
// //                                     </tr>
// //                                 ))
// //                             ) : (
// //                                 <tr>
// //                                     <td colSpan="4" className="py-10 text-center text-gray-400 italic">No courses found.</td>
// //                                 </tr>
// //                             )}
// //                         </tbody>
// //                     </table>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // };

// // export default Dashboard;
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPlus, FaEdit, FaBook, FaUsers, FaChartBar } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEducatorData = async () => {
            try {
                const res = await axios.get("http://localhost:8000/api/course/get-creator", { withCredentials: true });
                if (res.data) { setCourses(res.data); }
            } catch (error) {
                toast.error("Database connection error!");
            } finally { setLoading(false); }
        };
        fetchEducatorData();
    }, []);

    // Stats Logic
    const totalStudents = courses.reduce((acc, c) => acc + (c.enrolledStudents?.length || 0), 0);
    const totalEarnings = courses.reduce((acc, c) => acc + (c.coursePrice * (c.enrolledStudents?.length || 0)), 0);

    return (
        <div className="min-h-screen bg-[#FDFBF7] pt-[110px] pb-10 px-5 md:px-12 font-jakarta">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-5">
                    <div>
                        <h1 className="text-4xl font-bold text-[#1A1A1A]">Instructor <span className="text-[#D4A373]">Console</span></h1>
                        <p className="text-gray-500 mt-1">Quick overview of your academy performance.</p>
                    </div>
                    <button 
                        onClick={() => navigate('/educator/create-course')}
                        className="bg-[#1A1A1A] text-white px-6 py-3 rounded-2xl font-bold hover:bg-black shadow-lg flex items-center gap-2"
                    >
                        <FaPlus className="text-[#D4A373]" /> Create New Course
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <StatCard icon={<FaBook />} label="Total Courses" value={courses.length} color="text-blue-500" bg="bg-blue-50" />
                    <StatCard icon={<FaUsers />} label="Total Students" value={totalStudents} color="text-green-500" bg="bg-green-50" />
                    <StatCard icon={<FaChartBar />} label="Total Earnings" value={`₹${0}`} color="text-orange-500" bg="bg-orange-50" />
                </div>

                {/* Simplified List */}
                <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-[#1A1A1A]">Recent Activity</h2>
                        <button onClick={() => navigate('/educator/courses')} className="text-[#D4A373] font-bold hover:underline">View All Courses</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <tbody className="divide-y divide-gray-50">
                                {courses.slice(0, 5).map((course) => (
                                    <tr key={course._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <img src={course.courseThumbnail} className="w-12 h-12 rounded-lg object-cover" alt="" />
                                                <span className="font-bold text-[#1A1A1A]">{course.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${course.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {course.isPublished ? 'Live' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button onClick={() => navigate(`/educator/edit-course/${course._id}`)} className="p-3 bg-gray-100 rounded-xl hover:bg-[#1A1A1A] hover:text-white transition-all">
                                                <FaEdit size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, color, bg }) => (
    <div className="bg-white p-6 rounded-[30px] shadow-sm border border-gray-100 flex items-center gap-5">
        <div className={`${bg} ${color} p-4 rounded-2xl text-xl`}>{icon}</div>
        <div>
            <p className="text-gray-400 text-xs font-bold uppercase">{label}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
        </div>
    </div>
);

export default Dashboard;