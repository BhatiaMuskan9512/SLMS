import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  UserRound, 
  LogOut 
} from 'lucide-react';
import './Sidebar.css';
import { logoutUser } from '../../../src/redux/authSlice';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const handleLogout = async () => {
        try {
            const res = await axios.get("http://localhost:8000/api/auth/log-out", {
                withCredentials: true 
            });

            if (res.data.success) {
                dispatch(logoutUser());
                localStorage.clear();
                toast.success(res.data.message || "Logged out successfully");
        
                navigate("/login");
            }
        } catch (error) {
            console.log(error);
            toast.error("Logout failed!");
        }
    };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'students', label: 'Students', icon: <Users size={20} /> },
    { id: 'courses', label: 'Courses', icon: <BookOpen size={20} /> },
    { id: 'instructors', label: 'Instructors', icon: <UserRound size={20} /> },
  ];

  return (
    <div className="lms-sidebar">
      {/* Logo Section */}
      <div className="sidebar-logo">
        <span className="logo-white">Skill</span>
        <span className="logo-gold"> Link</span>
      </div>

      {/* Menu Items (Top Section) */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </div>
        ))}
      </nav>

      {/* Bottom Section (Fixed at Bottom) */}
      <div className="sidebar-footer">
        {/* Profile Link */}
        <div 
          className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => navigate('/my-profile')}
        >
          <span className="nav-icon"><UserRound size={20} /></span>
          <span className="nav-label">My Profile</span>
        </div>

        {/* Logout Button */}
        <div className="nav-item logout-item">
          <button className="logout-btn-inner" onClick={handleLogout}>
            <span className="nav-icon"><LogOut size={20} /></span>
            <span className="nav-label">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;