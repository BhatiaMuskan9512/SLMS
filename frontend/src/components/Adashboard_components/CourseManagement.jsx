// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Search, Edit2, Trash2, Plus, BookOpen, Users, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

// const CourseManagement = () => {
//   const [courses, setCourses] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(true);
//   // const [currentPage, setCurrentPage] = useState(1);
//   // const coursesPerPage = 8;
//   const Categories = ["All categories", ...new Set(courses.map(course => course.category || "Uncategorized"))];
//   const [selectedCategory, setSelectedCategory] = useState("All categories");

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get("http://localhost:8000/api/course/get-published");
//         // Check karein ki res.data array hai ya nahi
//         setCourses(Array.isArray(res.data) ? res.data : res.data.courses || []);
//       } catch (error) {
//         console.error("Error fetching courses:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCourses();
//   }, []);

//   // 🌟 Filter Logic: Search bar ke liye
//   const filteredCourses = (courses || []).filter(course =>{
//     const mathesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesCategory = 
//       selectedCategory === "All categories"  ||
//       course.category === selectedCategory;

//       return mathesSearch && matchesCategory;
// });


//   return (
//     <div className="p-0 min-h-screen">
//       {/* Header Section */}
//       <div className="flex justify-between items-center mb-8 pt-4">
//         <h2 className="text-2xl font-extrabold text-[#1A1A1A] tracking-tight">Courses</h2>
//         <button className="flex items-center gap-2 bg-[#D4A843] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#B38D35] transition-all shadow-lg shadow-[#D4A843]/20">
//           <Plus size={20} /> Add Course
//         </button>
//       </div>

//       {/* Filter & Search Bar */}
//       <div className="flex flex-wrap gap-4 items-center justify-between mb-8">
//         <div className="flex gap-3">
//           {/* <select className="bg-[#F9F6EE] border border-[#E8E1CD] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#5C5C5C] outline-none">
//             <option>All Categories</option>
//           </select> */}
//           <select 
//           value={selectedCategory}
//           onChange={(e) => setSelectedCategory(e.target.value)}
//           className="bg-[#F9F6EE] border border-[#E8E1CD] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#5C5C5C] outline-none cursor-pointer"
//         >
//           {Categories.map((category, index) => (
//             <option key={index} value={category}>
//               {category}
//             </option>
//           ))}
//         </select>
//         </div>
        
//         <div className="relative w-full md:w-80">
//           <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
//           <input 
//             type="text" 
//             placeholder="Search courses..." 
//             className="w-full pl-12 pr-4 py-3.5 border-none shadow-sm rounded-2xl text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100 transition-all"
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* Courses Grid */}
//       {loading ? (
//         <div className="text-center py-20 font-bold text-gray-400">Loading your courses...</div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//           {filteredCourses.map((course, index) => (
//             <div key={course._id || index} className="bg-white rounded-[32px] overflow-hidden border border-gray-50 shadow-sm hover:shadow-xl transition-all group hover:-translate-y-1">
//               {/* Course Thumbnail */}
//               <div className="h-48 overflow-hidden relative">
//                 <img 
//                   src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop"} 
//                   alt={course.title}
//                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//                 />
//               </div>

//               {/* Course Details */}
//               <div className="p-6">
//                 <h3 className="font-extrabold text-[#1A1A1A] text-lg mb-1 truncate">{course.title}</h3>
//                 <p className="text-gray-400 text-xs font-semibold mb-4">{course.creator?.name || "Instructor Name"}</p>

//                 <div className="flex items-center justify-between mb-6 bg-gray-50 p-3 rounded-2xl">
//                   <div className="flex items-center gap-1.5 text-gray-500 text-xs font-bold">
//                     <Users size={14} className="text-blue-500" />
//                     <span>{course.enrolledStudents?.length || 0} Enrolled</span>
//                   </div>
//                   <div className="flex items-center gap-1.5 text-gray-500 text-xs font-bold">
//                     <BookOpen size={14} className="text-green-500" />
//                     <span>{course.lectures?.length || 0} Lessons</span>
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex items-center justify-between pt-2">
//                   {/* <span className="text-xs font-extrabold text-gray-800 bg-[#F1E9D2]/40 px-3 py-1 rounded-lg">
//                     {course.lectures?.length || 0} Lessons
//                   </span> */}

//                   <div className="flex gap-2">
//                     {/* 👁️ View Button (Naya wala) */}
//                     <button 
//                       className="p-2.5 bg-green-300 text-gray-700 rounded-xl hover:bg-green-500 transition-all shadow-sm"
//                       // onClick={() => navigate(`/course-view/${course._id}`)} // Agar aapne navigate setup kiya hai
//                     >
//                       <Eye size={16} /> 
//                     </button>
//                     <button className="p-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all 
//                     shadow-md shadow-blue-100">
//                       <Edit2 size={16} />
//                     </button>
//                     <button className="p-2.5 bg-[#FF6B6B] text-white rounded-xl hover:bg-red-600 transition-all 
//                     shadow-md shadow-red-100">
//                       <Trash2 size={16} />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Pagination Photo Jaisa */}
//       <div className="flex justify-between items-center mt-16 border-t border-gray-100 pt-8 text-gray-500 font-bold">
//         <span className="text-sm uppercase tracking-wider">Showing 1 to {filteredCourses.length} results</span>
//         <div className="flex items-center gap-3">
//            <button className="p-2 border border-[#E8E1CD] rounded-lg text-[#A39F8E] hover:bg-[#F9F6EE]"><ChevronLeft size={20}/></button>
//            <button className="w-10 h-10 bg-[#D4A843] text-white rounded-lg font-bold">1</button>
//            <button className="p-2 border border-[#E8E1CD] rounded-lg text-[#A39F8E] hover:bg-[#F9F6EE]"><ChevronRight size={20}/></button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CourseManagement;




