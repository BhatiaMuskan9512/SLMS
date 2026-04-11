// src/components/Sdashboard_components/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import './Sidebar.css'; 
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { BiGridAlt, BiBookOpen, BiCompass, BiStats, BiUserCircle, BiCog, BiLogOut } from "react-icons/bi";
import { setIsAuthenticated, setUser } from '../../redux/authSlice'; 

const Sidebar = ({ setView, activeView }) => {
    const navigate = useNavigate();
    const location = useLocation(); 
    const dispatch = useDispatch(); 
    const [activeTab, setActiveTab] = useState(location.pathname); 

    useEffect(() => {
        setActiveTab(location.pathname);
    }, [location]);

    const menuItems = [
        { type: 'item', id: 'Dashboard', icon: <BiGridAlt />, label: 'Dashboard', path: '/student/dashboard' },
        { type: 'item', id: 'My Courses', icon: <BiBookOpen />, label: 'My Courses', path: '/my-courses' }, 
        { type: 'item', id: 'Explore', icon: <BiCompass />, label: 'Explore Catalog', path: '/all-courses' },
        { type: 'item', id: 'Progress', icon: <BiStats />, label: 'Progress Reports', path: '/student/progress' }, 
        
        { type: 'section', label: 'ACCOUNT' },
        { type: 'item', id: 'Profile', icon: <BiUserCircle />, label: 'My Profile', path: '/my-profile' },
        // { type: 'item', id: 'Settings', icon: <BiCog />, label: 'Settings', path: '/student/settings' }, 
        { type: 'item', id: 'Logout', icon: <BiLogOut />, label: 'Logout' }, 
    ];

    const handleItemClick = async (item) => {
    // 1. Logout Logic
    if (item.id === 'Logout') {
        try {
            await axios.get("http://localhost:8000/api/user/logout", { withCredentials: true });
        } catch (error) {
            console.error("Logout error", error);
        } finally {
            dispatch(setUser(null));
            dispatch(setIsAuthenticated(false));
            navigate('/');
        }
        return; // STOP HERE
    } 

    // 2. Dashboard Internal Views (Yahan return lagana zaroori hai)
    if (item.id === 'My Courses') {
        setView("my-courses");
        return; // 🌟 STOP: Ye naye page par jaane se rokega
    } 

    if (item.id === 'Dashboard') {
        setView("dashboard");
        return; // 🌟 STOP
    } 

    if (item.id === 'Progress') {
        setView("progress");
        return; // 🌟 STOP
    }

    // 3. Agar upar mein se koi nahi hai, tabhi navigate karein (Explore, Profile, etc.)
    if (item.path) {
        navigate(item.path);
    }
};

    return (
        <aside className="db-sidebar">
            <div className="font-serif font-extrabold tracking-tight text-[26px] leading-none flex gap-3 pb-8 pt-6 cursor-pointer w-full justify-center">
                <span className="text-white">Skill</span><span className="text-[#d4a843] font-medium ml-1">Link</span>
            </div>

            <nav className="db-nav">
                {menuItems.map((item, index) => {
                    if (item.type === 'section') {
                        return (
                            <div key={index} className="db-nav-section">
                                {item.label}
                            </div>
                        );
                    }

                    // Active state logic for 'Dashboard' and 'My Courses'
                    // Sidebar.jsx ke andar .map() ke andar ye badlav karein
                    // isActive logic ko replace karein:
                 const isActive = (item.id === 'Dashboard' && activeView === 'dashboard') || 
                 (item.id === 'My Courses' && activeView === 'my-courses') ||
                 (item.id === 'Progress' && activeView === 'progress');
// 🌟 Tip: Agar activeView 'my-courses' hai, toh Dashboard item 'active' class nahi lega.

                    return (
                        <div
                            key={item.id}
                            className={`db-nav-item ${isActive ? 'active' : ''}`}
                            onClick={() => handleItemClick(item)}
                        >
                            <span className="ni">{item.icon}</span> {item.label}
                        </div>
                    );
                })}
            </nav>
        </aside>
    );
};

export default Sidebar;




// import React, { useState } from 'react';
// import './Sidebar.css'; 
// import { useNavigate, useLocation } from 'react-router-dom';
// import { BiGridAlt, BiBookOpen, BiCompass, BiStats, BiPlayCircle, BiFile, BiAward, BiCalendarEvent, BiUser, BiCog, BiLogOut } from "react-icons/bi"; // ✅ Better Icons

// const Sidebar = () => {
//     const navigate = useNavigate();
//     const location = useLocation(); // ✅ Current Page path track karne ke liye
//     const [activeTab, setActiveTab] = useState(location.pathname); // ✅ Automatically sets active tab based on URL

//     const menuItems = [
//         { type: 'item', id: 'Dashboard', icon: <BiGridAlt />, label: 'Dashboard', path: '/student/dashboard' },
//         { type: 'item', id: 'My Courses', icon: <BiBookOpen />, label: 'My Courses', path: '/my-courses' }, 
//         { type: 'item', id: 'Explore', icon: <BiCompass />, label: 'Explore', path: '/all-courses' },
//         { type: 'item', id: 'Progress', icon: <BiStats />, label: 'Progress' },
        
