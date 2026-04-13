import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/Adashboard_components/sidebar';
import DashboardContent from '../../components/Adashboard_components/DashboardContent';
import StudentManagement from '../../components/Adashboard_components/StudentManagement';
import CourseManagement from '../../components/Adashboard_components/CourseManagement';
import InstructorManagement from '../../components/Adashboard_components/InstructorManagement';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F6F4EC' }}>
      
      {/* 1. Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div style={{ 
        marginLeft: '260px', 
        flexGrow: 1, 
        padding: '10px 40px', /* Top padding kam ki hai */
        transition: '0.3s' 
      }}>
        
        <div className="dynamic-content-wrapper">
           
           {activeTab === 'dashboard' ? (
             <>
               {/* 🌟 Header & Top Bar - Ab ye ek hi row mein aayenge space bachane ke liye */}
               <div style={{ 
                   display: 'flex', 
                   justifyContent: 'space-between', 
                   alignItems: 'flex-start', /* Items ko top se align kiya */
                   marginBottom: '20px', 
                   marginTop: '10px' 
               }}>
                 
                 
                 {/* Welcome Text - Ab ye ek bada professional box ban jayega */}
                

                 {/* Search & Notification - Ye top-right mein shift ho gaya */}
                 {/* <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 min-w-[280px] shadow-sm focus-within:border-[#d4a843]">
                        <span>🔍</span>
                        <input 
                            type="text" 
                            placeholder="Search courses..." 
                            className="outline-none bg-transparent w-full text-gray-800"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="w-11 h-11 rounded-2xl border border-gray-200 bg-white flex items-center justify-center cursor-pointer relative shadow-sm hover:border-[#d4a843]/30 transition-all">
                        <span className="text-xl">🔔</span>
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </div>
                 </div> */}
               </div>

               {/* Dashboard Charts/Cards */}
               <DashboardContent 
                 activeTab={activeTab} 
                 searchTerm={searchTerm} 
                 setSearchTerm={setSearchTerm} 
                 user = {user}
               />
             </>
           ) : (
             /* Students Tab ya Coming Soon Pages - Inme Search bar nahi dikhega */
             <div style={{ marginTop: '20px' }}>
                {activeTab === 'students' ? (
                  <StudentManagement />
                ) : activeTab === 'courses' ? (
                  <CourseManagement/>
                ): activeTab === 'instructors' ?(
                    <InstructorManagement/>
                ):(
                  <div style={{ 
                      textAlign: 'center', 
                      paddingTop: '80px',
                      backgroundColor: '#fff',
                      padding: '60px',
                      borderRadius: '24px',
                      minHeight: '60vh'
                  }}>
                     <h1 style={{ fontSize: '3rem', color: '#E5B95F', fontWeight: 'bold' }}>Coming Soon...</h1>
                     <p style={{ color: '#888' }}>Working on <b>{activeTab}</b> section!</p>
                  </div>
                )}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;