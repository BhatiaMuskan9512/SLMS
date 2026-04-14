import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, Edit2, Trash2, Plus, Mail, ChevronLeft, ChevronRight, Eye , X} from 'lucide-react';
import InstructorViewModal from './InstructorViewModal';

const InstructorManagement = () => {
  const [instructors, setInstructors] = useState([]);
  const [coursesList, setCoursesList] = useState([]); // 🌟 Dynamic Courses State
  const [courseFilter, setCourseFilter] = useState("All Courses");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  
  const [currentPage, setCurrentPage] = useState(1);
  const instructorsPerPage = 6; // Ek page par kitne instructors dikhane hain (Aap 8 bhi rakh sakti hain)
  
  const [selectedInstructorId, setSelectedInstructorId] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', email: '', password: '' });
  const [addLoading, setAddLoading] = useState(false);

  // Instructor Edit button pe click
  // 1. State add karo upar
const [selectedInstructor, setSelectedInstructor] = useState(null);
const [editForm, setEditForm] = useState({
  name: "", email: "", role: "educator"
});
const [photoFile, setPhotoFile] = useState(null);
const [photoPreview, setPhotoPreview] = useState(null);
const [editLoading, setEditLoading] = useState(false);

// 2. Edit button click par yeh function call karo
const handleEditClick = (inst) => {
  setSelectedInstructor(inst);
  setEditForm({ name: inst.name, email: inst.email, role: inst.role });
  setPhotoPreview(inst.photoUrl || null);
  setPhotoFile(null);
};

// 3. Photo change handler
const handlePhotoChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }
};

// 4. Submit handler
const handleEditSubmit = async () => {
  setEditLoading(true);
  try {
    const data = new FormData();
    data.append("name", editForm.name);
    data.append("email", editForm.email);
    data.append("role", editForm.role);
    if (photoFile) data.append("photoUrl", photoFile);

    const res = await axios.put(
      `http://localhost:8000/api/user/update-instructor/${selectedInstructor._id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (res.data.success) {
      // ✅ List mein bhi update karo
      setInstructors(prev =>
        prev.map(inst =>
          inst._id === selectedInstructor._id
            ? { ...inst, ...res.data.instructor }
            : inst
        )
      );
      setSelectedInstructor(null); // Modal band karo
    }
  } catch (err) {
    console.error("Update failed:", err);
  } finally {
    setEditLoading(false);
  }
};




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

  const filteredInstructors = instructors.filter(inst => {
    const matchesSearch =
        inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inst.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCourse =
        courseFilter === "All Courses" ||
        inst.courses?.some(c => c.title === courseFilter); // ✅ Course filter

    return matchesSearch && matchesCourse;
});


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


const handleDeleteInstructor = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this instructor?");
    if (!confirm) return;

    try {
        const res = await axios.delete(
            `http://localhost:8000/api/user/delete-instructor/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}` // ✅ Token bhejo
                }
            }
        );
        if (res.data.success) {
            setInstructors(prev => prev.filter(inst => inst._id !== id));
            alert("Instructor deleted successfully!");
        }
    } catch (error) {
        console.error("Delete error:", error);
        alert("Failed to delete instructor.");
    }
};


