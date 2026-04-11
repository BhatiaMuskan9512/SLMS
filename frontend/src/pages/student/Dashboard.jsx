
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/Sdashboard_components/Sidebar';
import StatCards from '../../components/Sdashboard_components/StatCards';
import ContinueLearning from '../../components/Sdashboard_components/ContinueLearning';
import Achievements from '../../components/Sdashboard_components/Achievements';
import UpcomingSessions from '../../components/Sdashboard_components/UpcomingSessions';

// ✅ Humne RecentActivity hatane ka faisla kiya hai

const Dashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const [view, setView] = useState("dashboard");

    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [totalMinutes, setTotalMinutes] = useState(0);
    const [streak, setStreak] = useState(0);

    // 1. Fetch Dynamic Data
    useEffect(() => {
    if (!isAuthenticated) {
        navigate("/login");
        return;
    }

    const fetchDashboardData = async () => {
        try {
            // Courses fetch karein
            const res = await axios.get("http://localhost:8000/api/course/my-courses", {
                withCredentials: true
            });
            setEnrolledCourses(res.data);

            // 🌟 Naya: User profile fetch karein fresh minutes ke liye
            // Dashboard.jsx mein fetchDashboardData ke andar ye line change karein:

const userRes = await axios.get("http://localhost:8000/api/user/get-current-user", { 
    withCredentials: true 
});

if (userRes.data.success) {
    // 🌟 Check karein: 'user' object ke andar 'totalMinutesLearned' hai ya nahi
    setTotalMinutes(userRes.data.user.totalMinutesLearned || 0);
    setStreak(userRes.data.user.streakCount || 0);
}
        } catch (error) {
            console.error("Dashboard fetch error", error);
        } finally {
            setLoading(false);
        }
    };
    fetchDashboardData();
}, [isAuthenticated, navigate]);

    if (!isAuthenticated) return null; // Prevents flickering

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#F6F4EC] pt-[80px]">
            <div className="w-10 h-10 border-4 border-t-[#d4a843] border-gray-200 rounded-full animate-spin mx-auto"></div>
        </div>
    );
    

    // Dono variables define karein taaki error na aaye
const filteredCourses = enrolledCourses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
);

const filteredEnrolled = filteredCourses; // filteredEnrolled ko define kar diya

