// src/components/Sdashboard_components/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import './Sidebar.css'; 
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { BiGridAlt, BiBookOpen, BiCompass, BiStats, BiUserCircle, BiCog, BiLogOut } from "react-icons/bi";
// 🌟 Apne authSlice ka path verify kar lena
import { setIsAuthenticated, setUser } from '../../redux/authSlice'; 

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation(); 
    const dispatch = useDispatch(); // 🌟 Redux dispatch for logout
    const [activeTab, setActiveTab] = useState(location.pathname); 

    // Update active tab when URL changes
    useEffect(() => {
        setActiveTab(location.pathname);
    }, [location]);

    const menuItems = [
        { type: 'item', id: 'Dashboard', icon: <BiGridAlt />, label: 'Dashboard', path: '/student/dashboard' },
        { type: 'item', id: 'My Courses', icon: <BiBookOpen />, label: 'My Courses', path: '/my-courses' }, 
        { type: 'item', id: 'Explore', icon: <BiCompass />, label: 'Explore Catalog', path: '/all-courses' },
        // 🌟 FIX: Added path for Progress Reports
        { type: 'item', id: 'Progress', icon: <BiStats />, label: 'Progress Reports', path: '/student/progress' }, 
        
        { type: 'section', label: 'ACCOUNT' },
        { type: 'item', id: 'Profile', icon: <BiUserCircle />, label: 'My Profile', path: '/my-profile' },
        // 🌟 FIX: Added path for Settings
        { type: 'item', id: 'Settings', icon: <BiCog />, label: 'Settings', path: '/student/settings' }, 
        { type: 'item', id: 'Logout', icon: <BiLogOut />, label: 'Logout' }, 
    ];

    const handleItemClick = async (item) => {
        if (item.id === 'Logout') {
            try {
                // 1. Backend se cookie clear karne ki API (agar aapne backend me logout banaya hai)
                await axios.get("http://localhost:8000/api/user/logout", { withCredentials: true });
            } catch (error) {
                console.error("Logout error", error);
            } finally {
                // 2. Redux state clear karein
                dispatch(setUser(null));
                dispatch(setIsAuthenticated(false));
                
                // 3. Seedha Landing page par bhejein
                navigate('/');
            }
            return;
        }
        
        if (item.path) {
            setActiveTab(item.path); 
            navigate(item.path); 
        }
    };

    return (
        <aside className="db-sidebar">
                      <div 
                  className="font-serif font-extrabold tracking-tight text-[26px] leading-none flex gap-3 pb-8 pt-6 cursor-pointer w-full justify-center"
                  //onClick={() => navigate('/')} 
                  //style={{cursor: 'pointer'}}
              >
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

                    const isActive = activeTab === item.path;

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