import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Edit2, Trash2, Plus, BookOpen, Users, ChevronLeft, ChevronRight } from 'lucide-react';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const Categories = ["All categories", ...new Set(courses.map(course => course.category || "Uncategorized"))];
  const [selectedCategory, setSelectedCategory] = useState("All categories");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:8000/api/course/get-published");
        // Check karein ki res.data array hai ya nahi
        setCourses(Array.isArray(res.data) ? res.data : res.data.courses || []);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // 🌟 Filter Logic: Search bar ke liye
  const filteredCourses = (courses || []).filter(course =>{
    const mathesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = 
      selectedCategory === "All categories"  ||
      course.category === selectedCategory;

      return mathesSearch && matchesCategory;
});

  return (
    <div className="p-0 min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8 pt-4">
        <h2 className="text-2xl font-extrabold text-[#1A1A1A] tracking-tight">Courses</h2>
        <button className="flex items-center gap-2 bg-[#D4A843] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#B38D35] transition-all shadow-lg shadow-[#D4A843]/20">
          <Plus size={20} /> Add Course
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap gap-4 items-center justify-between mb-8">
        <div className="flex gap-3">
          {/* <select className="bg-[#F9F6EE] border border-[#E8E1CD] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#5C5C5C] outline-none">
            <option>All Categories</option>
          </select> */}
          <select 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-[#F9F6EE] border border-[#E8E1CD] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#5C5C5C] outline-none cursor-pointer"
        >
          {Categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search courses..." 
            className="w-full pl-12 pr-4 py-3.5 border-none shadow-sm rounded-2xl text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="text-center py-20 font-bold text-gray-400">Loading your courses...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredCourses.map((course, index) => (
            <div key={course._id || index} className="bg-white rounded-[32px] overflow-hidden border border-gray-50 shadow-sm hover:shadow-xl transition-all group hover:-translate-y-1">
              {/* Course Thumbnail */}
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop"} 
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Course Details */}
              <div className="p-6">
                <h3 className="font-extrabold text-[#1A1A1A] text-lg mb-1 truncate">{course.title}</h3>
                <p className="text-gray-400 text-xs font-semibold mb-4">{course.creator?.name || "Instructor Name"}</p>

                <div className="flex items-center justify-between mb-6 bg-gray-50 p-3 rounded-2xl">
                  <div className="flex items-center gap-1.5 text-gray-500 text-xs font-bold">
                    <Users size={14} className="text-blue-500" />
                    <span>{course.enrolledStudents?.length || 0} Enrolled</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-500 text-xs font-bold">
                    <BookOpen size={14} className="text-green-500" />
                    <span>{course.lectures?.length || 0} Lessons</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-extrabold text-gray-800 bg-[#F1E9D2]/40 px-3 py-1 rounded-lg">
                    {course.lectures?.length || 0} Lessons
                  </span>
                  <div className="flex gap-2">
                    <button className="p-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all shadow-md shadow-blue-100">
                      <Edit2 size={16} />
                    </button>
                    <button className="p-2.5 bg-[#FF6B6B] text-white rounded-xl hover:bg-red-600 transition-all shadow-md shadow-red-100">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Photo Jaisa */}
      <div className="flex justify-between items-center mt-16 border-t border-gray-100 pt-8 text-gray-500 font-bold">
        <span className="text-sm uppercase tracking-wider">Showing 1 to {filteredCourses.length} results</span>
        <div className="flex items-center gap-3">
           <button className="p-2 border border-[#E8E1CD] rounded-lg text-[#A39F8E] hover:bg-[#F9F6EE]"><ChevronLeft size={20}/></button>
           <button className="w-10 h-10 bg-[#D4A843] text-white rounded-lg font-bold">1</button>
           <button className="p-2 border border-[#E8E1CD] rounded-lg text-[#A39F8E] hover:bg-[#F9F6EE]"><ChevronRight size={20}/></button>
        </div>
      </div>
    </div>
  );
};

export default CourseManagement;