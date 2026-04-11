import React from 'react';

const Achievements = ({ enrolledCourses }) => {
    // 🌟 DYNAMIC LOGIC: Enrolled courses ke hisaab se badges unlock honge
   const categoryBadges = {
    "UI/UX Design": { icon: "🎨", title: "Creative Soul" }, 
    "Web Development": { icon: "🌐", title: "Web Architect" },
    "AI & ML": { icon: "🤖", title: "Future Thinker" }, // Check karein database mein yahi spelling hai?
    "Programming": { icon: "💻", title: "Code Ninja" },
    "Default": { icon: "📚", title: "Learner" }
};

  
    return (
        <div className="bg-white p-6 rounded-[30px] shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-[#0a0b0f] tracking-tight mb-8">Your Skill Badges</h2>
            
            <div className="grid grid-cols-3 gap-4">
                {enrolledCourses?.length > 0 ? (
                    enrolledCourses.slice(0, 6).map((course) => {

                        // Achievements.jsx mein render ke andar ye change karein
                            const badge = categoryBadges[course.category] || 
                            categoryBadges[Object.keys(categoryBadges).find(key => key.toLowerCase() === course.category?.toLowerCase())] || 
                            categoryBadges["Default"];
 
                        // // Category ke base par badge uthao, warna default
                        // const badge = categoryBadges[course.category] || categoryBadges["Default"];
                        
                       return (
    <div 
        key={course._id} 
        className="group flex flex-col items-center p-4 rounded-2xl border border-transparent hover:border-[#d4a843]/30 hover:bg-[#FFFDF5] transition-all duration-300 cursor-default"
    >
        {/* Badge Icon Container */}
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-3xl mb-3 shadow-inner border border-gray-100 group-hover:scale-110 group-hover:shadow-md group-hover:bg-white transition-all duration-300">
            {badge.icon}
        </div>

        {/* Badge Title */}
        <span className="text-[11px] font-black text-gray-800 text-center uppercase tracking-[0.1em] text-center uppercase tracking-wider group-hover:text-[#d4a843] transition-colors">
            {badge.title}
        </span>

        {/* Course Name (Sub-text) */}
        <span className="text-[9px] text-gray-500 text-center mt-1 font-semibold opacity-70 text-center mt-1 font-medium group-hover:text-gray-600">
            {course.title.substring(0, 15)}...
        </span>
    </div>
);
                    })
                ) : (
                    <p className="col-span-3 text-center text-gray-400 text-sm">Enroll in a course to earn badges!</p>
                )}
            </div>
        </div>
    );
};

export default Achievements;






// import React from 'react';

// const Achievements = ({ enrolledCount = 0 }) => {
//     // 🌟 DYNAMIC LOGIC: Enrolled courses ke hisaab se badges unlock honge
//     const badges = [
//         { id: 1, title: 'First Step', icon: '🥇', unlocked: enrolledCount > 0 }, // Unlock if enrolled in at least 1 course
//         { id: 2, title: 'SQL Expert', icon: '🗄️', unlocked: false }, // Abhi locked hain
//         { id: 3, title: 'Week Warrior', icon: '🔥', unlocked: false },
//         { id: 4, title: 'Night Owl', icon: '🦉', unlocked: false },
//         { id: 5, title: 'Speed Learner', icon: '⚡', unlocked: false },
//         { id: 6, title: 'Top Rated', icon: '⭐', unlocked: false },
//     ];

//     return (
//         <div className="bg-white p-8 rounded-[30px] shadow-sm border border-gray-100 h-full">
//             <div className="flex justify-between items-center mb-8">
//                 <h2 className="text-xl font-bold text-gray-800">Achievements</h2>
//                 <span className="text-sm font-bold text-[#d4a843] cursor-pointer hover:underline transition-all">See all →</span>
//             </div>