return (
    <div className="flex w-full h-screen bg-[#F6F4EC] overflow-hidden box-border">
        
        {/* --- SIDEBAR --- */}
        <div className="w-[280px] hidden lg:block flex-shrink-0">
            <Sidebar setView={setView} activeView={view} />
        </div>
        
        {/* --- MAIN CONTENT AREA --- */}
        <div className="flex-1 h-full overflow-y-auto overflow-x-hidden p-6 md:p-8 box-border">
            <div className="max-w-[1400px] mx-auto">
            
                {/* 1. Common Search Bar */}
                <div className="flex items-center justify-end gap-4 mb-4 mt-2">
                    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-600 min-w-[300px] shadow-sm focus-within:border-[#d4a843]">
                        <span>🔍</span>
                        <input 
                            type="text" 
                            placeholder="Search courses..." 
                            className="outline-none bg-transparent w-full text-gray-800"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="w-12 h-12 rounded-2xl border border-gray-200 bg-white flex items-center justify-center cursor-pointer relative hover:border-[#d4a843]/30 shadow-sm transition-all">
                        <span className="text-xl">🔔</span>
                        <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                    </div>
                </div>

                {/* 🌟 CONDITIONAL RENDERING (Fixed Syntax) 🌟 */}
                {view === "dashboard" ? (
                    <>
                        <div className="bg-white p-8 rounded-[30px] shadow-sm border border-gray-100 mb-8 w-full flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-sans font-bold text-gray-800 tracking-tight">
                                    Welcome back, {user?.name || "Learner"}! 👋
                                </h1>
                                <p className="text-gray-500 mt-2">
                                    You have {enrolledCourses.length} active courses.
                                </p>
                            </div>
                        </div>
                        <div className="mb-10 w-full"><StatCards totalEnrolled={enrolledCourses.length} totalMinutes={totalMinutes} streak={streak}/></div>
                        <div className="w-full pb-10"><ContinueLearning courses={filteredCourses} /></div>
                        <div className="w-full pb-10">
                            <Achievements enrolledCourses={enrolledCourses} /> 
                            {/* <UpcomingSessions /> */}
                            
                        </div>
                    </>
                ) : view === "my-courses" ? (
    /* --- MY COURSES VIEW (Hover Effect Fixed) --- */
    <div className="animate-fadeIn w-full">
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-800">My Learning</h2>
            {searchTerm && (
                <p className="text-sm text-[#d4a843] font-semibold">
                    Found {filteredEnrolled.length} results for "{searchTerm}"
                </p>
            )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEnrolled.length > 0 ? (
                filteredEnrolled.map((course) => (
                    <div 
                        key={course._id} 
                        className="bg-white rounded-[25px] p-4 shadow-md border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group cursor-pointer"
                    >
                        {/* Image Container with Zoom Effect */}
                        <div className="overflow-hidden rounded-xl mb-4 h-44 w-full">
                            <img 
                                src={course.image || course.thumbnail || "https://placehold.co/400x250"} 
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                alt={course.title} 
                            />
                        </div>

                        {/* Title with color change on hover */}
                        <h3 className="font-bold text-lg mb-4 group-hover:text-[#d4a843] transition-colors line-clamp-2">
                            {course.title}
                        </h3>

                        {/* Continue Button */}
                        <button 
                            onClick={() => navigate(`/course-player/${course._id}`)} 
                            className="w-full py-3 bg-[#d4a843] text-white rounded-lg font-bold shadow-lg shadow-[#d4a843]/20 hover:bg-[#b88f32] transition-all"
                        >
                            Continue Learning
                        </button>
                    </div>
                ))
            ) : (
                <div className="col-span-full text-center py-20 text-gray-400">
                    No courses match your search. 🔍
                </div>
            )}
        </div>
    </div>
) : view === "progress" ? (
                    /* 🌟 DYNAMIC PROGRESS REPORT VIEW 🌟 */
<div className="animate-fadeIn w-full">
    <h2 className="text-2xl font-bold mb-8 text-gray-800">Learning Progress</h2>
    
    <div className="bg-white p-8 rounded-[35px] shadow-sm border border-gray-100">
        <h4 className="font-bold mb-6 text-gray-500 uppercase text-xs tracking-widest">Course Performance</h4>
        
        <div className="space-y-8">
            {enrolledCourses.length > 0 ? (
                enrolledCourses.map((course) => {
                    // 🌟 Real progress calculate karein (default 0 agar data na ho)
                    const progressValue = course.progress || 0; 
                    
                    return (
                        <div key={course._id} className="group">
                            <div className="flex justify-between mb-2 items-end">
                                <span className="font-bold text-gray-700 group-hover:text-[#d4a843] transition-colors">
                                    {course.title}
                                </span>
                                <span className="text-[#d4a843] font-black text-sm">
                                    {progressValue}%
                                </span>
                            </div>
                            
                            {/* Dynamic Progress Bar */}
                            <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden shadow-inner">
                                <div 
                                    className="bg-gradient-to-r from-[#d4a843] to-[#b88f32] h-full rounded-full transition-all duration-1000 ease-out" 
                                    style={{ width: `${progressValue}%` }} // 🌟 Yahan magic ho raha hai!
                                ></div>
                            </div>
                        </div>
                    );
                })
            ) : (
                <p className="text-center text-gray-400 py-10">No enrolled courses found to track progress.</p>
            )}
        </div>
    </div>
</div>

) : null}

            </div>
        </div>
    </div>
);
}

export default Dashboard;





// import React, { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import Sidebar from '../../components/Sdashboard_components/Sidebar';
// import StatCards from '../../components/Sdashboard_components/StatCards';
// import ContinueLearning from '../../components/Sdashboard_components/ContinueLearning';
// import RecentActivity from '../../components/Sdashboard_components/RecentActivity';
// import Achievements from '../../components/Sdashboard_components/Achievements';
// import UpcomingSessions from '../../components/Sdashboard_components/UpcomingSessions';

// const Dashboard = () => {
//     const navigate = useNavigate();
//     const { user, isAuthenticated } = useSelector((state) => state.auth);
    
//     // --- 1. DYNAMIC STATES ---
//     const [enrolledCourses, setEnrolledCourses] = useState([]);
//     const [loading, setLoading] = useState(true);

//     // --- 2. FETCH REAL DATA ---
//     useEffect(() => {
//         if (!isAuthenticated) {
//             navigate("/login");
//             return;
//         }

