import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { X, Mail, Calendar, BookOpen, 
         Clock, Flame, CheckCircle, XCircle } from 'lucide-react';

const StudentViewModal = ({ studentId, onClose }) => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/user/student/${studentId}`);
          console.log("API response", res.data);
          console.log("Courses", res.data.student?.enrolledCourses);
        if (res.data.success) setStudent(res.data.student);
      } catch (error) {
        console.error("Error fetching student:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [studentId]);

  // Format date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  return (
    // Backdrop
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm 
                    flex items-center justify-center z-[1000] p-4">
      
      {/* Modal Box */}
      <div className="bg-white w-full max-w-lg rounded-[32px] 
                      shadow-2xl overflow-hidden">
        
        {/* ── Loading State ── */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-[#D4A843] 
                           border-t-transparent rounded-full animate-spin"/>
          </div>

        ) : !student ? (
          <div className="flex items-center justify-center h-64 
                          text-gray-400 font-bold">
            Student not found.
          </div>

        ) : (
          <>
            {/* ── Header / Profile Section ── */}
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

              {/* Avatar + Name */}
              <div className="flex items-center gap-5">
                {student.photoUrl ? (
                  <img
                    src={student.photoUrl}
                    alt={student.name}
                    className="w-20 h-20 rounded-[20px] object-cover 
                               shadow-lg border-4 border-white/30"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-[20px] bg-white/20 
                                  flex items-center justify-center 
                                  text-white text-3xl font-black shadow-lg">
                    {student.name?.charAt(0)}
                  </div>
                )}

                <div>
                  <h2 className="text-white text-2xl font-black">
                    {student.name}
                  </h2>

                  {/* Role Badge */}
                  <span className="bg-white/20 text-white text-xs 
                                   font-bold px-3 py-1 rounded-full mt-1 
                                   inline-block capitalize">
                    {student.role}
                  </span>

                  {/* OTP Verified */}
                  <div className="flex items-center gap-1.5 mt-2">
                    {student.isOtpVerified ? (
                      <>
                        <CheckCircle size={14} className="text-green-300" />
                        <span className="text-green-200 text-xs font-semibold">
                          Verified
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle size={14} className="text-red-300" />
                        <span className="text-red-200 text-xs font-semibold">
                          Not Verified
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Email + Joined */}
              <div className="flex flex-wrap gap-4 mt-5">
                <div className="flex items-center gap-2 
                                bg-white/15 px-3 py-2 rounded-xl">
                  <Mail size={14} className="text-white" />
                  <span className="text-white text-xs font-semibold">
                    {student.email}
                  </span>
                </div>
                <div className="flex items-center gap-2 
                                bg-white/15 px-3 py-2 rounded-xl">
                  <Calendar size={14} className="text-white" />
                  <span className="text-white text-xs font-semibold">
                    Joined {formatDate(student.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* ── Stats Row ── */}
            <div className="grid grid-cols-3 divide-x divide-[#F1E9D2] 
                            border-b border-[#F1E9D2]">
              
              <div className="flex flex-col items-center py-5 gap-1">
                <Clock size={20} className="text-[#D4A843]" />
                <span className="text-xl font-black text-[#1A1A1A]">
                  {student.totalMinutesLearned || 0}
                </span>
                <span className="text-[10px] font-bold text-gray-400 
                                 uppercase tracking-wider">
                  Mins Learned
                </span>
              </div>

              <div className="flex flex-col items-center py-5 gap-1">
                <Flame size={20} className="text-orange-400" />
                <span className="text-xl font-black text-[#1A1A1A]">
                  {student.streakCount || 0}
                </span>
                <span className="text-[10px] font-bold text-gray-400 
                                 uppercase tracking-wider">
                  Day Streak
                </span>
              </div>

              <div className="flex flex-col items-center py-5 gap-1">
                <BookOpen size={20} className="text-blue-400" />
                <span className="text-xl font-black text-[#1A1A1A]">
                  {student.enrolledCourses?.length || 0}
                </span>
                <span className="text-[10px] font-bold text-gray-400 
                                 uppercase tracking-wider">
                  Courses
                </span>
              </div>
            </div>

            {/* ── Enrolled Courses Section ── */}
            <div className="p-6 max-h-64 overflow-y-auto">
              <h3 className="text-sm font-black text-[#1A1A1A] 
                             uppercase tracking-wider mb-4">
                Enrolled Courses
              </h3>

              {student.enrolledCourses?.length === 0 ? (
                <p className="text-center text-gray-400 italic text-sm py-6">
                  No courses enrolled yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {student.enrolledCourses?.map((course, index) => (
                    <div key={course._id || index}
                         className="flex items-center gap-4 p-3 
                                    bg-[#F9F6EE] rounded-2xl">
                      
                      {/* Course Thumbnail */}
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-[#D4A843]/20 
                                        flex items-center justify-center flex-shrink-0">
                          <BookOpen size={18} className="text-[#D4A843]" />
                        </div>
                      )}

                      {/* Course Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[#1A1A1A] text-sm truncate">
                          {course.title}
                        </p>
                        <p className="text-xs text-gray-400 font-medium mt-0.5">
                          {course.category || "Uncategorized"} · {" "}
                          {course.lectures?.length || 0} lectures
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

export default StudentViewModal;