import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Edit2, Trash2, Plus, Mail, ChevronLeft, ChevronRight } from 'lucide-react';

const InstructorManagement = () => {
  const [instructors, setInstructors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  
  
  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        // Backend se instructors ka data lana
        const res = await axios.get("http://localhost:8000/api/user/instructors-count");
        if (res.data.success) {
          setInstructors(res.data.instructors);
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

  return (
    <div className="p-0 min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8 pt-4">
        <h2 className="text-2xl font-extrabold text-[#1A1A1A] tracking-tight">Instructors</h2>
        <button className="flex items-center gap-2 bg-[#D4A843] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#B38D35] transition-all shadow-lg shadow-[#D4A843]/20">
          <Plus size={20} /> Add Instructor
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap gap-4 items-center justify-between mb-8">
        <div className="flex gap-3">
          <select className="border-none shadow-sm rounded-2xl px-5 py-3 text-sm font-bold text-gray-500 bg-white outline-none min-w-[180px]">
            <option>All Courses</option>
          </select>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search instructors..." 
            className="w-full pl-12 pr-4 py-3.5 border-none shadow-sm rounded-2xl text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Instructors Grid */}
      {loading ? (
        <div className="text-center py-20 font-bold text-gray-400">Loading instructors...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredInstructors.map((inst, index) => (
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
                   {/* 🌟 Dynamic Status Label jaisa photo mein hai */}
                   {/* <span className={`px-3 py-1 text-[10px] font-bold rounded-lg uppercase ${
                     inst.status === 'Inactive' ? 'bg-red-50 text-red-500' : 'bg-[#E3F9F1] text-[#2DBC94]'
                   }`}>
                     {inst.status || 'Active'}
                   </span> */}
                </div>
                
                <div className="flex gap-2">
                  <button className="p-2.5 bg-blue-50 text-[#4D80F1] rounded-xl hover:bg-[#4D80F1] hover:text-white transition-all">
                    <Edit2 size={16} />
                  </button>
                  <button className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination (Matching Screenshot) */}
      <div className="flex justify-between items-center mt-12 border-t border-gray-100 pt-8 text-gray-500 font-bold">
        <span className="text-xs uppercase tracking-widest text-gray-400">
          Showing 1 to {filteredInstructors.length} of {instructors.length} results
        </span>
         <div className="flex items-center gap-3">
            <button className="p-2 border border-[#E8E1CD] rounded-lg text-[#A39F8E] hover:bg-[#F9F6EE]"><ChevronLeft size={20}/></button>
            <button className="w-10 h-10 bg-[#D4A843] text-white rounded-lg font-bold">1</button>
            <button className="p-2 border border-[#E8E1CD] rounded-lg text-[#A39F8E] hover:bg-[#F9F6EE]"><ChevronRight size={20}/></button>
          </div>
      </div>
    </div>
  );
};

export default InstructorManagement;