const handleAddInstructor = async (e) => {
  e.preventDefault();
  setAddLoading(true);
  try {
    const res = await axios.post("http://localhost:8000/api/user/register", {
      ...addForm,
      role: 'educator',
      isOtpVerified: true
    });
    if (res.data.success) {
      setIsAddModalOpen(false);
      setAddForm({ name: '', email: '', password: '' });
      // List refresh karo
      const updated = await axios.get("http://localhost:8000/api/user/instructors-count");
      if (updated.data.success) setInstructors(updated.data.instructors);
      alert("Instructor Added!");
    }
  } catch (error) {
    alert(error.response?.data?.message || "Error adding instructor");
  } finally {
    setAddLoading(false);
  }
};

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
        <button onClick={() => setIsAddModalOpen(true)}
        className="flex items-center gap-2 bg-[#D4A843] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#B38D35] transition-all shadow-lg shadow-[#D4A843]/20">
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
                   <button onClick={() => setSelectedInstructorId(inst._id)}
                    className="p-2.5 bg-green-300 text-gray-700 rounded-xl hover:bg-green-500 transition-all shadow-sm" 
                    title="view instructor">
                      <Eye size={16} /> 
                    </button>
                  <button onClick={() => handleEditClick(inst)}  // ✅
                  className="p-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all shadow-md
                   shadow-blue-100" title='edit instructor'>
                  <Edit2 size={16} />
                 </button>
                  <button  onClick={() => handleDeleteInstructor(inst._id)}
                  className="p-2.5 bg-[#FF6B6B] text-white rounded-xl hover:bg-red-600 transition-all shadow-md shadow-red-100"
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

      {selectedInstructorId && (
        <InstructorViewModal 
          instructorId={selectedInstructorId}
           onClose={() => setSelectedInstructorId(null)}
          />
      )}
      {/* Edit Modal */}
        {selectedInstructor && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm 
                          flex items-center justify-center z-[1000] p-4">
            
            <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden">
              
              {/* Header */}
              <div className="bg-gradient-to-br from-[#D4A843] to-[#B38D35] p-6 relative">
                <button
                  onClick={() => setSelectedInstructor(null)}
                  className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 
                            text-white p-2 rounded-full transition-all"
                >
                  <X size={18} />
                </button>
                <h2 className="text-white text-xl font-black">Edit Instructor</h2>
                <p className="text-white/70 text-sm mt-1">Update instructor details</p>
              </div>

              {/* Form */}
              <div className="p-6 space-y-5">

                {/* Photo */}
                <div className="flex flex-col items-center gap-3">
                  <div className="w-24 h-24 rounded-[20px] overflow-hidden bg-gray-100">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover"/>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl font-black text-gray-400">
                        {editForm.name?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer bg-[#F9F6EE] 
                                    border border-[#E8E1CD] px-4 py-2 rounded-xl 
                                    text-sm font-bold text-gray-600 hover:bg-[#F0E8D0] transition-all">
                    📷 Change Photo
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange}/>
                  </label>
                </div>

                {/* Name */}
                <div>
                  <label className="text-xs font-black text-gray-500 uppercase tracking-wider mb-1 block">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-[#F9F6EE] border border-[#E8E1CD] 
                              rounded-xl text-sm outline-none focus:border-[#D4A843] transition-all"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="text-xs font-black text-gray-500 uppercase tracking-wider mb-1 block">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 bg-[#F9F6EE] border border-[#E8E1CD] 
                              rounded-xl text-sm outline-none focus:border-[#D4A843] transition-all"
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="text-xs font-black text-gray-500 uppercase tracking-wider mb-1 block">
                    Role
                  </label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-4 py-3 bg-[#F9F6EE] border border-[#E8E1CD] 
                              rounded-xl text-sm outline-none focus:border-[#D4A843] transition-all"
                  >
                    <option value="educator">Educator</option>
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setSelectedInstructor(null)}
                    className="flex-1 py-3 border border-[#E8E1CD] rounded-xl 
                              text-sm font-bold text-gray-500 hover:bg-[#F9F6EE] transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditSubmit}
                    disabled={editLoading}
                    className="flex-1 py-3 bg-[#D4A843] text-white rounded-xl 
                              text-sm font-bold hover:bg-[#B38D35] transition-all
                              disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {editLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}
    
    {/* Add Instructor Modal */}
{isAddModalOpen && (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-[1000]">
    <div className="bg-white w-full max-w-md rounded-[40px] p-10 shadow-2xl">
      
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-black text-[#1A1A1A]">New Instructor</h3>
        <button 
          onClick={() => setIsAddModalOpen(false)} 
          className="bg-[#F9F6EE] p-2 rounded-full text-[#A39F8E]">
          <X size={20}/>
        </button>
      </div>

      <form onSubmit={handleAddInstructor} className="space-y-5">
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#A39F8E] uppercase ml-1">Full Name</label>
          <input 
            required 
            value={addForm.name}
            className="w-full px-5 py-4 bg-[#F9F6EE] border-none rounded-2xl outline-none"
            onChange={(e) => setAddForm({...addForm, name: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-[#A39F8E] uppercase ml-1">Email Address</label>
          <input 
            required 
            type="email"
            value={addForm.email}
            className="w-full px-5 py-4 bg-[#F9F6EE] border-none rounded-2xl outline-none"
            onChange={(e) => setAddForm({...addForm, email: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-[#A39F8E] uppercase ml-1">Password</label>
          <input 
            required 
            type="password"
            value={addForm.password}
            className="w-full px-5 py-4 bg-[#F9F6EE] border-none rounded-2xl outline-none"
            onChange={(e) => setAddForm({...addForm, password: e.target.value})}
          />
        </div>

        <button 
          type="submit" 
          disabled={addLoading} 
          className="w-full bg-[#D4A843] text-white py-5 rounded-[20px] font-black text-lg shadow-xl shadow-[#D4A843]/30 transition-all">
          {addLoading ? "Adding..." : "Add to SkillLink"}
        </button>
      </form>

    </div>
  </div>
)}
    </div>
  );
};

export default InstructorManagement;