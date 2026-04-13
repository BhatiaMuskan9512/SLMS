import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  UserRound, 
  ClipboardList, 
  BarChart3, 
  Settings, 
  LogOut 
} from 'lucide-react';
import './Sidebar.css';


const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'students', label: 'Students', icon: <Users size={20} /> },
    { id: 'courses', label: 'Courses', icon: <BookOpen size={20} /> },
    { id: 'instructors', label: 'Instructors', icon: <UserRound size={20} /> },
    { id: 'assignments', label: 'Assignments', icon: <ClipboardList size={20} /> }, 
  ];

  return (
    <div className="lms-sidebar">
      {/* Logo Section */}
      <div className="sidebar-logo">
        <span className="logo-white">Skill</span>
        <span className="logo-gold"> Link</span>
      </div>

      {/* Menu Items */}
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

      {/* Bottom Section */}
      <div className="sidebar-footer">
        
        
        {/* Profile Link */}
        <div 
          className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <span className="nav-icon"><UserRound size={20} /></span>
          <span className="nav-label">My Profile</span>
        </div>

        <div>
        <button className="logout-btn">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;