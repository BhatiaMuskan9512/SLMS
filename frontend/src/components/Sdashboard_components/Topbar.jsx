import React, { useState, useEffect } from 'react';
import './Topbar.css'; // Apni CSS file ka path check kar lijiye

const Topbar = ({ name = "Ankita", pendingLessons = 3 }) => {
  const [greeting, setGreeting] = useState('');

  // Current time ke hisaab se dynamically greeting set karne ka logic
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good morning');
    } else if (hour < 18) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }
  }, []);

  // Notification click handle karne ke liye
  const handleNotificationClick = () => {
    alert('You have 3 new notifications!'); 
    // Yahan aap apna custom Toast function call kar sakti hain aage chal kar
  };

  return (
    <div className="db-topbar">
      
      {/* Greeting Section */}
      <div className="db-greeting">
        <h2>{greeting}, <em>{name}</em> 👋</h2>
        <p>You have {pendingLessons} lessons pending today. Keep it up!</p>
      </div>

      {/* Search and Actions Section */}
      <div className="db-topbar-actions">
        
        <div className="db-search">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="Search courses..." />
        </div>

        <div className="db-notif" onClick={handleNotificationClick}>
          🔔<span className="db-notif-dot"></span>
        </div>

      </div>
      
    </div>
  );
};

export default Topbar;