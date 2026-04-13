import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BiPlayCircle, BiLoaderAlt } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
const MyEnrolledCourses = () => {
    const navigate = useNavigate();
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchMyCourses = async () => {
            try {
                const res = await axios.get("http://localhost:8000/api/course/my-courses", {
                    withCredentials: true
                });
                setEnrolledCourses(res.data);
            } catch (error) {
                console.error("Failed to fetch my courses", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMyCourses();
    }, []);

    const filteredCourses = enrolledCourses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="flex justify-center p-10"><BiLoaderAlt className="text-3xl animate-spin text-[#d4a843]" /></div>;

return (
     <div className="w-full min-h-screen bg-[#F6F4EC]">
    <div className="w-full min-h-screen animate-fadeIn pt-[100px] px-10 pb-10 max-w-[1200px] mx-auto bg-[#F6F4EC]">
        
        {/* ✅ Back Button */}
            <button 
                onClick={() => navigate(-1)} 
                className="mb-4 text-gray-400 hover:text-gray-600 flex items-center gap-2 font-bold text-xs bg-transparent border-none cursor-pointer uppercase tracking-widest"
            >
                ← Back
            </button>

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                My Learning <BiPlayCircle className="text-[#d4a843]" />
            </h2>
            <div className="flex items-center gap-3">
                {/* Search Bar - compact */}
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm shadow-sm focus-within:border-[#d4a843]">
                    <span>🔍</span>
                    <input
                        type="text"
                        placeholder="Search courses..."
                        className="outline-none bg-transparent w-[200px] text-gray-800"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <span className="text-sm font-semibold text-[#d4a843] bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm whitespace-nowrap">
                    {enrolledCourses.length} Courses Enrolled
                </span>
            </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {filteredCourses.map((course) => (
                <div
                    key={course._id}
                    className="bg-white rounded-[24px] overflow-hidden border border-black/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group cursor-pointer"
                    onClick={() => navigate(`/course-player/${course._id}`)}
                >
                    <div className="h-44 w-full bg-gray-100 overflow-hidden">
                        <img
                            src={course.thumbnail || "https://placehold.co/600x400"}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            alt={course.title}
                        />
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                        <h3 className="font-bold text-base text-gray-800 line-clamp-2 mb-1 group-hover:text-[#d4a843] transition-colors">
                            {course.title}
                        </h3>
                        <p className="text-sm text-gray-400 mb-5 italic">
                            by {course.creator?.name || "Expert Instructor"}
                        </p>

                        <button className="w-full mt-auto bg-gray-50 text-gray-700 py-2.5 rounded-xl text-sm font-bold group-hover:bg-[#d4a843] group-hover:text-white transition-all flex items-center justify-center gap-2">
                            <BiPlayCircle className="text-lg" /> Continue Learning
                        </button>
                    </div>
                </div>
            ))}

            {filteredCourses.length === 0 && (
                <div className="col-span-full text-center py-16 text-gray-400">
                    No courses match your search. 🔍
                </div>
            )}
        </div>
    </div>
    </div>
);
};

export default MyEnrolledCourses;


// import React, { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import Card from '../components/Card';
// import { BiBookOpen, BiPlayCircle, BiCompass } from "react-icons/bi";

// const MyEnrolledCourses = () => {
//     const navigate = useNavigate();
    
//     // 1. Get the current user and the global course list from Redux
//     const { user, isAuthenticated } = useSelector((state) => state.auth);
//     const { courseData } = useSelector((state) => state.course);

//     // 2. Local state to store filtered enrolled courses
//     const [enrolledCourses, setEnrolledCourses] = useState([]);

//     useEffect(() => {
//         // 3. Logic: Filter courses where the user's ID is in the 'enrolled' array
//         if (user && courseData) {
//             const filtered = courseData.filter(course => 
//                 course.enrolled && course.enrolled.includes(user._id)
//             );
//             setEnrolledCourses(filtered);
//         }
//     }, [user, courseData]);

//     // 4. Security Check: If not logged in, redirect to login
//     if (!isAuthenticated) {
//         return (
//             <div className="min-h-screen flex flex-col items-center justify-center p-5 text-center">
//                 <BiBookOpen className="text-6xl text-gray-200 mb-4" />
//                 <h2 className="text-2xl font-bold text-gray-800">Login to see your courses</h2>
//                 <button 
//                     onClick={() => navigate('/login')}
//                     className="mt-6 bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all"
//                 >
//                     Go to Login
//                 </button>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-50 pt-[120px] pb-20 px-5 sm:px-10 lg:px-20">
//             <div className="max-w-7xl mx-auto">
                
//                 {/* --- Header Section --- */}
//                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
//                     <div>
//                         <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
//                             My Learning <BiPlayCircle className="text-blue-600" />
//                         </h1>
//                         <p className="text-gray-500 mt-2">
//                             You are currently enrolled in {enrolledCourses.length} courses.
//                         </p>
//                     </div>
                    
//                     {enrolledCourses.length > 0 && (
//                         <button 
//                             onClick={() => navigate('/all-courses')}
//                             className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline"
//                         >
//                             <BiCompass /> Browse More Courses
//                         </button>
//                     )}
//                 </div>

//                 {/* --- Courses Grid --- */}
//                 {enrolledCourses.length > 0 ? (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//                         {enrolledCourses.map((course) => (
//                             <Card 
//                                 key={course._id}
//                                 id={course._id}
//                                 thumbnail={course.thumbnail}
//                                 title={course.title}
//                                 category={course.category}
//                                 price={course.price}
//                                 reviews={course.reviews}
//                                 isEnrolled={true} // Prop to show "Continue Watching" instead of "Buy Now"
//                             />
//                         ))}
//                     </div>
//                 ) : (
//                     /* --- Empty State --- */
//                     <div className="bg-white rounded-3xl border border-gray-100 p-12 sm:p-20 text-center shadow-sm flex flex-col items-center">
//                         <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-4xl mb-6">
//                             <BiBookOpen className="text-gray-300" />
//                         </div>
//                         <h2 className="text-xl font-bold text-gray-800">No courses found!</h2>
//                         <p className="text-gray-500 mt-2 max-w-sm">
//                             You haven't enrolled in any courses yet. Start your journey by exploring our top-rated programs.
//                         </p>
//                         <button 
//                             onClick={() => navigate('/all-courses')}
//                             className="mt-8 bg-black text-white px-10 py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg"
//                         >
//                             Explore Courses
//                         </button>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default MyEnrolledCourses;