import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { X, Mail, Calendar, BookOpen, 
         Users, Award } from 'lucide-react';

const InstructorViewModal = ({ instructorId, onClose }) => {
  const [instructor, setInstructor] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstructor = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/user/instructor/${instructorId}`
        );
        if (res.data.success) {
          setInstructor(res.data.instructor);
          setCourses(res.data.courses);
        }
      } catch (error) {
        console.error("Error fetching instructor:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInstructor();
  }, [instructorId]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  // Total students across all courses
  const totalStudents = courses.reduce((acc, course) => 
    acc + (course.enrolledStudents?.length || 0), 0
  );

  // Total lectures across all courses
  const totalLectures = courses.reduce((acc, course) => 
    acc + (course.lectures?.length || 0), 0
  );

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm 
                    flex items-center justify-center z-[1000] p-4">
      
      <div className="bg-white w-full max-w-lg rounded-[32px] 
                      shadow-2xl overflow-hidden">

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-[#D4A843] 
                           border-t-transparent rounded-full animate-spin"/>
          </div>

        ) : !instructor ? (
          <div className="flex items-center justify-center h-64 
                          text-gray-400 font-bold">
            Instructor not found.
          </div>

        ) : (
          <>
            {/* Header */}
            <div className="bg-gradient-to-br from-[#D4A843] to-[#B38D35] 
                            p-8 relative">
              
               {/* Close Button */}
                            <button
                              onClick={onClose}
                              className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 
                                         text-white p-2 rounded-full transition-all"
                            >
                              <X size={18} />
                            </button>
              <div className="flex items-center gap-5">
                {instructor.photoUrl ? (
                  <img src={instructor.photoUrl}
                    alt={instructor.name}
                    className="w-20 h-20 rounded-[20px] object-cover 
                               shadow-lg border-4 border-white/30"/>
                ) : (
                  <div className="w-20 h-20 rounded-[20px] bg-white/20 
                                  flex items-center justify-center 
                                  text-white text-3xl font-black">
                    {instructor.name?.charAt(0)}
                  </div>
                )}

                <div>
                  <h2 className="text-white text-2xl font-black">
                    {instructor.name}
                  </h2>
                  <span className="bg-white/20 text-white text-xs 
                                   font-bold px-3 py-1 rounded-full 
                                   mt-1 inline-block">
                    Educator
                  </span>
                </div>
              </div>

              {/* Email + Joined */}
              <div className="flex flex-wrap gap-3 mt-5">
                <div className="flex items-center gap-2 
                                bg-white/15 px-3 py-2 rounded-xl">
                  <Mail size={14} className="text-white"/>
                  <span className="text-white text-xs font-semibold">
                    {instructor.email}
                  </span>
                </div>
                <div className="flex items-center gap-2 
                                bg-white/15 px-3 py-2 rounded-xl">
                  <Calendar size={14} className="text-white"/>
                  <span className="text-white text-xs font-semibold">
                    Joined {formatDate(instructor.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 divide-x divide-[#F1E9D2] 
                            border-b border-[#F1E9D2]">
              
              <div className="flex flex-col items-center py-5 gap-1">
                <Award size={20} className="text-[#4D80F1]"/>
                <span className="text-xl font-black text-[#1A1A1A]">
                  {courses.length}
                </span>
                <span className="text-[10px] font-bold text-gray-400 
                                 uppercase tracking-wider">
                  Courses
                </span>
              </div>

              <div className="flex flex-col items-center py-5 gap-1">
                <Users size={20} className="text-green-400"/>
                <span className="text-xl font-black text-[#1A1A1A]">
                  {totalStudents}
                </span>
                <span className="text-[10px] font-bold text-gray-400 
                                 uppercase tracking-wider">
                  Students
                </span>
              </div>

              <div className="flex flex-col items-center py-5 gap-1">
                <BookOpen size={20} className="text-orange-400"/>
                <span className="text-xl font-black text-[#1A1A1A]">
                  {totalLectures}
                </span>
                <span className="text-[10px] font-bold text-gray-400 
                                 uppercase tracking-wider">
                  Lectures
                </span>
              </div>
            </div>

            {/* Courses List */}
            <div className="p-6 max-h-64 overflow-y-auto">
              <h3 className="text-sm font-black text-[#1A1A1A] 
                             uppercase tracking-wider mb-4">
                Created Courses
              </h3>

              {courses.length === 0 ? (
                <p className="text-center text-gray-400 italic text-sm py-6">
                  No courses created yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {courses.map((course, index) => (
                    <div key={course._id || index}
                         className="flex items-center gap-4 p-3 
                                    bg-[#F9F6EE] rounded-2xl">
                      
                      {course.thumbnail ? (
                        <img src={course.thumbnail}
                          alt={course.title}
                          className="w-12 h-12 rounded-xl object-cover flex-shrink-0"/>
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-[#4D80F1]/20 
                                        flex items-center justify-center flex-shrink-0">
                          <BookOpen size={18} className="text-[#4D80F1]"/>
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[#1A1A1A] text-sm truncate">
                          {course.title}
                        </p>
                        <p className="text-xs text-gray-400 font-medium mt-0.5">
                          {course.category} · {" "}
                          {course.enrolledStudents?.length || 0} students
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InstructorViewModal;