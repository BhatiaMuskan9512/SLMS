import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BiSearchAlt, BiLoaderAlt, BiSortAlt2 } from "react-icons/bi";
import toast from 'react-hot-toast'; // ✅ Added Toast

const AllCourses = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('search');
    const navigate = useNavigate();

    const { courseData } = useSelector((state) => state.course);
    // ✅ Added 'user' from Redux to check login status
    const { user } = useSelector((state) => state.auth || state.user); 

    const [filteredCourses, setFilteredCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [aiActive, setAiActive] = useState(false);

    useEffect(() => {
        const handleSearch = async () => {
            if (query) {
                setLoading(true);
                setAiActive(true);
                try {
                    const response = await axios.post(
                        "http://localhost:8000/api/course/search", 
                        { prompt: query },
                        { withCredentials: true }
                    );
                    console.log("ALL COURSES DATA:", response.data);
                    setFilteredCourses(response.data);
                } catch (error) {
                    console.error("AI Search failed:", error);
                    setFilteredCourses([]);
                } finally {
                    setLoading(false);
                }
            } else {
                setAiActive(false);
                setFilteredCourses(courseData);
            }
        };

        handleSearch();
    }, [query, courseData]);

    // ✅ NAYA ENROLLMENT LOGIC FUNCTION
    const handleEnroll = async (e, courseId, isFree) => {
        e.stopPropagation(); 

        if (!user) {
            toast.error("Please login to enroll in courses!");
            navigate('/login'); 
            return;
        }

        if (isFree) {
            // Humne toastId ko variable mein liya hai
            const toastId = toast.loading("Enrolling..."); 
            try {
                const response = await axios.post(
                    `http://localhost:8000/api/course/${courseId}/enroll`,
                    {}, 
                    { withCredentials: true } 
                );

                // Success hone par loading wala toast success mein badal jayega
                toast.success(response.data.message, { id: toastId });
                
                setTimeout(() => {
                    navigate(`/course-player/${courseId}`); 
                }, 1500);

            } catch (error) {
                // YAHAN BADLAV HAI: 
                // Error aane par hum usi toastId ko use karke error dikhayenge,
                // isse "Enrolling..." wala loading hat jayega.
                toast.error(error.response?.data?.message || "Failed to enroll", { id: toastId });
                
                if(error.response?.status === 400) {
                    setTimeout(() => {
                        navigate(`/course-player/${courseId}`);
                    }, 1500);
                }
            }
        } else {
            toast("Redirecting to payment gateway...", { icon: '💳' });
        }
    };
    
    return (
        <div className="min-h-screen bg-[#F6F4EC] pt-[100px] pb-20 px-5 sm:px-10 lg:px-20 font-sans">
            
            {/* --- Page Header --- */}
            <div className="max-w-[1400px] mx-auto mb-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-gray-500 hover:text-[#d4a843] transition-colors mb-4 group"
                        >
                            <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
                            <span className="font-medium text-sm">Back</span>
                        </button>

                        <h1 className="text-3xl md:text-4xl font-extrabold text-[#0a0b0f] tracking-tight">
                            {aiActive ? `AI Results for: "${query}"` : "Browse All Courses"}
                        </h1>
                        <p className="text-gray-500 mt-2 text-lg">
                            {aiActive 
                                ? `Gemini AI found ${filteredCourses?.length || 0} courses matching your request.` 
                                : `Explore our library of ${courseData?.length || 0} professional courses.`
                            }
                        </p>
                    </div>

                    {/* <button className="flex items-center gap-2 bg-white border border-gray-200 text-[#0a0b0f] px-5 py-2.5 rounded-xl font-medium shadow-sm hover:border-[#d4a843] hover:text-[#d4a843] transition-colors">
                        <BiSortAlt2 className="text-xl" />
                        <span>Filter by Category</span>
                    </button> */}
                </div>
            </div>

            {/* --- Main Content Area --- */}
            <div className="max-w-[1400px] mx-auto">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-5">
                        <BiLoaderAlt className="text-5xl text-[#d4a843] animate-spin" />
                        <p className="text-[#0a0b0f] font-medium animate-pulse text-lg">
                            Gemini AI is analyzing your request...
                        </p>
                    </div>
                ) : filteredCourses && filteredCourses.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredCourses.map((course) => {
                            console.log("COURSE DEBUG:", course.title, " | Creator Field:", course.creator);
                            const isFree = !course.price || course.price === 0;

                            return (
                                <div 
                                    key={course._id} 
                                    className="bg-white rounded-[24px] overflow-hidden border border-black/5 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group cursor-pointer"
                                    onClick={() => navigate(`/course-detail/${course._id}`)}
                                >
                                    <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                                        {course.thumbnail ? (
                                            <img 
                                                src={course.thumbnail} 
                                                alt={course.title} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                onError={(e) => {
                                                    e.target.onerror = null; 
                                                    e.target.src = "https://placehold.co/600x400/eeeeee/cccccc?text=Course+Image";
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-[#0f1a35] to-[#0a1020] flex items-center justify-center">
                                                <span className="text-white font-bold text-xl opacity-50">SkillLink</span>
                                            </div>
                                        )}
                                        
                                        {course.category && (
                                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-[#0a0b0f] shadow-sm">
                                                {course.category}
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-5 flex flex-col flex-1">
                                        <h3 className="font-bold text-lg text-[#0a0b0f] leading-snug line-clamp-2 mb-2 group-hover:text-[#d4a843] transition-colors">
                                            {course.title}
                                        </h3>
                                        
                                        <p className="text-sm text-gray-500 mb-4 flex-1 line-clamp-1">
                                            by <span className="font-medium text-gray-700">{course.creator && typeof course.creator === 'object' 
            ? course.creator.name 
            : "Expert Instructor"}</span>
                                        </p>

                                        <div className="flex items-center gap-1.5 mb-5">
                                            <span className="text-yellow-400 text-sm">★</span>
                                            <span className="text-sm font-bold text-gray-800">{course.rating || "4.5"}</span>
                                            <span className="text-xs text-gray-400">({course.reviews || 0} reviews)</span>
                                        </div>

                                        <div className="w-full h-px bg-gray-100 mb-4"></div>

                                        <div className="flex items-center justify-between mt-auto">
                                            <div className="font-extrabold text-xl text-[#0a0b0f]">
                                                {isFree ? (
                                                    <span className="text-green-600">Free</span>
                                                ) : (
                                                    `₹${course.price.toLocaleString('en-IN')}`
                                                )}
                                            </div>
                                            
                                            {/* ✅ UPDATED BUTTON LOGIC */}
                                            <button 
                                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                                                    isFree 
                                                    ? 'bg-[#0a0b0f] text-white hover:bg-gray-800' 
                                                    : 'bg-[#d4a843]/10 text-[#8a5a00] hover:bg-[#d4a843]/20'
                                                }`}
                                                onClick={(e) => handleEnroll(e, course._id, isFree)}
                                            >
                                                {isFree ? 'Enroll for Free' : 'Buy Now'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-gray-100 shadow-sm max-w-3xl mx-auto">
                        <div className="w-20 h-20 bg-[#F6F4EC] rounded-full flex items-center justify-center text-4xl mb-4">
                            <BiSearchAlt className="text-[#d4a843]" />
                        </div>
                        <h2 className="text-2xl font-bold text-[#0a0b0f]">No courses found</h2>
                        <p className="text-gray-500 mt-2 mb-6">We couldn't find any courses matching "{query}". Try a different search.</p>
                        <button 
                            onClick={() => navigate('/all-courses')}
                            className="bg-[#0a0b0f] text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-md"
                        >
                            Clear search and view all
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllCourses;




// import React, { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { useSearchParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { BiSearchAlt, BiLoaderAlt, BiSortAlt2 } from "react-icons/bi";

// const AllCourses = () => {
//     // 1. Get search query from URL (e.g., ?search=react)
//     const [searchParams] = useSearchParams();
//     const query = searchParams.get('search');
//     const navigate = useNavigate(); // Navigate initialize kiya cards pe click ke liye

//     // 2. Local states for filtering and AI results
//     const { courseData } = useSelector((state) => state.course);
//     const [filteredCourses, setFilteredCourses] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [aiActive, setAiActive] = useState(false);

//     // 3. Logic: Fetch AI Search results OR Show all Published Courses
//     useEffect(() => {
//         const handleSearch = async () => {
//             if (query) {
//                 setLoading(true);
//                 setAiActive(true);
//                 try {
//                     // Call the AI search endpoint on the backend
//                     const response = await axios.post(
//                         "http://localhost:8000/api/course/search", 
//                         { prompt: query },
//                         { withCredentials: true }
//                     );
//                     setFilteredCourses(response.data);
//                 } catch (error) {
//                     console.error("AI Search failed:", error);
//                     setFilteredCourses([]);
//                 } finally {
//                     setLoading(false);
//                 }
//             } else {
//                 // If no search query, show all courses from Redux
//                 setAiActive(false);
//                 setFilteredCourses(courseData);
//             }
//         };

//         handleSearch();
//     }, [query, courseData]);

//     return (
//         <div className="min-h-screen bg-[#F6F4EC] pt-[100px] pb-20 px-5 sm:px-10 lg:px-20 font-sans">
            
//             {/* --- Page Header --- */}
//             <div className="max-w-[1400px] mx-auto mb-12">
//                 <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
//                     <div>
//                         <h1 className="text-3xl md:text-4xl font-extrabold text-[#0a0b0f] tracking-tight">
//                             {aiActive ? `AI Results for: "${query}"` : "Browse All Courses"}
//                         </h1>
//                         <p className="text-gray-500 mt-2 text-lg">
//                             {aiActive 
//                                 ? `Gemini AI found ${filteredCourses.length} courses matching your request.` 
//                                 : `Explore our library of ${courseData?.length || 0} professional courses.`
//                             }
//                         </p>
//                     </div>

//                     {/* Filter Button */}
//                     <button className="flex items-center gap-2 bg-white border border-gray-200 text-[#0a0b0f] px-5 py-2.5 rounded-xl font-medium shadow-sm hover:border-[#d4a843] hover:text-[#d4a843] transition-colors">
//                         <BiSortAlt2 className="text-xl" />
//                         <span>Filter by Category</span>
//                     </button>
//                 </div>
//             </div>

//             {/* --- Main Content Area --- */}
//             <div className="max-w-[1400px] mx-auto">
//                 {loading ? (
//                     /* Loading State */
//                     <div className="flex flex-col items-center justify-center py-32 gap-5">
//                         <BiLoaderAlt className="text-5xl text-[#d4a843] animate-spin" />
//                         <p className="text-[#0a0b0f] font-medium animate-pulse text-lg">
//                             Gemini AI is analyzing your request...
//                         </p>
//                     </div>
//                 ) : filteredCourses && filteredCourses.length > 0 ? (
//                     /* Courses Grid */
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//                         {filteredCourses.map((course) => {
//                             // Logic for checking if course is free
//                             const isFree = !course.price || course.price === 0;

//                             return (
//                                 <div 
//                                     key={course._id} 
//                                     className="bg-white rounded-[24px] overflow-hidden border border-black/5 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group cursor-pointer"
//                                     onClick={() => navigate(`/course-view/${course._id}`)}
//                                 >
//                                     {/* Thumbnail Area */}
//                                     <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
//                                         {course.thumbnail ? (
//                                             <img 
//                                                 src={course.thumbnail} 
//                                                 alt={course.title} 
//                                                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                                                 onError={(e) => {
//                                                     // Fallback if image link from DB is broken
//                                                     e.target.onerror = null; 
//                                                     e.target.src = "https://placehold.co/600x400/eeeeee/cccccc?text=Course+Image";
//                                                 }}
//                                             />
//                                         ) : (
//                                             // Fallback if no thumbnail in DB
//                                             <div className="w-full h-full bg-gradient-to-br from-[#0f1a35] to-[#0a1020] flex items-center justify-center">
//                                                 <span className="text-white font-bold text-xl opacity-50">SkillLink</span>
//                                             </div>
//                                         )}
                                        
//                                         {/* Category Badge */}
//                                         {course.category && (
//                                             <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-[#0a0b0f] shadow-sm">
//                                                 {course.category}
//                                             </div>
//                                         )}
//                                     </div>

//                                     {/* Content Area */}
//                                     <div className="p-5 flex flex-col flex-1">
//                                         <h3 className="font-bold text-lg text-[#0a0b0f] leading-snug line-clamp-2 mb-2 group-hover:text-[#d4a843] transition-colors">
//                                             {course.title}
//                                         </h3>
                                        
//                                         <p className="text-sm text-gray-500 mb-4 flex-1 line-clamp-1">
//                                             by <span className="font-medium text-gray-700">{course.instructor || "Expert Instructor"}</span>
//                                         </p>

//                                         {/* Rating & Reviews */}
//                                         <div className="flex items-center gap-1.5 mb-5">
//                                             <span className="text-yellow-400 text-sm">★</span>
//                                             <span className="text-sm font-bold text-gray-800">{course.rating || "4.5"}</span>
//                                             <span className="text-xs text-gray-400">({course.reviews || 0} reviews)</span>
//                                         </div>

//                                         {/* Divider */}
//                                         <div className="w-full h-px bg-gray-100 mb-4"></div>

//                                         {/* Footer: Price & Action */}
//                                         <div className="flex items-center justify-between mt-auto">
//                                             <div className="font-extrabold text-xl text-[#0a0b0f]">
//                                                 {isFree ? (
//                                                     <span className="text-green-600">Free</span>
//                                                 ) : (
//                                                     `₹${course.price.toLocaleString('en-IN')}`
//                                                 )}
//                                             </div>
                                            
//                                             <button 
//                                                 className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
//                                                     isFree 
//                                                     ? 'bg-[#0a0b0f] text-white hover:bg-gray-800' 
//                                                     : 'bg-[#d4a843]/10 text-[#8a5a00] hover:bg-[#d4a843]/20'
//                                                 }`}
//                                                 onClick={(e) => {
//                                                     e.stopPropagation(); // Card ke click ko rokne ke liye
//                                                     alert(isFree ? `Enrolling for free in: ${course.title}` : `Redirecting to payment for: ${course.title}`);
//                                                 }}
//                                             >
//                                                 {isFree ? 'Enroll for Free' : 'Buy Now'}
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             );
//                         })}
//                     </div>
//                 ) : (
//                     /* No Results Found */
//                     <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-gray-100 shadow-sm max-w-3xl mx-auto">
//                         <div className="w-20 h-20 bg-[#F6F4EC] rounded-full flex items-center justify-center text-4xl mb-4">
//                             <BiSearchAlt className="text-[#d4a843]" />
//                         </div>
//                         <h2 className="text-2xl font-bold text-[#0a0b0f]">No courses found</h2>
//                         <p className="text-gray-500 mt-2 mb-6">We couldn't find any courses matching "{query}". Try a different search.</p>
//                         <button 
//                             onClick={() => window.location.href = '/all-courses'}
//                             className="bg-[#0a0b0f] text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-md"
//                         >
//                             Clear search and view all
//                         </button>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default AllCourses;

// // import React, { useEffect, useState } from 'react';
// // import { useSelector } from 'react-redux';
// // import { useSearchParams } from 'react-router-dom';
// // import axios from 'axios';
// // import Card from '../components/Card'; // Aapka naya awesome card!
// // import { BiSearchAlt, BiLoaderAlt, BiSortAlt2 } from "react-icons/bi";

// // const AllCourses = () => {
// //     const [searchParams] = useSearchParams();
// //     const query = searchParams.get('search');

// //     const { courseData } = useSelector((state) => state.course);
// //     const [filteredCourses, setFilteredCourses] = useState([]);
// //     const [loading, setLoading] = useState(false);
// //     const [aiActive, setAiActive] = useState(false);

// //     useEffect(() => {
// //         const handleSearch = async () => {
// //             if (query) {
// //                 setLoading(true);
// //                 setAiActive(true);
// //                 try {
// //                     const response = await axios.post(
// //                         "http://localhost:8000/api/course/search", 
// //                         { prompt: query },
// //                         { withCredentials: true }
// //                     );
// //                     setFilteredCourses(response.data);
// //                 } catch (error) {
// //                     console.error("AI Search failed:", error);
// //                     setFilteredCourses([]);
// //                 } finally {
// //                     setLoading(false);
// //                 }
// //             } else {
// //                 setAiActive(false);
// //                 setFilteredCourses(courseData);
// //             }
// //         };

// //         handleSearch();
// //     }, [query, courseData]);

// //     return (
// //         <div className="min-h-screen bg-[#F6F4EC] pt-[100px] pb-20 px-5 sm:px-10 lg:px-20 font-sans">
            
// //             {/* --- Page Header --- */}
// //             <div className="max-w-[1400px] mx-auto mb-12">
// //                 <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
// //                     <div>
// //                         <h1 className="text-3xl md:text-4xl font-extrabold text-[#0a0b0f] tracking-tight">
// //                             {aiActive ? `AI Results for: "${query}"` : "Browse All Courses"}
// //                         </h1>
// //                         <p className="text-gray-500 mt-2 text-lg">
// //                             {aiActive 
// //                                 ? `Gemini AI found ${filteredCourses.length} courses matching your request.` 
// //                                 : `Explore our library of ${courseData?.length || 0} professional courses.`
// //                             }
// //                         </p>
// //                     </div>

// //                     {/* Filter Button */}
// //                     <button className="flex items-center gap-2 bg-white border border-gray-200 text-[#0a0b0f] px-5 py-2.5 rounded-xl font-medium shadow-sm hover:border-[#d4a843] hover:text-[#d4a843] transition-colors">
// //                         <BiSortAlt2 className="text-xl" />
// //                         <span>Filter by Category</span>
// //                     </button>
// //                 </div>
// //             </div>

// //             {/* --- Main Content Area --- */}
// //             <div className="max-w-[1400px] mx-auto">
// //                 {loading ? (
// //                     <div className="flex flex-col items-center justify-center py-32 gap-5">
// //                         <BiLoaderAlt className="text-5xl text-[#d4a843] animate-spin" />
// //                         <p className="text-[#0a0b0f] font-medium animate-pulse text-lg">Gemini AI is analyzing your request...</p>
// //                     </div>
// //                 ) : filteredCourses && filteredCourses.length > 0 ? (
// //                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
// //                         {filteredCourses.map((course) => (
// //                             <Card 
// //                                 key={course._id}
// //                                 id={course._id}
// //                                 thumbnail={course.thumbnail}
// //                                 title={course.title}
// //                                 category={course.category}
// //                                 price={course.price}
// //                                 reviews={course.reviews}
// //                                 instructor={course.instructor} // Agar backend se instructor aa raha ho
// //                                 rating={course.rating}         // Agar backend se rating aa rahi ho
// //                             />
// //                         ))}
// //                     </div>
// //                 ) : (
// //                     <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-gray-100 shadow-sm max-w-3xl mx-auto">
// //                         <div className="w-20 h-20 bg-[#F6F4EC] rounded-full flex items-center justify-center text-4xl mb-4">
// //                             <BiSearchAlt className="text-[#d4a843]" />
// //                         </div>
// //                         <h2 className="text-2xl font-bold text-[#0a0b0f]">No courses found</h2>
// //                         <p className="text-gray-500 mt-2 mb-6">We couldn't find any courses matching "{query}".</p>
// //                         <button 
// //                             onClick={() => window.location.href = '/all-courses'}
// //                             className="bg-[#0a0b0f] text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-md"
// //                         >
// //                             Clear search and view all
// //                         </button>
// //                     </div>
// //                 )}
// //             </div>
// //         </div>
// //     );
// // };

// // export default AllCourses;


// // // import React, { useEffect, useState } from 'react';
// // // import { useSelector } from 'react-redux';
// // // import { useSearchParams } from 'react-router-dom';
// // // import axios from 'axios';
// // // import Card from '../components/Card';
// // // import { BiSearchAlt, BiLoaderAlt, BiSortAlt2 } from "react-icons/bi";

// // // const AllCourses = () => {
// // //     // 1. Get search query from URL (e.g., ?search=react)
// // //     const [searchParams] = useSearchParams();
// // //     const query = searchParams.get('search');

// // //     // 2. Local states for filtering and AI results
// // //     const { courseData } = useSelector((state) => state.course);
// // //     const [filteredCourses, setFilteredCourses] = useState([]);
// // //     const [loading, setLoading] = useState(false);
// // //     const [aiActive, setAiActive] = useState(false);

// // //     // 3. Logic: Fetch AI Search results OR Show all Published Courses
// // //     useEffect(() => {
// // //         const handleSearch = async () => {
// // //             if (query) {
// // //                 setLoading(true);
// // //                 setAiActive(true);
// // //                 try {
// // //                     // Call the AI search endpoint on the backend
// // //                     const response = await axios.post(
// // //                         "http://localhost:8000/api/course/search", 
// // //                         { prompt: query },
// // //                         { withCredentials: true }
// // //                     );
// // //                     setFilteredCourses(response.data);
// // //                 } catch (error) {
// // //                     console.error("AI Search failed:", error);
// // //                     setFilteredCourses([]);
// // //                 } finally {
// // //                     setLoading(false);
// // //                 }
// // //             } else {
// // //                 // If no search query, show all courses from Redux
// // //                 setAiActive(false);
// // //                 setFilteredCourses(courseData);
// // //             }
// // //         };

// // //         handleSearch();
// // //     }, [query, courseData]);

// // //     return (
// // //         <div className="min-h-screen bg-gray-50 pt-[100px] pb-20 px-5 sm:px-10 lg:px-20">
            
// // //             {/* --- Page Header --- */}
// // //             <div className="max-w-7xl mx-auto mb-12">
// // //                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
// // //                     <div>
// // //                         <h1 className="text-3xl font-bold text-gray-800">
// // //                             {aiActive ? `AI Results for: "${query}"` : "Browse All Courses"}
// // //                         </h1>
// // //                         <p className="text-gray-500 mt-2">
// // //                             {aiActive 
// // //                                 ? `Gemini AI found ${filteredCourses.length} courses matching your request.` 
// // //                                 : `Explore our library of ${courseData.length} professional courses.`
// // //                             }
// // //                         </p>
// // //                     </div>

// // //                     {/* Simple Filter UI (Optional Visual) */}
// // //                     <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm text-sm font-medium text-gray-600">
// // //                         <BiSortAlt2 className="text-xl" />
// // //                         <span>Filter by Category</span>
// // //                     </div>
// // //                 </div>
// // //             </div>

// // //             {/* --- Main Content Area --- */}
// // //             <div className="max-w-7xl mx-auto">
// // //                 {loading ? (
// // //                     /* Loading State */
// // //                     <div className="flex flex-col items-center justify-center py-20 gap-4">
// // //                         <BiLoaderAlt className="text-5xl text-black animate-spin" />
// // //                         <p className="text-gray-500 font-medium animate-pulse">Gemini AI is analyzing your request...</p>
// // //                     </div>
// // //                 ) : filteredCourses.length > 0 ? (
// // //                     /* Courses Grid */
// // //                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
// // //                         {filteredCourses.map((course) => (
// // //                             <Card 
// // //                                 key={course._id}
// // //                                 id={course._id}
// // //                                 thumbnail={course.thumbnail}
// // //                                 title={course.title}
// // //                                 category={course.category}
// // //                                 price={course.price}
// // //                                 reviews={course.reviews}
// // //                             />
// // //                         ))}
// // //                     </div>
// // //                 ) : (
// // //                     /* No Results Found */
// // //                     <div className="flex flex-col items-center justify-center py-20 text-center">
// // //                         <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-4xl mb-4">
// // //                             <BiSearchAlt className="text-gray-400" />
// // //                         </div>
// // //                         <h2 className="text-xl font-bold text-gray-800">No courses found</h2>
// // //                         <p className="text-gray-500 mt-2">Try searching for something else, or browse our categories.</p>
// // //                         <button 
// // //                             onClick={() => window.location.href = '/all-courses'}
// // //                             className="mt-6 text-blue-600 font-bold hover:underline"
// // //                         >
// // //                             Clear search and view all
// // //                         </button>
// // //                     </div>
// // //                 )}
// // //             </div>
// // //         </div>
// // //     );
// // // };

// // // export default AllCourses;