//         const fetchDashboardData = async () => {
//             try {
//                 const res = await axios.get("http://localhost:8000/api/course/my-courses", {
//                     withCredentials: true
//                 });
//                 setEnrolledCourses(res.data);
//             } catch (error) {
//                 console.error("Dashboard fetch error", error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchDashboardData();
//     }, [isAuthenticated, navigate]);

//     const handleNotificationClick = () => {
//         alert('You have 3 new notifications!'); 
//     };

//     return (
//         <div className="flex w-full min-h-screen bg-[#F6F4EC] relative overflow-hidden">
            
//             {/* --- SIDEBAR --- */}
//             <div className="w-[280px] hidden lg:block flex-shrink-0">
//                 <Sidebar />
//             </div>
            
//             {/* --- MAIN CONTENT --- */}
//             <div className="flex-1 h-screen overflow-y-auto p-6 md:p-8 pt-[100px] box-border">
//                 <div className="max-w-[1400px] mx-auto">
                
//                     {/* Search & Notification */}
//                     <div className="flex items-center justify-end gap-4 mb-8">
//                         <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-600 min-w-[250px] shadow-sm">
//                             <span>🔍</span>
//                             <input type="text" placeholder="Search courses..." className="outline-none bg-transparent w-full text-gray-800" />
//                         </div>

//                         <div className="w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center cursor-pointer relative hover:border-yellow-500 shadow-sm" onClick={handleNotificationClick}>
//                             <span className="text-lg">🔔</span>
//                             <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
//                         </div>
//                     </div>

//                     {/* Welcome Header */}
//                     <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8 w-full">
//                         <h1 className="text-3xl font-bold text-gray-800">
//                             Welcome back, {user?.name || "Learner"}! 👋
//                         </h1>
//                         <p className="text-gray-500 mt-2">
//                             Ready to continue your journey? You have {enrolledCourses.length} active courses.
//                         </p>
//                     </div>

//                     {/* --- STAT CARDS (Ab ye real number dikhayega) --- */}
//                     <div className="mb-8 w-full">
//                         <StatCards totalEnrolled={enrolledCourses.length} />
//                     </div>

//                     {/* --- GRID SECTION --- */}
//                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full pb-10 mt-8">
                        
//                         {/* Continue Learning (Data pass kar rahe hain) */}
//                         <div className="lg:col-span-2 h-full">
//                             {loading ? (
//                                 <div className="p-10 text-center bg-white rounded-2xl animate-pulse text-gray-400">Loading your courses...</div>
//                             ) : (
//                                 <ContinueLearning courses={enrolledCourses} />
//                             )}
//                         </div>

//                         <div className="lg:col-span-1 h-full">
//                             <RecentActivity />
//                         </div>

//                         <div className="lg:col-span-2 h-full mt-2">
//                             <Achievements />
//                         </div>

//                         <div className="lg:col-span-1 h-full mt-2">
//                             <UpcomingSessions />
//                         </div>

//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Dashboard;




// // src/pages/student/Dashboard.jsx
// // import React from 'react';
// // import Sidebar from '../../components/Sdashboard_components/Sidebar';

// // const Dashboard = () => {
// //   return (
// //     <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#050505' }}>
      
// //       {/* Left side: Aapka naya Sidebar */}
// //       <Sidebar />

// //       {/* Right side: Dashboard ka main content (Cards, charts, etc.) */}
// //       <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        
// //         {/* <h1 style={{ color: 'white' }}>Welcome back, Student!</h1> */}
        
// //         {/* Jo yellow hover wale cards the, wo yahan aayenge */}
// //         <div className="cards-container">
// //            {/* Card components */}
// //         </div>

// //       </div>
// //     </div>
// //   );
// // };

// // export default Dashboard;


// import React, { useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import Sidebar from '../../components/Sdashboard_components/Sidebar';
// // import Topbar from '../../components/Sdashboard_components/Topbar'; // Abhi ke liye hide kiya hai aapke code ke hisaab se
// import StatCards from '../../components/Sdashboard_components/StatCards';
// import ContinueLearning from '../../components/Sdashboard_components/ContinueLearning';
// import RecentActivity from '../../components/Sdashboard_components/RecentActivity';
// import Achievements from '../../components/Sdashboard_components/Achievements';
// import UpcomingSessions from '../../components/Sdashboard_components/UpcomingSessions';

// const Dashboard = () => {
//     const navigate = useNavigate();
    
//     // 1. Redux se user aur auth state nikaalna
//     const { user, isAuthenticated } = useSelector((state) => state.auth);

//     // Notification click handle karne ke liye
//     const handleNotificationClick = () => {
//         alert('You have 3 new notifications!'); 
//     };

