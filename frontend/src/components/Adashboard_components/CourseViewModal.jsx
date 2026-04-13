import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { X, BookOpen, Users, Tag, 
         Globe, Lock, User } from 'lucide-react';

const CourseViewModal = ({ courseId, onClose }) => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/course/get-course/${courseId}`
        );
        console.log("Course data:", res.data);
        setCourse(res.data);
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm 
                    flex items-center justify-center z-[1000] p-4">
      
      <div className="bg-white w-full max-w-lg rounded-[32px] 
                      shadow-2xl overflow-hidden">

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-[#D4A843] 
                           border-t-transparent rounded-full animate-spin"/>
          </div>

        ) : !course ? (
          <div className="flex items-center justify-center h-64 
                          text-gray-400 font-bold">
            Course not found.
          </div>

        ) : (
          <>
            {/* Header — Thumbnail */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={course.thumbnail || 
                  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600"}
                alt={course.title}
                className="w-full h-full object-cover"
              />

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t 
                              from-black/70 to-transparent"/>

              {/* Close Button */}
              <button onClick={onClose}
                className="absolute top-4 right-4 bg-white/20 
                           hover:bg-white/40 text-white p-2 
                           rounded-full transition-all">
                <X size={18}/>
              </button>

              {/* Title on thumbnail */}
              <div className="absolute bottom-4 left-4 right-4">
                <h2 className="text-white text-xl font-black 
                               leading-tight">
                  {course.title}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  {/* Category Badge */}
                  <span className="bg-[#D4A843] text-white text-xs 
                                   font-bold px-3 py-1 rounded-full">
                    {course.category}
                  </span>
                  {/* Published Badge */}
                  <span className={`text-xs font-bold px-3 py-1 
                                    rounded-full ${
                    course.isPublished 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-500 text-white'
                  }`}>
                    {course.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>
            </div>

            {/* Instructor Info */}
            <div className="px-6 py-4 border-b border-[#F1E9D2] 
                            flex items-center gap-3">
              {course.creator?.photoUrl ? (
                <img src={course.creator.photoUrl}
                  alt={course.creator.name}
                  className="w-10 h-10 rounded-xl object-cover"/>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-[#D4A843]/20 
                                flex items-center justify-center">
                  <User size={18} className="text-[#D4A843]"/>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-400 font-semibold">
                  Instructor
                </p>
                <p className="font-bold text-[#1A1A1A] text-sm">
                  {course.creator?.name || "Unknown"}
                </p>
              </div>

              {/* Price */}
              <div className="ml-auto text-right">
                <p className="text-xs text-gray-400 font-semibold">
                  Price
                </p>
                <p className="font-black text-[#D4A843] text-lg">
                  {course.price === 0 ? "Free" : `₹${course.price}`}
                </p>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 divide-x divide-[#F1E9D2] 
                            border-b border-[#F1E9D2]">
              <div className="flex flex-col items-center py-4 gap-1">
                <Users size={20} className="text-blue-400"/>
                <span className="text-xl font-black text-[#1A1A1A]">
                  {course.enrolledStudents?.length || 0}
                </span>
                <span className="text-[10px] font-bold text-gray-400 
                                 uppercase tracking-wider">
                  Students
                </span>
              </div>
              <div className="flex flex-col items-center py-4 gap-1">
                <BookOpen size={20} className="text-green-400"/>
                <span className="text-xl font-black text-[#1A1A1A]">
                  {course.lectures?.length || 0}
                </span>
                <span className="text-[10px] font-bold text-gray-400 
                                 uppercase tracking-wider">
                  Lectures
                </span>
              </div>
            </div>

            {/* Lectures List */}
            <div className="p-6 max-h-56 overflow-y-auto">
              <h3 className="text-sm font-black text-[#1A1A1A] 
                             uppercase tracking-wider mb-4">
                Lectures
              </h3>

              {course.lectures?.length === 0 ? (
                <p className="text-center text-gray-400 italic text-sm py-4">
                  No lectures added.
                </p>
              ) : (
                <div className="space-y-2">
                  {course.lectures?.map((lecture, index) => (
                    <div key={lecture._id || index}
                         className="flex items-center gap-3 p-3 
                                    bg-[#F9F6EE] rounded-2xl">
                      
                      {/* Lecture Number */}
                      <div className="w-8 h-8 rounded-lg bg-[#D4A843]/20 
                                      flex items-center justify-center 
                                      font-black text-[#D4A843] text-sm 
                                      flex-shrink-0">
                        {index + 1}
                      </div>

                      {/* Lecture Title */}
                      <p className="font-semibold text-[#1A1A1A] 
                                    text-sm flex-1 truncate">
                        {lecture.lectureTitle}
                      </p>

                      {/* Free/Locked Badge
                      {lecture.isPreviewFree ? (
                        <span className="flex items-center gap-1 
                                         bg-green-100 text-green-600 
                                         text-[10px] font-bold px-2 py-1 
                                         rounded-lg flex-shrink-0">
                          <Globe size={10}/> Free
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 
                                         bg-gray-100 text-gray-500 
                                         text-[10px] font-bold px-2 py-1 
                                         rounded-lg flex-shrink-0">
                          <Lock size={10}/> Paid
                        </span>
                      )} */}
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

export default CourseViewModal;