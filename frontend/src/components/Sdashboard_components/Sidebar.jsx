import React, { useState } from 'react';
import './Sidebar.css'; 
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const navigate = useNavigate();

  const menuItems = [
    { type: 'item', id: 'Dashboard', icon: '🏠', label: 'Dashboard' },
    // 🌟 FIX 1: 'Path' ko 'path' (small p) kar diya
    { type: 'item', id: 'My Courses', icon: '📚', label: 'My Courses', path: '/all-courses' }, 
    { type: 'item', id: 'Explore', icon: '🔍', label: 'Explore', path: '/all-courses' },
    { type: 'item', id: 'Progress', icon: '📊', label: 'Progress' },
    { type: 'section', label: 'LEARN' },
    { type: 'item', id: 'Continue Learning', icon: '▶️', label: 'Continue Learning' },
    { type: 'item', id: 'Assignments', icon: '📝', label: 'Assignments' },
    { type: 'item', id: 'Certificates', icon: '🏆', label: 'Certificates' },
    { type: 'item', id: 'Schedule', icon: '🗓️', label: 'Schedule' },
    { type: 'section', label: 'ACCOUNT' },
    { type: 'item', id: 'Settings', icon: '⚙️', label: 'Settings' },
    { type: 'item', id: 'Support', icon: '💬', label: 'Support' },
  ];

  // Click handle karne ka function
  const handleItemClick = (item) => {
    setActiveTab(item.id); 
    
    // Yahan check kar raha hai ki path hai ya nahi
    if (item.path) {
      navigate(item.path); 
    }
  };

  return (
    <div className="db-wrap">
      <aside className="db-sidebar">
        {/* Logo Section */}
        <div className="db-logo">
          Edu<span className="brand-yellow">Nova</span>
        </div>

        {/* Navigation Section */}
        <nav className="db-nav">
          {menuItems.map((item, index) => {
            if (item.type === 'section') {
              return (
                <div key={index} className="db-nav-section">
                  {item.label}
                </div>
              );
            }

            return (
              <div
                key={item.id}
                className={`db-nav-item ${activeTab === item.id ? 'active' : ''}`}
                // 🌟 FIX 2: Yahan setActiveTab ki jagah handleItemClick(item) laga diya
                onClick={() => handleItemClick(item)}
              >
                <span className="ni">{item.icon}</span> {item.label}
              </div>
            );
          })}
        </nav>

        {/* Optional Footer */}
        <div className="db-sidebar-foot">
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;