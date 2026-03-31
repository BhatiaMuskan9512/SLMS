// src/components/Sdashboard_components/Topbar.jsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const Topbar = ({ searchTerm, setSearchTerm }) => {
    const { user } = useSelector((state) => state.auth);
    //const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    return (
        <div className="fixed top-0 right-0 left-[280px] h-[80px] bg-[#F6F4EC]/80 backdrop-blur-md z-[50] flex items-center justify-between px-8 border-b border-gray-100">
            
            {/* --- SEARCH BAR --- */}
            <div className="flex-1 max-w-[400px] flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-5 py-2.5 shadow-sm focus-within:border-[#d4a843] transition-all">
                <span className="text-gray-400">🔍</span>
                <input 
                    type="text" 
                    value={searchTerm}
                    // 🌟 onChange par parent (Dashboard) ka function call hoga
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    placeholder="Search courses..." 
                    className="outline-none bg-transparent w-full text-sm text-gray-800"
                />
            </div>

            {/* RIGHT SIDE: NOTIFICATION & PROFILE */}
            <div className="flex items-center gap-5">
                {/* 🌟 DYNAMIC NOTIFICATION BELL */}
                <div className="relative group cursor-pointer w-11 h-11 bg-white rounded-xl flex items-center justify-center border border-gray-100 shadow-sm hover:border-[#d4a843]/30 transition-all">
                    <span className="text-xl">🔔</span>
                    {/* Red Dot - Baad mein backend notifications length se link karenge */}
                    <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                </div>

                {/* USER PROFILE INFO */}
                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-bold text-gray-800 leading-none">{user?.name}</p>
                        <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-wider">Student</p>
                    </div>
                    <img 
                        src={user?.photo || "https://ui-avatars.com/api/?name=" + user?.name} 
                        className="w-11 h-11 rounded-xl object-cover border-2 border-white shadow-sm"
                        alt="Profile"
                    />
                </div>
            </div>
        </div>
    );
};

export default Topbar;



// import React, { useState, useEffect } from 'react';
// import './Topbar.css'; // Apni CSS file ka path check kar lijiye

// const Topbar = ({ name = "Ankita", pendingLessons = 3 }) => {
//   const [greeting, setGreeting] = useState('');

//   // Current time ke hisaab se dynamically greeting set karne ka logic
//   useEffect(() => {
//     const hour = new Date().getHours();
//     if (hour < 12) {
//       setGreeting('Good morning');
//     } else if (hour < 18) {
//       setGreeting('Good afternoon');
//     } else {
//       setGreeting('Good evening');
//     }
//   }, []);

//   // Notification click handle karne ke liye
//   const handleNotificationClick = () => {
//     alert('You have 3 new notifications!'); 
//     // Yahan aap apna custom Toast function call kar sakti hain aage chal kar
//   };

//   return (
//     <div className="db-topbar">
      
//       {/* Greeting Section */}
//       <div className="db-greeting">
//         <h2>{greeting}, <em>{name}</em> 👋</h2>
//         <p>You have {pendingLessons} lessons pending today. Keep it up!</p>
//       </div>

//       {/* Search and Actions Section */}
//       <div className="db-topbar-actions">
        
//         <div className="db-search">
//           <span className="search-icon">🔍</span>
//           <input type="text" placeholder="Search courses..." />
//         </div>

//         <div className="db-notif" onClick={handleNotificationClick}>
//           🔔<span className="db-notif-dot"></span>
//         </div>

//       </div>
      
//     </div>
//   );
// };

// export default Topbar;