import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CourseViewModal from './CourseViewModal';
import { Search, Edit2, Trash2, Plus, BookOpen, Users, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

const CourseManagement = () => {
   const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 8;
  const Categories = ["All categories", ...new Set(courses.map(course => course.category || "Uncategorized"))];
  const [selectedCategory, setSelectedCategory] = useState("All categories");

  const[selectedCourseId, setSelectedCourseID] = useState(null);
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

    // Step A: Delete Handler Function (Table ke upar dalo)
    const deleteCourseHandler = async (courseId) => {
        if (window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
            try {
                const res = await axios.delete(`http://localhost:8000/api/course/remove/${courseId}`, { withCredentials: true });
                if (res.data.success) {
                    toast.success("Course deleted successfully!");
                    // Table refresh karne ke liye page reload ya state update
                    window.location.reload(); 
                }
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to delete course");
            }
        }
    };



  // 🌟 Filter Logic: Search bar ke liye
  const filteredCourses = (courses || []).filter(course =>{
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = 
      selectedCategory === "All categories"  ||
      course.category === selectedCategory;

      return matchesSearch && matchesCategory;
  });

  // 🌟 Pagination calculation (FIXED: students ki jagah courses logic use kiya)
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;

  // Mapping ke liye sirf is page ke courses nikalna
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);

  // Total pages calculation
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  // Search ya category change hone par page 1 par reset karna zaroori hai
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

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
            All Courses List 🎓
          </h2>
        </div>
        <button className="flex items-center gap-2 bg-[#D4A843] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#B38D35] transition-all shadow-lg shadow-[#D4A843]/20">
          <Plus size={20} /> Add Course
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap gap-4 items-center justify-between mb-8">
        <div className="flex gap-3">
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#F9F6EE] border border-[#E8E1CD] rounded-xl px-4 py-2.5 text-sm font-black text-[#5C5C5C] outline-none cursor-pointer"
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
            className="w-full pl-12 pr-4 py-3 bg-[#F9F6EE] border border-[#E8E1CD] rounded-xl text-sm outline-none focus:border-[#D4A843] transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="text-center py-20 font-bold text-gray-400">Loading your courses...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {/* 🌟 FIXED: filteredCourses ki jagah currentCourses map kijiye */}
          {currentCourses.map((course, index) => (
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
               <p className="text-gray-400 text-sm font-semibold mb-4">{course.creator?.name || "Instructor Name"}</p>

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
                  <div className="flex gap-2">
                    <button  onClick={() => setSelectedCourseID(course._id)}
                    className="p-2.5 bg-green-300 text-gray-700 rounded-xl hover:bg-green-500 transition-all shadow-sm" 
                    title="view course">
                      <Eye size={16} /> 
                    </button>
                    <button onClick={() => navigate(`/educator/edit-course/${course._id}`)}
                    className="p-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all shadow-md
                     shadow-blue-100" title='edit course'>
                      <Edit2 size={16} />
                    </button>
                    <button  onClick={() => deleteCourseHandler(course._id)} // Call delete function
                    className="p-2.5 bg-[#FF6B6B] text-white rounded-xl hover:bg-red-600 transition-all shadow-md shadow-red-100" 
                    title="Delete Course">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- 🌟 Pagination Section (FIXED Logic & Stylings) --- */}
      <div className="flex justify-between items-center mt-10 border-t border-gray-100 pt-8 text-gray-500 font-bold">
        
        {/* Dynamic Result Text */}
        <span className="text-sm uppercase tracking-wider">
          Showing {filteredCourses.length > 0 ? indexOfFirstCourse + 1 : 0} to{" "}
          {Math.min(indexOfLastCourse, filteredCourses.length)} of {filteredCourses.length} results
        </span>

        <div className="flex items-center gap-3">
          {/* Previous Button */}
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`p-2 border border-[#E8E1CD] rounded-lg text-[#A39F8E] transition-all ${
              currentPage === 1 ? "opacity-30 cursor-not-allowed text-gray-800 border-gray-400" : "hover:bg-[#F9F6EE] text-gray-700 border-gray-300"
            }`}
          >
            <ChevronLeft size={20} />
          </button>

          {/* Current Page Number Display */}
          <div className="w-10 h-10 bg-[#D4A843] text-white rounded-lg flex items-center justify-center font-bold shadow-md shadow-yellow-100">
            {currentPage}
          </div>

          {/* Next Button */}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`p-2 border border-[#E8E1CD] rounded-lg text-[#A39F8E] transition-all ${
              currentPage === totalPages || totalPages === 0
                ? "opacity-30 cursor-not-allowed border-gray-400 text-gray-800"
                : "hover:bg-[#F9F6EE]  text-gray-700 border-gray-300"
            }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {selectedCourseId && (
      <CourseViewModal
        courseId={selectedCourseId}
        onClose={() => setSelectedCourseId(null)}
      />
    )}
    </div>
  );
};

export default CourseManagement;