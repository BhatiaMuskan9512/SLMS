// src/components/Sdashboard_components/ContinueLearning.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ContinueLearning = ({ courses }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white p-8 rounded-[30px] shadow-sm border border-gray-100 w-full min-h-[350px]">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Continue Learning</h2>
                <span 
                    onClick={() => navigate('/my-courses')} 
                    className="text-sm font-bold text-[#d4a843] cursor-pointer hover:underline tracking-wide transition-all"
                >
                    View all →
                </span>
            </div>

            {/* Courses List Container */}
            <div className="flex flex-col gap-5">
                {courses && courses.length > 0 ? (
                    // Displaying top 4 enrolled courses
                    courses.slice(0, 4).map((course) => {
                        const totalLectures = course.lectures?.length || 0;

                        return (
                            <div 
                                key={course._id}
                                onClick={() => navigate(`/course-player/${course._id}`)}
                                // 🌟 Default: Halka gray (bg-gray-50/60) aur soft border
                                // 🌟 Hover: Premium yellow background aur golden border
                                className="group flex items-center gap-6 p-5 rounded-2xl border border-gray-100 bg-gray-50/60 hover:border-[#d4a843]/30 hover:bg-[#FFFDF5] transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
                            >
                                {/* Course Thumbnail Container */}
                                <div className="relative w-16 h-16 flex-shrink-0">
                                    <img 
                                        src={course.thumbnail || "https://placehold.co/100x100?text=SkillLink"} 
                                        alt={course.title} 
                                        className="w-full h-full rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform duration-300"
                                    />
                                    {/* Subtle Indicator on Hover */}
                                    {/* <span className="absolute top-2 right-2 bg-[#d4a843] text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                    </span> */}
                                </div>

                                {/* Course Information */}
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-lg text-gray-800 transition-colors line-clamp-1 group-hover:text-[#d4a843]">
                                            {course.title}
                                        </h4>
                                        <span className="text-[10px] font-bold text-gray-400 ml-2 bg-white px-2 py-1 rounded-lg border border-gray-100 shadow-xs">
                                            {totalLectures} lectures
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1 italic opacity-80">
                                        {course.category || "General Development"}
                                    </p>
                                </div>

                                {/* Interactive Arrow Icon */}
                                <span className="text-xl font-bold text-gray-300 group-hover:text-[#d4a843] group-hover:translate-x-1 transition-all duration-300">
                                    →
                                </span>
                            </div>
                        );
                    })
                ) : (
                    /* Empty State for Dashboard */
                    <div className="py-16 text-center bg-gray-50/30 rounded-[30px] border border-dashed border-gray-200">
                        <div className="text-5xl mb-4 opacity-20">📚</div>
                        <p className="text-gray-400 text-sm font-medium">No courses found in your library.</p>
                        <button 
                            onClick={() => navigate('/all-courses')}
                            className="mt-5 text-[#d4a843] text-xs font-bold border-b-2 border-[#d4a843] pb-1 hover:border-[#d4a843]/50 transition-all"
                        >
                            Explore Catalog
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContinueLearning;



// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// const ContinueLearning = ({ courses }) => {
//     const navigate = useNavigate();

//     return (
//         <div className="bg-white p-8 rounded-[30px] shadow-sm border border-gray-100 h-full">
//             <div className="flex justify-between items-center mb-8">
//                 <h2 className="text-2xl font-bold text-gray-800">Continue Learning</h2>
//                 <span 
//                     onClick={() => navigate('/my-courses')} 
//                     className="text-sm font-bold text-[#d4a843] cursor-pointer hover:underline tracking-wide"
//                 >
//                     View all →
//                 </span>
//             </div>

//             <div className="flex flex-col gap-5">
//                 {courses && courses.length > 0 ? (
//                     // Sirf top 3 ya 4 courses dikhayenge dashboard par
//                     courses.slice(0, 4).map((course) => (
//                         <div 
//                             key={course._id}
//                             onClick={() => navigate(`/course-player/${course._id}`)}
//                             className="group flex items-center gap-5 p-4 rounded-2xl border border-transparent hover:border-[#d4a843]/20 hover:bg-[#FFFDF5] transition-all duration-300 cursor-pointer"
//                         >
//                             {/* Course Thumbnail */}
//                             <div className="relative w-16 h-16 flex-shrink-0">
//                                 <img 
//                                     src={course.thumbnail || "https://placehold.co/100x100?text=SkillLink"} 
//                                     alt={course.title} 
//                                     className="w-full h-full rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform"
//                                 />
//                             </div>

//                             {/* Course Info */}
//                             <div className="flex-1">
//                                 <div className="flex justify-between items-start">
//                                     <h4 className="font-bold text-gray-800 group-hover:text-[#d4a843] transition-colors line-clamp-1">
//                                         {course.title}
//                                     </h4>
//                                     <span className="text-[10px] font-bold text-gray-400 ml-2">45%</span>
//                                 </div>
//                                 <p className="text-xs text-gray-400 mt-0.5">{course.instructor || "Expert Instructor"}</p>
                                
//                                 {/* Dynamic Progress Bar (Abhi ke liye 45% static hai, logic baad mein add kar sakte hain) */}
//                                 <div className="w-full bg-gray-100 h-1.5 rounded-full mt-3 overflow-hidden">
//                                     <div 
//                                         className="bg-[#d4a843] h-1.5 rounded-full transition-all duration-500" 
//                                         style={{ width: '45%' }}
//                                     ></div>
//                                 </div>
//                             </div>
//                         </div>
//                     ))
//                 ) : (
//                     /* Empty State */
//                     <div className="py-12 text-center">
//                         <div className="text-4xl mb-3 opacity-20">📚</div>
//                         <p className="text-gray-400 text-sm font-medium">No active courses found.</p>
//                         <button 
//                             onClick={() => navigate('/all-courses')}
//                             className="mt-4 text-[#d4a843] text-xs font-bold border-b border-[#d4a843]"
//                         >
//                             Explore Catalog
//                         </button>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ContinueLearning;




// import React, { useState, useEffect } from 'react';

// const ContinueLearning = () => {
//     // Progress bar animation ke liye state
//     const [animate, setAnimate] = useState(false);

//     useEffect(() => {
//         // Component load hone ke thodi der baad width set karega taaki animation dikhe
//         const timer = setTimeout(() => setAnimate(true), 100);
//         return () => clearTimeout(timer);
//     }, []);

//     const coursesData = [
//         {
//             id: 1,
//             icon: '🐍',
//             gradient: 'from-[#0f1a35] to-[#0a1020]',
//             title: 'Python for Data Science',
//             meta: 'Arjun Mehta · Chapter 4 of 12',
//             progress: 66,
//             color: '#3ecfc6'
//         },
//         {
//             id: 2,
//             icon: '⚛️',
//             gradient: 'from-[#1a2a1f] to-[#0f1f15]',
//             title: 'Advanced React & Next.js',
//             meta: 'Priya Sharma · Chapter 7 of 15',
//             progress: 42,
//             color: '#d4a843'
//         },
//         {
//             id: 3,
//             icon: '🎨',
//             gradient: 'from-[#2a1a30] to-[#1a0f20]',
//             title: 'UI/UX Design Masterclass',
//             meta: 'Riya Kapoor · Chapter 2 of 10',
//             progress: 18,
//             color: '#a78bfa'
//         },
//         {
//             id: 4,
//             icon: '🗄️',
//             gradient: 'from-[#2a1e0a] to-[#1a1205]',
//             title: 'SQL & Database Design',
//             meta: 'Vikram Joshi · Chapter 9 of 9 ✅',
//             progress: 100,
//             color: '#6bcb77'
//         }
//     ];

//     const handleCourseClick = (title, icon) => {
//         alert(`Opening ${title} ${icon}`);
//         // Yahan aap useNavigate() se us course ke page par bhej sakti hain
//     };

//     return (
//         <div className="bg-white rounded-[24px] border border-black/5 p-2.5 shadow-sm">
            
//             {/* Header */}
//             <div className="flex items-center justify-between px-5 py-4">
//                 <span className="text-[15px] font-bold text-[#0a0b0f]">
//                     Continue Learning
//                 </span>
//                 <button 
//                     onClick={() => alert("Opening all courses...")}
//                     className="text-[13px] text-[#d4a843] cursor-pointer font-medium hover:underline focus:outline-none"
//                 >
//                     View all →
//                 </button>
//             </div>

//             {/* Course List */}
//             <div className="flex flex-col">
//                 {coursesData.map((course, index) => (
//                     <div 
//                         key={course.id}
//                         onClick={() => handleCourseClick(course.title, course.icon)}
//                         className={`flex items-center gap-3.5 px-5 py-3.5 cursor-pointer transition-colors hover:bg-[#fafaf8] rounded-xl ${
//                             index !== 0 ? 'border-t border-black/5' : ''
//                         }`}
//                     >
//                         {/* Thumbnail */}
//                         <div className={`w-[52px] h-[52px] rounded-xl flex items-center justify-center text-2xl shrink-0 bg-gradient-to-br ${course.gradient}`}>
//                             {course.icon}
//                         </div>

//                         {/* Info & Progress */}
//                         <div className="flex-1 min-w-0">
//                             <h3 className="text-[14px] font-semibold text-[#0a0b0f] truncate">
//                                 {course.title}
//                             </h3>
//                             <p className="text-[12px] text-[#8a8c98] mt-0.5">
//                                 {course.meta}
//                             </p>
                            
//                             {/* Progress Bar Container */}
//                             <div className="flex items-center gap-2 mt-2">
//                                 <div className="flex-1 h-1 bg-[#f0eadb] rounded-full overflow-hidden">
//                                     <div 
//                                         className="h-full rounded-full transition-all duration-1000 ease-out"
//                                         style={{ 
//                                             width: animate ? `${course.progress}%` : '0%',
//                                             backgroundColor: course.color 
//                                         }}
//                                     />
//                                 </div>
//                                 <span className="text-[11px] text-[#8a8c98] font-medium shrink-0">
//                                     {course.progress}%
//                                 </span>
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>
            
//         </div>
//     );
// };

// export default ContinueLearning;