//         { type: 'section', label: 'LEARN' },
//         { type: 'item', id: 'Continue Learning', icon: <BiPlayCircle />, label: 'Continue Learning', path: '/my-courses' },
//         { type: 'item', id: 'Assignments', icon: <BiFile />, label: 'Assignments' },
//         { type: 'item', id: 'Certificates', icon: <BiAward />, label: 'Certificates' },
//         { type: 'item', id: 'Schedule', icon: <BiCalendarEvent />, label: 'Schedule' },
        
//         { type: 'section', label: 'ACCOUNT' },
//         { type: 'item', id: 'Profile', icon: <BiUser />, label: 'My Profile', path: '/my-profile' },
//         { type: 'item', id: 'Settings', icon: <BiCog />, label: 'Settings' },
//         { type: 'item', id: 'Logout', icon: <BiLogOut />, label: 'Logout' }, 
//     ];

//     const handleItemClick = (item) => {
//         if (item.id === 'Logout') {
//             alert("Logging out...");
//             navigate('/login');
//             return;
//         }
//         if (item.path) {
//             setActiveTab(item.path); // Update local active state
//             navigate(item.path); 
//         }
//     };

//     return (
//         <aside className="db-sidebar">
//             {/* 🌟 LOGO SECTION FIXED: Exact SkillLink Logo */}
//             <div className="db-logo">
//                 Skill<span className="brand-yellow">Link</span>
//             </div>

//             {/* Navigation Section */}
//             <nav className="db-nav">
//                 {menuItems.map((item, index) => {
//                     if (item.type === 'section') {
//                         return (
//                             <div key={index} className="db-nav-section">
//                                 {item.label}
//                             </div>
//                         );
//                     }

//                     // Check if this item is currently active (based on ID or Path)
//                     const isActive = activeTab === item.path || activeTab === item.id;

//                     return (
//                         <div
//                             key={item.id}
//                             className={`db-nav-item ${isActive ? 'active' : ''}`}
//                             onClick={() => handleItemClick(item)}
//                         >
//                             <span className="ni">{item.icon}</span> {item.label}
//                         </div>
//                     );
//                 })}
//             </nav>
//         </aside>
//     );
// };

// export default Sidebar;



// import React, { useState } from 'react';
// import './Sidebar.css'; 
// import { useNavigate } from 'react-router-dom';

// const Sidebar = () => {
//   const [activeTab, setActiveTab] = useState('Dashboard');
//   const navigate = useNavigate();

//   const menuItems = [
//     { type: 'item', id: 'Dashboard', icon: '🏠', label: 'Dashboard', path: '/student/dashboard' }, 
//     // 🌟 Yahan My Courses ka path theek kiya hai
//     { type: 'item', id: 'My Courses', icon: '📚', label: 'My Courses', path: '/my-courses' }, 
//     { type: 'item', id: 'Explore', icon: '🔍', label: 'Explore', path: '/all-courses' },
//     { type: 'item', id: 'Progress', icon: '📊', label: 'Progress' },
    
//     { type: 'section', label: 'LEARN' },
//     { type: 'item', id: 'Continue Learning', icon: '▶️', label: 'Continue Learning', path: '/my-courses' },
//     { type: 'item', id: 'Assignments', icon: '📝', label: 'Assignments' },
//     { type: 'item', id: 'Certificates', icon: '🏆', label: 'Certificates' },
    
//     { type: 'section', label: 'ACCOUNT' },
//     { type: 'item', id: 'Profile', icon: '👤', label: 'My Profile', path: '/my-profile' },
//     { type: 'item', id: 'Settings', icon: '⚙️', label: 'Settings' },
//     // 🌟 Logout option zaroori hai
//     { type: 'item', id: 'Logout', icon: '🚪', label: 'Logout' }, 
//   ];

//   // Click handle karne ka function
//   const handleItemClick = (item) => {
//     setActiveTab(item.id); 
    
//     // Agar Logout click kiya hai toh...
//     if (item.id === 'Logout') {
//         // Yahan aap apna logout logic (Redux reset + navigate to login) daal sakti hain
//         alert("Logging out...");
//         navigate('/login');
//         return;
//     }

//     if (item.path) {
//       navigate(item.path); 
//     }
//   };

//   return (
//     <div className="db-wrap">
//       <aside className="db-sidebar">
//         {/* Logo Section */}
//         <div className="db-logo">
//           Edu<span className="brand-yellow">Nova</span>
//         </div>

//         {/* Navigation Section */}
//         <nav className="db-nav">
//           {menuItems.map((item, index) => {
//             if (item.type === 'section') {
//               return (
//                 <div key={index} className="db-nav-section">
//                   {item.label}
//                 </div>
//               );
//             }

//             return (
//               <div
//                 key={item.id}
//                 className={`db-nav-item ${activeTab === item.id ? 'active' : ''}`}
//                 // 🌟 FIX 2: Yahan setActiveTab ki jagah handleItemClick(item) laga diya
//                 onClick={() => handleItemClick(item)}
//               >
//                 <span className="ni">{item.icon}</span> {item.label}
//               </div>
//             );
//           })}
//         </nav>

//         {/* Optional Footer */}
//         <div className="db-sidebar-foot">
//         </div>
//       </aside>
//     </div>
//   );
// };

// export default Sidebar;