//             <div className="grid grid-cols-3 gap-y-8 gap-x-4">
//                 {badges.map((badge) => (
//                     <div key={badge.id} className="flex flex-col items-center text-center group cursor-pointer">
//                         {/* Grayscale aur opacity logic yahan hai */}
//                         <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-3 transition-all duration-300
//                             ${badge.unlocked 
//                                 ? 'bg-[#FFFDF5] shadow-[0_5px_15px_rgba(212,168,67,0.2)] group-hover:scale-110' 
//                                 : 'bg-gray-50 grayscale opacity-40'}
//                         `}>
//                             {badge.icon}
//                         </div>
//                         <p className={`text-xs font-bold ${badge.unlocked ? 'text-gray-800' : 'text-gray-400'}`}>
//                             {badge.title}
//                         </p>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default Achievements;






// import React from 'react';

// const Achievements = () => {
//     // Achievements ka data array
//     const badgesData = [
//         // Unlocked Badges
//         { id: 1, icon: '🥇', name: 'First Step', message: 'First Step: Completed your first lesson!', isLocked: false },
//         { id: 2, icon: '🗄️', name: 'SQL Expert', message: 'SQL Expert: Completed SQL course!', isLocked: false },
//         { id: 3, icon: '🔥', name: 'Week Warrior', message: 'Week Warrior: 7-day study streak!', isLocked: false },
//         { id: 4, icon: '🦉', name: 'Night Owl', message: 'Night Owl: Studied after midnight!', isLocked: false },
        
//         // Locked Badges (unlocked nahi huye hain)
//         { id: 5, icon: '⚡', name: 'Speed Learner', message: 'Speed Learner: Locked — finish a course in under 7 days', isLocked: true },
//         { id: 6, icon: '⭐', name: 'Top Rated', message: 'Top Rated: Locked — get 100 upvotes on answers', isLocked: true },
//         { id: 7, icon: '🤝', name: 'Mentor', message: 'Mentor: Locked — help 10 learners', isLocked: true },
//         { id: 8, icon: '👑', name: 'Legend', message: 'Legend: Locked — complete 10 courses', isLocked: true },
//     ];

//     const handleBadgeClick = (message) => {
//         alert(message);
//         // Yahan par custom Toast lagaya ja sakta hai future me
//     };

//     return (
//         <div className="bg-white rounded-[24px] border border-black/5 p-2.5 shadow-sm h-full">
            
//             {/* Header */}
//             <div className="flex items-center justify-between px-5 py-4">
//                 <span className="text-[15px] font-bold text-[#0a0b0f]">
//                     Achievements
//                 </span>
//                 <button 
//                     onClick={() => alert("Opening all achievements...")}
//                     className="text-[13px] text-[#d4a843] cursor-pointer font-medium hover:underline focus:outline-none"
//                 >
//                     See all →
//                 </button>
//             </div>

//             {/* Badges Grid */}
//             {/* 4 columns layout, margin/padding adjusted to match image */}
//             <div className="grid grid-cols-4 gap-6 px-7 pt-4 pb-10">
//                 {badgesData.map((badge) => (
//                     <div 
//                         key={badge.id}
//                         onClick={() => handleBadgeClick(badge.message)}
//                         // Agar locked hai toh pura item 40% opaque dikhega
//                         className={`text-center cursor-pointer transition-transform duration-200 hover:scale-[1.08] ${
//                             badge.isLocked ? 'opacity-40' : 'opacity-100'
//                         }`}
//                     >
//                         {/* Icon Circle */}
//                         {/* Background color aapke image wale 'cream2' jaisa rakha hai */}
//                         <div 
//                             className={`mx-auto text-[32px] w-[70px] h-[70px] bg-[#f2efe6] rounded-full flex items-center justify-center border border-transparent transition-colors hover:border-[#d4a843] ${
//                                 badge.isLocked ? 'grayscale' : 'grayscale-0'
//                             }`}
//                         >
//                             {badge.icon}
//                         </div>
                        
//                         {/* Badge Name */}
//                         <div className="text-[11px] text-[#4a4c58] font-medium mt-3">
//                             {badge.name}
//                         </div>
//                     </div>
//                 ))}
//             </div>

//         </div>
//     );
// };

// export default Achievements;