//     // 2. Security Check: Agar login nahi hai toh dhakka maar kar login pe bhejo
//     useEffect(() => {
//         if (!isAuthenticated) {
//             navigate("/login");
//         }
//     }, [isAuthenticated, navigate]);

//     return (
//         // MAIN WRAPPER: Flex layout to separate Sidebar and Content
//         <div className="flex w-full h-screen bg-[#F6F4EC] pt-[80px] overflow-hidden box-border">
                
//             {/* --- LEFT COLUMN: Sidebar --- */}
//             {/* flex-shrink-0 ensures sidebar doesn't get squeezed */}
//             <div className="w-[280px] flex-shrink-0 h-[calc(100vh-80px)] overflow-y-auto border-r border-gray-200">
//                 <Sidebar />
//             </div>
            
//             {/* --- RIGHT COLUMN: Main Content --- */}
//             {/* flex-1 takes all remaining width. overflow-y-auto allows only this section to scroll */}
//             <div className="flex-1 h-full overflow-y-auto overflow-x-hidden p-6 md:p-8 box-border">
                
//                 {/* max-w-[1400px] stops content from looking too stretched on massive screens, but gives it plenty of room */}
//                 <div className="max-w-[1400px] mx-auto">
                
//                     {/* --- Search & Notification Section --- */}
//                     <div className="flex items-center justify-end gap-4 mb-8">
//                         {/* Search Box */}
//                         <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-600 min-w-[250px] shadow-sm">
//                             <span>🔍</span>
//                             <input 
//                                 type="text" 
//                                 placeholder="Search courses..." 
//                                 className="outline-none bg-transparent w-full text-gray-800"
//                             />
//                         </div>

//                         {/* Notification Bell */}
//                         <div 
//                             className="w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center cursor-pointer relative transition-all duration-200 hover:border-yellow-500 hover:bg-yellow-50 shadow-sm"
//                             onClick={handleNotificationClick}
//                         >
//                             <span className="text-lg">🔔</span>
//                             {/* Red Dot */}
//                             <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
//                         </div>
//                     </div>

//                     {/* --- Welcome Header Section --- */}
//                     {/* Changed to flex-col lg:flex-row so it wraps nicely on smaller screens */}
//                     <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 w-full">
//                         <div>
//                             <h1 className="text-3xl font-bold text-gray-800">
//                                 Welcome back, {user?.name || "Learner"}! 👋
//                             </h1>
//                             <p className="text-gray-500 mt-2">
//                                 Ready to continue your "SkillLink" journey? Happy learning!
//                             </p>
//                         </div>
//                     </div>

//                     {/* --- Stat Cards --- */}
//                     <div className="mb-8 w-full">
//                         <StatCards />
//                     </div>

//                     {/* --- BOTTOM SECTION (Learning, Activity, Achievements) --- */}
//                         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full pb-10 mt-8">
    
//                                 {/* --- ROW 1 --- */}
//                                 {/* Continue Learning: 2 columns ki jagah lega (66% width) */}
//                                 <div className="lg:col-span-2 h-full">
//                                     <ContinueLearning />
//                                 </div>

//                                 {/* Recent Activity: 1 column ki jagah lega (33% width) */}
//                                 <div className="lg:col-span-1 h-full">
//                                     <RecentActivity />
//                                 </div>

//                                 {/* --- ROW 2 --- */}
//                                 {/* Achievements: 2 columns ki jagah lega (66% width) */}
//                                 <div className="lg:col-span-2 h-full mt-2">
//                                     <Achievements />
//                                 </div>

//                                 {/* Upcoming Sessions: 1 column ki jagah lega (33% width) */}
//                                 <div className="lg:col-span-1 h-full mt-2">
//                                     <UpcomingSessions />
//                                 </div>

//                             </div>
//                     {/* --- Enrolled Courses Section --- */}
//                     {/* <div className="flex items-center justify-between mb-6">
//                         <h2 className="text-xl font-bold text-gray-800">My Enrolled Courses</h2>
//                         <span className="bg-black text-white text-xs px-3 py-1 rounded-full">
//                             {user?.enrolledCourses?.length || 0} Courses
//                         </span>
//                     </div> */}

//                     {/* --- Courses Grid --- */}
//                     {/* Added xl:grid-cols-4 for extra large screens */}
                    

//                 </div>
//             </div>
            
//         </div>
//     );
// };

// export default Dashboard;