import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Edit2, Trash2, Plus, X, LayoutGrid, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import StudentViewModal from './StudentViewModal';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [coursesList, setCoursesList] = useState([]); // 🌟 Dynamic Courses State
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("All Courses");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5; // Ek page par 5 students dikhayenge

  // just changes
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', courseName: '' // 🌟 courseName add kiya
  });

  const fetchData = async () => {
    try {
      // 1. Students Fetch
      const res = await axios.get("http://localhost:8000/api/user/all");
      if (res.data.success) setStudents(res.data.users);
      console.log("Data in state: ", res.data.users);

      // 2. 🌟 Dynamic Courses Fetch (Count aur List dono controller se)
      const courseRes = await axios.get("http://localhost:8000/api/course/count-all");
      if (courseRes.data.success) {
        setCoursesList(courseRes.data.courses || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => { fetchData(); }, []);

  console.log("Dropdown selected:", courseFilter);
  console.log("First student courses",students[0]?.enrolledCourses);
  // 🌟 Filter Logic
  const filteredStudents = students.filter((student) => {
  // 1. Search Logic (Name ya Email check karein)
  const matchesSearch = 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.email.toLowerCase().includes(searchTerm.toLowerCase());

  // 2. Dropdown Logic (Course check karein)
  const matchesCourse = 
    courseFilter === "All Courses" || 
    (student.enrolledCourses && student.enrolledCourses.some(c => c.title === courseFilter));

  // 3. Dono true hone chahiye
  return matchesSearch && matchesCourse;
});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/api/user/register", { ...formData, role: 'student' });
      if (res.data.success) {
        setIsModalOpen(false);
        fetchData();
        setFormData({ name: '', email: '', password: ''});
        alert("Student Registered!");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Error adding student");
    } finally { setLoading(false); }
  };


  const handleDelete = async (id) => {
  // 🌟 Ye line ek popup dikhayegi OK aur Cancel buttons ke saath
  const userConfirmed = window.confirm("Kya aap sach mein is student ko delete karna chahte hain?");

  if (userConfirmed) {
    // Agar OK dabaya toh hi ye block chalega
    try {
      await axios.delete(`http://localhost:8000/api/user/delete-student/${id}`);
      fetchData(); // List refresh ho jayegi
    } catch (error) {
      console.log("Delete fail:", error);
    }
  }
};



  // 🌟 Pagination Calculation for Students
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;

  // Ab mapping ke liye 'currentStudents' use karenge
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  // Total pages calculation
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  // Search badalne par page 1 par reset karna
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]); // Agar koi aur filter hai toh wo bhi yahan add karein



  return (
    <div className="p-5  min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
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
      All Students List 🎓
    </h2>
  </div>

  {/* Button waisa hi rahega jaisa aapne bheja tha */}
  <button 
    onClick={() => setIsModalOpen(true)}
    className="flex items-center gap-2 bg-[#D4A843] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#B38D35] transition-all shadow-lg shadow-[#D4A843]/20"
  >
    <Plus size={20} /> Add Student
  </button>
</div>

      {/* Main Table Card */}
      <div className="bg-white rounded-[32px] shadow-sm border border-[#F1E9D2] p-8">
        
        {/* Filters Row */}
        <div className="flex flex-wrap gap-4 items-center justify-between mb-8">
          <div className="flex gap-3">
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
          
          <div className="relative w-80">
            <Search className="absolute left-4 top-3.5 text-[#A39F8E]" size={18} />
            <input 
              type="text" 
              placeholder="Search students..." 
              className="w-full pl-12 pr-4 py-3 bg-[#F9F6EE] border border-[#E8E1CD] rounded-xl text-sm outline-none focus:border-[#D4A843] transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table Structure */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-[#F1E9D2]">
                <th className="pb-4 px-4 text-xs font-bold text-[#A39F8E] uppercase tracking-widest">Name</th>
                <th className="pb-4 px-4 text-xs font-bold text-[#A39F8E] uppercase tracking-widest">Email</th>
                <th className="pb-4 px-4 text-xs font-bold text-[#A39F8E] uppercase tracking-widest pr-25">Action</th>
              </tr>
            </thead>
            {/* <tbody className="divide-y divide-[#F9F6EE]">
              {filteredStudents.map((student, index) => (
                <tr key={index} className="hover:bg-[#FDFBF4] transition-colors group">
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-[#D4A843]/10 flex items-center justify-center font-bold text-[#D4A843]">
                        {student.name.charAt(0)}
                      </div>
                      <span className="font-bold text-[#1A1A1A]">{student.name}</span>
                    </div>
                  </td>
                  <td className="py-5 px-4 text-sm text-[#5C5C5C]">{student.email}</td>

                  <td className="py-5 px-4 text-right">
                    <div className="flex gap-2 justify-end">
                      <button className="p-2 bg-[#F9F6EE] text-[#A39F8E] rounded-lg hover:bg-[#D4A843] hover:text-white transition-all"><Edit2 size={16}/></button>
                      <button className="p-2 bg-[#F9F6EE] text-[#A39F8E] rounded-lg hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody> */}
            <tbody className="divide-y divide-[#F9F6EE]">
        {filteredStudents.length > 0 ? (
           currentStudents.map((student, index) => (
        <tr key={index} className="hover:bg-[#FDFBF4] transition-colors group">
         {/* 1. Name Column */}
        <td className="py-5 px-4">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-[#D4A843]/10 flex items-center justify-center font-bold text-[#D4A843]">
              {student.name ? student.name.charAt(0) : "S"}
            </div>
            <span className="font-bold text-[#1A1A1A]">{student.name}</span>
          </div>
        </td>

        {/* 2. Email Column */}
        <td className="py-5 px-4 text-sm text-[#5C5C5C]">
          {student.email}
        </td>

        {/* 3. Action Column */}
        <td className="py-5 px-4">
          <div className="flex gap-2 justify-start pr-25">
              <button 
              onClick={()=> {
                console.log("Student ID:", student._id);
                setSelectedStudentId(student._id)}}
               className="p-2.5 bg-green-300 text-gray-700 rounded-xl hover:bg-green-500 transition-all shadow-sm" 
              title="view student">
              <Eye size={16} /> 
              </button>
            <button className="p-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all shadow-md
             shadow-blue-100" title='edit student'>
            <Edit2 size={16} />
            </button>
            {/* <button className="p-2 bg-[#F9F6EE] text-[#A39F8E] rounded-lg hover:bg-red-500 hover:text-white transition-all">
              <Trash2 size={16} />
            </button> */}
            {/* Delete Button - Red theme & Dynamic */}
            <button 
              onClick={() => handleDelete(student._id)} // 🌟 Dynamic Delete Function
              className="p-2.5 bg-[#FF6B6B] text-white rounded-xl hover:bg-red-600 transition-all shadow-md shadow-red-100"
                  title="Delete student"
            >
              <Trash2 size={16}/>
            </button>
          </div>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="3" className="py-10 text-center text-gray-400 italic">
        No students found for this course.
      </td>
    </tr>
  )}
</tbody>
          </table>
        </div>

        {/* Pagination Section */}
       {/* --- 🌟 Student Pagination Section --- */}
      <div className="flex justify-between items-center mt-10 border-t border-gray-100 pt-8 text-gray-500 font-bold">
        
        <span className="text-sm uppercase tracking-wider">
          Showing {filteredStudents.length > 0 ? indexOfFirstStudent + 1 : 0} to{" "}
          {Math.min(indexOfLastStudent, filteredStudents.length)} of {filteredStudents.length} students
        </span>

        <div className="flex items-center gap-3">
          {/* Previous Button */}
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`p-2 border border-[#E8E1CD] rounded-lg transition-all ${
              currentPage === 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-[#F9F6EE] text-gray-700 border-gray-300"
            }`}
          >
            <ChevronLeft size={20} />
          </button>

          {/* Current Page Number */}
          <div className="w-10 h-10 bg-[#D4A843] text-white rounded-lg flex items-center justify-center font-bold shadow-md shadow-yellow-100">
            {currentPage}
          </div>

          {/* Next Button */}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`p-2 border border-[#E8E1CD] rounded-lg transition-all ${
              currentPage === totalPages || totalPages === 0
                ? "opacity-30 cursor-not-allowed"
                : "hover:bg-[#F9F6EE] text-gray-700 border-gray-300"
            }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      </div>

      {/* Add Student Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-[1000]">
          <div className="bg-white w-full max-w-md rounded-[40px] p-10 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-[#1A1A1A]">New Student</h3>
              <button onClick={() => setIsModalOpen(false)} className="bg-[#F9F6EE] p-2 rounded-full text-[#A39F8E]"><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#A39F8E] uppercase ml-1">Full Name</label>
                <input required className="w-full px-5 py-4 bg-[#F9F6EE] border-none rounded-2xl outline-none"  onChange={(e)=>setFormData({...formData, name: e.target.value})}/>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#A39F8E] uppercase ml-1">Email Address</label>
                <input required type="email" className="w-full px-5 py-4 bg-[#F9F6EE] border-none rounded-2xl outline-none" onChange={(e)=>setFormData({...formData, email: e.target.value})}/>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#A39F8E] uppercase ml-1">Password</label>
                <input required type="password" className="w-full px-5 py-4 bg-[#F9F6EE] border-none rounded-2xl outline-none"onChange={(e)=>setFormData({...formData, password: e.target.value})}/>
              </div>
  
              <button type="submit" disabled={loading} className="w-full bg-[#D4A843] text-white py-5 rounded-[20px] font-black text-lg shadow-xl shadow-[#D4A843]/30 transition-all">
                {loading ? "Registering..." : "Add to SkillLink"}
              </button>
            </form>
          </div>
        </div>
      )}
      {/* ← YAHAN LIKHNA HAI, isModalOpen ke BAAD */}
      {selectedStudentId && (
        <StudentViewModal
          studentId={selectedStudentId}
          onClose={() => setSelectedStudentId(null)}
        />
      )}
    </div>
  );
};

export default StudentManagement;