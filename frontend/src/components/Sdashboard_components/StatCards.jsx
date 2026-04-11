// src/components/Sdashboard_components/StatCards.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const StatCards = ({ totalEnrolled, totalMinutes, streak }) => {
    const navigate = useNavigate();

    // Time calculation
    const hours = Math.floor((totalMinutes || 0) / 60);
    const mins = (totalMinutes || 0) % 60;
    const timeDisplay = `${hours}h ${mins}m`;

    const statsData = [
        {
            id: 1,
            icon: "📚",
            iconBg: "bg-[#3ECFC6]/15",
            badgeText: "+1 new",
            badgeStyle: "bg-green-50 text-green-700", 
            value: totalEnrolled || "0", 
            label: "Courses Enrolled"
        },
        { 
            id: 2, 
            icon: "⏱️", 
            iconBg: "bg-[#d4a843]/15", 
            badgeText: "Learning Time", 
            badgeStyle: "bg-amber-50 text-amber-700", 
            value: timeDisplay, // ✅ Real dynamic value
            label: "Hours Learned" 
        },
        // { id: 3, icon: "🏆", iconBg: "bg-blue-50", badgeText: "New!", badgeStyle: "bg-blue-50 text-blue-600", value: "2", label: "Certificates Earned" },
        { id: 4, 
    icon: "🔥", 
    iconBg: "bg-orange-50", 
    badgeText: "On fire!", 
    badgeStyle: "bg-red-50 text-red-600", 
    value: streak || "0", // 👈 Agar streak na ho toh 0 dikhaye
    label: "Day Streak"}
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[30px]">
            {statsData.map((stat) => (
                <div 
                    key={stat.id} 
                    onClick={() => stat.id === 1 && navigate('/my-courses')}
                    className={`bg-white rounded-[24px] p-8 border border-gray-100 shadow-sm transition-all duration-300 
                               hover:scale-[1.02] hover:bg-[#FFFDF5] hover:border-[#d4a843]/20 
                               hover:shadow-[0_15px_40px_rgba(0,0,0,0.03)] 
                               ${stat.id === 1 ? 'cursor-pointer' : 'cursor-default'}`}
                >
                    <div className="flex items-center justify-between mb-5">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${stat.iconBg}`}>
                            {stat.icon}
                        </div>
                        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-md ${stat.badgeStyle}`}>
                            {stat.badgeText}
                        </span>
                    </div>

                    <div className="text-[34px] font-extrabold text-[#0a0b0f] leading-none tracking-tight">
                        {stat.value}
                    </div>
                    <div className="text-xs text-gray-400 mt-2 tracking-wide font-medium">
                        {stat.label}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatCards;




// import React from 'react';

// const StatCards = ({ totalEnrolled }) => {
//     // 1. Data Array: Yahan aap baad me backend (Redux) ka data bhi link kar sakti hain
//     const statsData = [
//         {
//             id: 1,
//             icon: "📚",
//             iconBg: "bg-[#3ECFC6]/15", // Teal background
//             badgeText: "+2 new",
//             badgeStyle: "bg-[#e8f8f0] text-[#1a7a50]", // badge-up
//             value: totalEnrolled || "0",
//             label: "Courses Enrolled"
//         },
//         {
//             id: 2,
//             icon: "⏱️",
//             iconBg: "bg-[#D4A843]/15", // Gold background
//             badgeText: "↑ 12%",
//             badgeStyle: "bg-[#e8f8f0] text-[#1a7a50]", // badge-up
//             value: "38",
//             label: "Hours Learned"
//         },
//         {
//             id: 3,
//             icon: "🏆",
//             iconBg: "bg-[#A78BFA]/15", // Purple background
//             badgeText: "New!",
//             badgeStyle: "bg-[#fdf0cc] text-[#8a5a00]", // badge-new
//             value: "2",
//             label: "Certificates Earned"
//         },
//         {
//             id: 4,
//             icon: "🔥",
//             iconBg: "bg-[#F26A5E]/15", // Coral background
//             badgeText: "On fire!",
//             badgeStyle: "bg-[#e8f8f0] text-[#1a7a50]", // badge-up
//             value: "7",
//             label: "Day Streak"
//         }
//     ];

//     return (
//         // Grid Layout: Mobile me 1 column, tablet me 2, aur desktop me 4 columns
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[30px] mb-12">
            
//             {statsData.map((stat) => (
//                 <div 
//                     key={stat.id} 
//                     className="bg-white rounded-[20px] p-[35px_30px] border border-[#D4A843]/15 shadow-[0_15px_35px_rgba(0,0,0,0.05)] transition-all duration-300 hover:scale-[1.02] hover:bg-[#FFFDF5] hover:border-[#FFD700] hover:shadow-[0_5px_15px_rgba(0,0,0,0.05)] cursor-pointer"
//                 >
//                     {/* Top Section: Icon & Badge */}
//                     <div className="flex items-center justify-between mb-3.5">
//                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${stat.iconBg}`}>
//                             {stat.icon}
//                         </div>
//                         <span className={`text-[11px] font-semibold px-2 py-1 rounded-md ${stat.badgeStyle}`}>
//                             {stat.badgeText}
//                         </span>
//                     </div>

//                     {/* Bottom Section: Number & Label */}
//                     <div className="font-['Cormorant_Garamond'] text-[32px] font-bold text-[#0a0b0f] leading-none mt-4">
//                         {stat.value}
//                     </div>
//                     <div className="text-[12px] text-[#8a8c98] mt-1.5 tracking-wide">
//                         {stat.label}
//                     </div>
//                 </div>
//             ))}

//         </div>
//     );
// };

// export default StatCards;