import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, Edit2, Trash2, Plus, Mail, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

const InstructorManagement = () => {
  const [instructors, setInstructors] = useState([]);
  const [coursesList, setCoursesList] = useState([]); // 🌟 Dynamic Courses State
  const [courseFilter, setCourseFilter] = useState("All Courses");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  
  const [currentPage, setCurrentPage] = useState(1);
  const instructorsPerPage = 6; // Ek page par kitne instructors dikhane hain (Aap 8 bhi rakh sakti hain)
  
  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        // Backend se instructors ka data lana
        const res = await axios.get("http://localhost:8000/api/user/instructors-count");
        if (res.data.success) {
          setInstructors(res.data.instructors);
        }

        // 2. 🌟 Dynamic Courses Fetch (Count aur List dono controller se)
        const courseRes = await axios.get("http://localhost:8000/api/course/count-all");
        if (courseRes.data.success) {
          setCoursesList(courseRes.data.courses || []);
        }
      } catch (error) {
        console.error("Error fetching instructors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInstructors();
  }, []);

  // Filter Logic
  const filteredInstructors = instructors.filter(inst => 
    inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inst.email.toLowerCase().includes(searchTerm.toLowerCase())
  );


  // 🌟 Pagination Calculation
const indexOfLastInstructor = currentPage * instructorsPerPage;
const indexOfFirstInstructor = indexOfLastInstructor - instructorsPerPage;

// Ab mapping ke liye 'currentInstructors' use karenge
const currentInstructors = filteredInstructors.slice(indexOfFirstInstructor, indexOfLastInstructor);

// Total pages count
const totalPages = Math.ceil(filteredInstructors.length / instructorsPerPage);

// Filter ya Search badalne par page 1 par reset karein
useEffect(() => {
  setCurrentPage(1);
}, [searchTerm, courseFilter]);

  return (
    <div className="p-0 min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8 pt-4">
        
          {/* 🌟 Sirf Heading ke liye Chota Highlight Box */}
        <div style={{
          backgroundColor: '#E2C275',
          padding: '18px 30px',
          borderRadius: '18px',
          display: 'inline-flex',
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '1.8rem',
            fontWeight: '800',
            color: '#1A1A1A',
            fontFamily: 'Arial'
          }}>
            Intructors List 🎓
          </h2>
        </div>
        <button className="flex items-center gap-2 bg-[#D4A843] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#B38D35] transition-all shadow-lg shadow-[#D4A843]/20">
          <Plus size={20} /> Add Instructor
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap gap-4 items-center justify-between mb-8">
        <div className="flex gap-3">
          {/* <select className="border-none shadow-sm rounded-2xl px-5 py-3 text-sm font-bold text-gray-500 bg-white outline-none min-w-[180px]">
            <option>All Courses</option>
          </select> */}
           {/* 🌟 DYNAMIC COURSES DROPDOWN */}
            <select 
              className="bg-[#F9F6EE] border border-[#E8E1CD] rounded-xl px-4 py-2.5 
              text-sm font-black text-[#5C5C5C] outline-none"
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
            >
              <option value="All Courses">All Courses</option>
              {coursesList.map((course) => (
                <option key={course._id} value={course.title}>{course.title}</option>
              ))}
            </select>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search instructors..." 
            className="w-full pl-12 pr-4 py-3 bg-[#F9F6EE] border border-[#E8E1CD] rounded-xl text-sm outline-none focus:border-[#D4A843] transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Instructors Grid */}
      {loading ? (
        <div className="text-center py-20 font-bold text-gray-400">Loading instructors...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentInstructors.map((inst, index) => (
            <div key={inst._id || index} className="bg-white p-7 rounded-[32px] border border-gray-50 shadow-sm hover:shadow-xl transition-all group hover:-translate-y-1">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-16 h-16 rounded-[20px] overflow-hidden bg-gray-100 shadow-inner">
                   <img 
                    src={inst.photoUrl || `https://ui-avatars.com/api/?name=${inst.name}&background=D4A843&color=fff`} 
                    alt={inst.name} 
                    className="w-full h-full object-cover"
                   />
                </div>
                
                {/* Details */}
                <div className="flex-1">
                  <h3 className="font-extrabold text-[#1A1A1A] text-lg mb-0.5">{inst.name}</h3>
                  <p className="text-gray-400 text-xs font-medium truncate mb-2">{inst.email}</p>
                  <p className="text-[#4D80F1] text-xs font-extrabold uppercase tracking-wider">
                    {inst.coursesCount || 0} Courses
                  </p>
                </div>
              </div>

              {/* Stats and Actions Footer */}
              <div className="flex items-center justify-between mt-8 pt-5 border-t border-gray-50">
                <div className="flex gap-3 items-center">
                   <span className="text-sm font-extrabold text-gray-400">{inst.lessonsCount || 0} Lessons</span>
                </div>
                
                <div className="flex gap-2">
                   <button 
                    className="p-2.5 bg-green-300 text-gray-700 rounded-xl hover:bg-green-500 transition-all shadow-sm" 
                    title="view instructor">
                      <Eye size={16} /> 
                    </button>
                  <button 
                  className="p-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all shadow-md
                   shadow-blue-100" title='edit instructor'>
                  <Edit2 size={16} />
                 </button>
                  <button  className="p-2.5 bg-[#FF6B6B] text-white rounded-xl hover:bg-red-600 transition-all shadow-md shadow-red-100"
                  title="Delete instructor">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination (Matching Screenshot) */}
      {/* 🌟 Updated Pagination UI Section */}
      <div className="flex justify-between items-center mt-12 border-t border-gray-100 pt-8 text-gray-500 font-bold">
        <span className="text-xs uppercase tracking-widest text-gray-400">
          Showing {filteredInstructors.length > 0 ? indexOfFirstInstructor + 1 : 0} to{" "}
          {Math.min(indexOfLastInstructor, filteredInstructors.length)} of {filteredInstructors.length} results
        </span>
        
        <div className="flex items-center gap-3">
          {/* Previous Button */}
          <button 
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`p-2 border border-[#E8E1CD] rounded-lg transition-all ${
              currentPage === 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-[#F9F6EE]"
            }`}
          >
            <ChevronLeft size={20}/>
          </button>

          {/* Current Page Number */}
          <button className="w-10 h-10 bg-[#D4A843] text-white rounded-lg font-bold shadow-md">
            {currentPage}
          </button>

          {/* Next Button */}
          <button 
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`p-2 border border-[#E8E1CD] rounded-lg transition-all ${
              currentPage === totalPages || totalPages === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-[#F9F6EE]"
            }`}
          >
            <ChevronRight size={20}/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructorManagement;