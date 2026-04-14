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
         { type: 'item', id: 'Assignments', icon: <BiBookOpen />, label: 'Assignments', path: '/student/assignments' },
        // { type: 'section', label: 'ACCOUNT' },
        { type: 'spacer' },
        { type: 'item', id: 'Profile', icon: <BiUserCircle />, label: 'My Profile', path: '/my-profile' },
        // { type: 'item', id: 'Settings', icon: <BiCog />, label: 'Settings', path: '/student/settings' }, 
        { type: 'item', id: 'Logout', icon: <BiLogOut />, label: 'Logout' }, 
    ];

    const handleItemClick = async (item) => {
    // 1. Logout Logic
    if (item.id === 'Logout') {
        try {
            await axios.get("http://localhost:8000/api/auth/log-out", { withCredentials: true });
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
    if (item.id === 'Assignments') {
    navigate('/student/assignments');
    return;
    }
    
    // 3. Agar upar mein se koi nahi hai, tabhi navigate karein (Explore, Profile, etc.)
    if (item.path) {
        navigate(item.path);
    }
};

    return (
        <aside className="db-sidebar">
            <div className="font-serif font-extrabold tracking-tight text-[26px] leading-none flex gap-3 pb-8 pt-6 cursor-pointer w-full justify-center">
                {/* <span className="text-white">Skill</span><span className="text-[#d4a843] font-medium ml-1">Link</span> */}
                <span className="text-[24px] font-medium text-white">Skill<span className="text-[#E8C97A]">Link</span></span>
            </div>

            <nav className="db-nav" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {menuItems.map((item, index) => {
                    if (item.type === 'section') {
                        return (
                            <div key={index} className="db-nav-section">
                                {item.label}
                            </div>
                        );
                    }

                    if (item.type === 'spacer') {
                          return <div key={index} style={{ flexGrow: 1 }} />;
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