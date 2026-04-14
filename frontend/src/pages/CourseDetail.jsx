// // import React, { useEffect, useState } from 'react';
// // import { useParams, useNavigate } from 'react-router-dom';
// // import { useSelector, useDispatch } from 'react-redux';
// // import axios from 'axios';
// // import toast from 'react-hot-toast';
// // import { BiPlayCircle, BiTimeFive, BiBarChartAlt, BiUserVoice, BiCheckShield, BiLoaderAlt } from "react-icons/bi";
// // import { setSingleCourse } from '../redux/courseSlice';

// // const CourseDetail = () => {
// //     const { courseId } = useParams();
// //     const navigate = useNavigate();
// //     const dispatch = useDispatch();

// //     const { user, isAuthenticated } = useSelector((state) => state.auth);
// //     const { singleCourse } = useSelector((state) => state.course);
// //     const [loading, setLoading] = useState(true);

// //     // 1. Fetch Course Details from Backend
// //     useEffect(() => {
// //         const fetchCourse = async () => {
// //             try {
// //                 const res = await axios.get(`http://localhost:8000/api/course/get-course/${courseId}`,{withCredentials: true});
// //                 dispatch(setSingleCourse(res.data));
// //             } catch (error) {
// //                 toast.error("Course not found");
// //                 navigate('/');
// //             } finally {
// //                 setLoading(false);
// //             }
// //         };
// //         fetchCourse();
// //     }, [courseId, dispatch, navigate]);

// //     // 2. Enrollment Logic (Buy Course)
// //     const handleEnroll = async () => {
// //         if (!isAuthenticated) {
// //             toast.error("Please login to enroll");
// //             return navigate('/login');
// //         }

// //         try {
// //             const res = await axios.post(
// //                 `http://localhost:8000/api/course/enroll/${courseId}`, 
// //                 {}, 
// //                 { withCredentials: true }
// //             );
// //             if (res.data.success) {
// //                 toast.success("Successfully Enrolled!");
// //                 navigate(`/view-lectures/${courseId}`);
// //             }
// //         } catch (error) {
// //             toast.error(error.response?.data?.message || "Enrollment failed");
// //         }
// //     };

// //     if (loading) return (
// //         <div className="h-screen flex items-center justify-center">
// //             <BiLoaderAlt className="animate-spin text-4xl text-black" />
// //         </div>
// //     );

// //     const isEnrolled = singleCourse?.enrolled?.includes(user?._id);

// //     return (
// //         <div className="min-h-screen bg-white pt-[100px] pb-20 px-5 sm:px-10 lg:px-20 font-jakarta">
// //             <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
                
// //                 {/* --- Left Side: Course Info --- */}
// //                 <div className="flex-1">
// //                     <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
// //                         {singleCourse?.category}
// //                     </span>
// //                     <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mt-6 leading-tight">
// //                         {singleCourse?.title}
// //                     </h1>
// //                     <p className="text-gray-500 mt-6 text-lg leading-relaxed">
// //                         {singleCourse?.description}
// //                     </p>

// //                     {/* Stats Grid */}
// //                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12 border-y border-gray-100 py-8">
// //                         <div className="flex items-center gap-3">
// //                             <BiTimeFive className="text-2xl text-gray-400" />
// //                             <div><p className="text-xs text-gray-400 font-bold uppercase">Duration</p><p className="font-bold">12h 30m</p></div>
// //                         </div>
// //                         <div className="flex items-center gap-3">
// //                             <BiBarChartAlt className="text-2xl text-gray-400" />
// //                             <div><p className="text-xs text-gray-400 font-bold uppercase">Level</p><p className="font-bold">Beginner</p></div>
// //                         </div>
// //                         <div className="flex items-center gap-3">
// //                             <BiUserVoice className="text-2xl text-gray-400" />
// //                             <div><p className="text-xs text-gray-400 font-bold uppercase">Language</p><p className="font-bold">Hindi/Eng</p></div>
// //                         </div>
// //                         <div className="flex items-center gap-3">
// //                             <BiCheckShield className="text-2xl text-gray-400" />
// //                             <div><p className="text-xs text-gray-400 font-bold uppercase">Certificate</p><p className="font-bold">Yes</p></div>
// //                         </div>
// //                     </div>
// //                 </div>

// //                 {/* --- Right Side: Pricing & Thumbnail --- */}
// //                 <div className="w-full lg:w-[450px]">
// //                     <div className="bg-white rounded-[40px] border border-gray-100 shadow-2xl p-8 sticky top-[120px]">
// //                         <div className="relative group overflow-hidden rounded-3xl mb-8">
// //                             <img 
// //                                 src={singleCourse?.thumbnail} 
// //                                 alt="Thumbnail" 
// //                                 className="w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-110"
// //                             />
// //                             <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
// //                                 <BiPlayCircle className="text-white text-6xl" />
// //                             </div>
// //                         </div>

// //                         <div className="flex items-center justify-between mb-8 px-2">
// //                             <div>
// //                                 <p className="text-gray-400 text-sm font-bold uppercase tracking-tighter">Full Course Access</p>
// //                                 <h2 className="text-4xl font-black text-gray-900">₹{singleCourse?.price}</h2>
// //                             </div>
// //                             <span className="text-green-500 font-bold bg-green-50 px-3 py-1 rounded-lg text-sm">Save 40%</span>
// //                         </div>

// //                         {isEnrolled ? (
// //                             <button 
// //                                 onClick={() => navigate(`/view-lectures/${singleCourse?._id}`)}
// //                                 className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-3"
// //                             >
// //                                 <BiPlayCircle size={24} /> Continue Learning
// //                             </button>
// //                         ) : (
// //                             <button 
// //                                 onClick={handleEnroll}
// //                                 className="w-full py-5 bg-black text-white rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all shadow-xl shadow-gray-200"
// //                             >
// //                                 Enroll Now
// //                             </button>
// //                         )}
                        
// //                         <p className="text-center text-gray-400 text-xs mt-6">
// //                             30-Day Money-Back Guarantee • Lifetime Access
// //                         </p>
// //                     </div>
// //                 </div>

// //             </div>
// //         </div>
// //     );
// // };

// // export default CourseDetail;



// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import { BookOpen, Users, Globe, Lock, 
//          ChevronLeft, Play } from 'lucide-react';

// const CourseDetailPage = () => {
//   const { courseId } = useParams();
//   const navigate = useNavigate();
//   const { user } = useSelector((state) => state.auth);

//   const [course, setCourse] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [enrolling, setEnrolling] = useState(false);

//   // Check karo ki student already enrolled hai ya nahi
//   const isEnrolled = user?.enrolledCourses?.some(
//     (c) => c._id === courseId || c === courseId
//   );

//   useEffect(() => {
//     const fetchCourse = async () => {
//       try {
//         const res = await axios.get(
//           `http://localhost:8000/api/course/get-course/${courseId}`
//         );
//         setCourse(res.data);
//       } catch (error) {
//         console.error("Error fetching course:", error);
//         toast.error("Course not found!");
//         navigate('/all-courses');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCourse();
//   }, [courseId]);

//   // Enroll Handler
//   const handleEnroll = async () => {
//     if (!user) {
//       toast.error("Please login to enroll!");
//       navigate('/login');
//       return;
//     }

//     setEnrolling(true);
//     const toastId = toast.loading("Enrolling...");

//     try {
//       const res = await axios.post(
//         `http://localhost:8000/api/course/get-course/${courseId}/enroll`,
//         {},
//         { withCredentials: true }
//       );
//       toast.success(res.data.message, { id: toastId });
//       setTimeout(() => {
//         navigate(`/course-player/${courseId}`);
//       }, 1500);

//     } catch (error) {
//       toast.error(
//         error.response?.data?.message || "Failed to enroll", 
//         { id: toastId }
//       );
//       // Already enrolled hai toh redirect karo
//       if (error.response?.status === 400) {
//         setTimeout(() => {
//           navigate(`/course-player/${courseId}`);
//         }, 1500);
//       }
//     } finally {
//       setEnrolling(false);
//     }
//   };

//   // Loading State
//   if (loading) return (
//     <div className="min-h-screen bg-[#F6F4EC] flex items-center 
//                     justify-center">
//       <div className="w-12 h-12 border-4 border-[#D4A843] 
//                      border-t-transparent rounded-full animate-spin"/>
//     </div>
//   );

//   // Not Found
//   if (!course) return null;

//   const isFree = !course.price || course.price === 0;

//   return (
//     <div className="min-h-screen bg-[#F6F4EC] pt-[80px]">
      
//       {/* ── Hero Section ── */}
//       <div className="bg-[#0a0b0f] text-white">
//         <div className="max-w-6xl mx-auto px-6 py-12">
          
//           {/* Back Button */}
//           <button
//             onClick={() => navigate(-1)}
//             className="flex items-center gap-2 text-gray-400 
//                        hover:text-[#D4A843] transition-colors mb-8 group"
//           >
//             <ChevronLeft size={20} 
//               className="group-hover:-translate-x-1 transition-transform"/>
//             <span className="font-medium text-sm">Back to Courses</span>
//           </button>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 
//                           items-center">
            
//             {/* Left — Course Info */}
//             <div>
//               {/* Category Badge */}
//               <span className="bg-[#D4A843]/20 text-[#D4A843] text-xs 
//                                font-bold px-3 py-1 rounded-full">
//                 {course.category}
//               </span>

//               {/* Title */}
//               <h1 className="text-3xl md:text-4xl font-extrabold 
//                              mt-4 mb-4 leading-tight">
//                 {course.title}
//               </h1>

//               {/* Description */}
//               {course.description && (
//                 <p className="text-gray-400 text-base leading-relaxed mb-6">
//                   {course.description}
//                 </p>
//               )}

//               {/* Instructor */}
//               <div className="flex items-center gap-3 mb-6">
//                 {course.creator?.photoUrl ? (
//                   <img src={course.creator.photoUrl}
//                     alt={course.creator.name}
//                     className="w-10 h-10 rounded-xl object-cover"/>
//                 ) : (
//                   <div className="w-10 h-10 rounded-xl bg-[#D4A843]/20 
//                                   flex items-center justify-center 
//                                   font-bold text-[#D4A843]">
//                     {course.creator?.name?.charAt(0)}
//                   </div>
//                 )}
//                 <div>
//                   <p className="text-xs text-gray-400">Instructor</p>
//                   <p className="font-bold text-white text-sm">
//                     {course.creator?.name || "Expert Instructor"}
//                   </p>
//                 </div>
//               </div>

//               {/* Stats */}
//               <div className="flex flex-wrap gap-6">
//                 <div className="flex items-center gap-2 text-gray-400">
//                   <Users size={16} className="text-[#D4A843]"/>
//                   <span className="text-sm font-medium">
//                     {course.enrolledStudents?.length || 0} Students
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2 text-gray-400">
//                   <BookOpen size={16} className="text-[#D4A843]"/>
//                   <span className="text-sm font-medium">
//                     {course.lectures?.length || 0} Lectures
//                   </span>
//                 </div>
//                 {course.level && (
//                   <div className="flex items-center gap-2 text-gray-400">
//                     <span className="text-[#D4A843]">⚡</span>
//                     <span className="text-sm font-medium">{course.level}</span>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Right — Thumbnail */}
//             <div className="relative rounded-[24px] overflow-hidden 
//                             shadow-2xl">
//               <img
//                 src={course.thumbnail || 
//                   "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600"}
//                 alt={course.title}
//                 className="w-full h-64 object-cover"
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ── Main Content ── */}
//       <div className="max-w-6xl mx-auto px-6 py-12 
//                       grid grid-cols-1 lg:grid-cols-3 gap-10">

//         {/* Left — Lectures List */}
//         <div className="lg:col-span-2">
//           <h2 className="text-2xl font-extrabold text-[#0a0b0f] mb-6">
//             Course Lectures
//           </h2>

//           {course.lectures?.length === 0 ? (
//             <div className="bg-white rounded-[24px] p-10 text-center 
//                             border border-gray-100">
//               <BookOpen size={40} className="text-gray-300 mx-auto mb-3"/>
//               <p className="text-gray-400 font-medium">
//                 No lectures added yet.
//               </p>
//             </div>
//           ) : (
//             <div className="space-y-3">
//               {course.lectures?.map((lecture, index) => (
//                 <div key={lecture._id || index}
//                      className="bg-white rounded-[20px] p-5 
//                                 border border-gray-100 flex items-center 
//                                 gap-4 hover:border-[#D4A843]/30 
//                                 hover:shadow-md transition-all">
                  
//                   {/* Number */}
//                   <div className="w-10 h-10 rounded-xl bg-[#D4A843]/10 
//                                   flex items-center justify-center 
//                                   font-black text-[#D4A843] flex-shrink-0">
//                     {index + 1}
//                   </div>

//                   {/* Title */}
//                   <div className="flex-1">
//                     <p className="font-bold text-[#0a0b0f]">
//                       {lecture.lectureTitle}
//                     </p>
//                     {lecture.duration && (
//                       <p className="text-xs text-gray-400 mt-0.5">
//                         {lecture.duration} mins
//                       </p>
//                     )}
//                   </div>

//                   {/* Free/Locked */}
//                   {lecture.isPreviewFree ? (
//                     <span className="flex items-center gap-1.5 
//                                      bg-green-50 text-green-600 
//                                      text-xs font-bold px-3 py-1.5 
//                                      rounded-xl flex-shrink-0">
//                       <Globe size={12}/> Free Preview
//                     </span>
//                   ) : (
//                     <span className="flex items-center gap-1.5 
//                                      bg-gray-50 text-gray-400 
//                                      text-xs font-bold px-3 py-1.5 
//                                      rounded-xl flex-shrink-0">
//                       <Lock size={12}/> Paid
//                     </span>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Right — Enroll Card (Sticky) */}
//         <div className="lg:col-span-1">
//           <div className="bg-white rounded-[24px] p-6 border 
//                           border-gray-100 shadow-sm sticky top-[100px]">
            
//             {/* Price */}
//             <div className="text-center mb-6">
//               <p className="text-4xl font-extrabold text-[#0a0b0f]">
//                 {isFree ? (
//                   <span className="text-green-600">Free</span>
//                 ) : (
//                   `₹${course.price?.toLocaleString('en-IN')}`
//                 )}
//               </p>
//               <p className="text-gray-400 text-sm mt-1">
//                 {isFree ? "No payment required" : "One time payment"}
//               </p>
//             </div>

//             {/* Enroll / Continue Button */}
//             {isEnrolled ? (
//               <button
//                 onClick={() => navigate(`/course-player/${courseId}`)}
//                 className="w-full bg-green-600 text-white py-4 
//                            rounded-[16px] font-black text-lg 
//                            hover:bg-green-700 transition-all 
//                            flex items-center justify-center gap-2"
//               >
//                 <Play size={20}/> Continue Learning
//               </button>
//             ) : (
//               <button
//                 onClick={handleEnroll}
//                 disabled={enrolling}
//                 className="w-full bg-[#0a0b0f] text-white py-4 
//                            rounded-[16px] font-black text-lg 
//                            hover:bg-gray-800 transition-all 
//                            shadow-xl disabled:opacity-50"
//               >
//                 {enrolling ? "Enrolling..." : 
//                   isFree ? "Enroll for Free" : "Buy Now"}
//               </button>
//             )}

//             {/* Course Includes */}
//             <div className="mt-6 space-y-3">
//               <p className="text-xs font-black text-gray-400 
//                             uppercase tracking-wider">
//                 This course includes:
//               </p>
//               <div className="flex items-center gap-2 text-sm text-gray-600">
//                 <BookOpen size={16} className="text-[#D4A843]"/>
//                 <span>{course.lectures?.length || 0} lectures</span>
//               </div>
//               <div className="flex items-center gap-2 text-sm text-gray-600">
//                 <Users size={16} className="text-[#D4A843]"/>
//                 <span>{course.enrolledStudents?.length || 0} students enrolled</span>
//               </div>
//               {course.level && (
//                 <div className="flex items-center gap-2 text-sm text-gray-600">
//                   <span className="text-[#D4A843]">⚡</span>
//                   <span>{course.level} level</span>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CourseDetailPage;







import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BookOpen, Users, Globe, Lock,
         ChevronLeft, Play, Clock,
         Award, BarChart2, ShieldCheck } from 'lucide-react';

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  const isEnrolled = user?.enrolledCourses?.some(
    (c) => c._id === courseId || c === courseId
  );

  // Duration Calculator
  const calculateDuration = (lectures) => {
    if (!lectures || lectures.length === 0) return "N/A";
    const totalMins = lectures.reduce((acc, l) => acc + (l.duration || 0), 0);
    if (totalMins === 0) return `~${lectures.length * 10}m`;
    const hrs = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    if (hrs === 0) return `${mins}m`;
    return mins === 0 ? `${hrs}h` : `${hrs}h ${mins}m`;
  };

  // Toast helper for login required
  const showLoginToast = () => {
    toast.error("Please login to continue!", {
      icon: '🔒',
      style: {
        background: '#0a0b0f',
        color: '#fff',
        fontWeight: 'bold',
        borderRadius: '14px',
        border: '1px solid #D4A843',
        padding: '14px 20px',
        fontSize: '14px'
      }
    });
    setTimeout(() => navigate('/login'), 1200);
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/course/get-course/${courseId}`
        );
        setCourse(res.data);
      } catch (error) {
        toast.error("Course not found!");
        navigate('/all-courses');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  // Enroll Handler
  const handleEnroll = async () => {
    if (!user) { showLoginToast(); return; }

    setEnrolling(true);
    const toastId = toast.loading("Enrolling you in...");
    try {
      const res = await axios.post(
        `http://localhost:8000/api/course/${courseId}/enroll`,
        {}, { withCredentials: true }
      );
      toast.success("🎉 " + res.data.message, { id: toastId });
      setTimeout(() => navigate(`/course-player/${courseId}`), 1500);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Enrollment failed",
        { id: toastId }
      );
      if (error.response?.status === 400) {
        setTimeout(() => navigate(`/course-player/${courseId}`), 1500);
      }
    } finally {
      setEnrolling(false);
    }
  };

  // Lecture Click Handler
  const handleLectureClick = (lecture) => {
    if (!user) { showLoginToast(); return; }
    if (!isEnrolled && !lecture.isPreviewFree) {
      toast.error("Enroll in this course to access lectures!", {
        icon: '🔐',
        style: {
          background: '#0a0b0f',
          color: '#fff',
          fontWeight: 'bold',
          borderRadius: '14px',
          border: '1px solid #D4A843',
        }
      });
      return;
    }
    navigate(`/course-player/${courseId}`);
  };

  // Loading
  if (loading) return (
    <div className="min-h-screen bg-[#F6F4EC] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#D4A843]
                       border-t-transparent rounded-full animate-spin mx-auto"/>
        <p className="mt-5 text-gray-500 font-bold text-sm animate-pulse
                      uppercase tracking-widest">
          Loading Course...
        </p>
      </div>
    </div>
  );

  if (!course) return null;

  const isFree = !course.price || course.price === 0;
  const duration = calculateDuration(course.lectures);

  return (
    <div className="min-h-screen bg-[#F6F4EC] pt-[80px]">

      {/* ── Hero Section ── */}
      <div className="relative bg-[#0a0b0f] text-white overflow-hidden">

        {/* Blurred BG */}
        {course.thumbnail && (
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url(${course.thumbnail})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(60px)',
              transform: 'scale(1.1)'
            }}
          />
        )}

        <div className="relative max-w-6xl mx-auto px-6 py-16">

          {/* Back */}
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400
                       hover:text-[#D4A843] transition-colors mb-10 group">
            <ChevronLeft size={18}
              className="group-hover:-translate-x-1 transition-transform"/>
            <span className="text-sm font-semibold">Back to Courses</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-14 items-center">

            {/* Left */}
            <div className="lg:col-span-3 space-y-6">

              {/* Category */}
              <span className="inline-block bg-[#D4A843]/15 text-[#D4A843]
                               text-xs font-black px-4 py-2 rounded-full
                               uppercase tracking-widest border
                               border-[#D4A843]/20">
                {course.category}
              </span>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                {course.title}
              </h1>

              {/* Description */}
              {course.description && (
                <p className="text-gray-400 text-base leading-relaxed max-w-xl">
                  {course.description}
                </p>
              )}

              {/* Stats Row */}
              <div className="flex flex-wrap gap-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#D4A843]/15
                                  flex items-center justify-center">
                    <Clock size={16} className="text-[#D4A843]"/>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase
                                  font-black tracking-widest">Duration</p>
                    <p className="text-sm font-bold text-white">{duration}</p>
                  </div>
                </div>

                {course.level && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#D4A843]/15
                                    flex items-center justify-center">
                      <BarChart2 size={16} className="text-[#D4A843]"/>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase
                                    font-black tracking-widest">Level</p>
                      <p className="text-sm font-bold text-white">{course.level}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#D4A843]/15
                                  flex items-center justify-center">
                    <Users size={16} className="text-[#D4A843]"/>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase
                                  font-black tracking-widest">Students</p>
                    <p className="text-sm font-bold text-white">
                      {course.enrolledStudents?.length || 0}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* <div className="w-10 h-10 rounded-xl bg-[#D4A843]/15
                                  flex items-center justify-center">
                    <Award size={16} className="text-[#D4A843]"/>
                  </div> */}
                </div>
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-4 pt-2">
                {course.creator?.photoUrl ? (
                  <img src={course.creator.photoUrl}
                    alt={course.creator.name}
                    className="w-12 h-12 rounded-2xl object-cover
                               ring-2 ring-[#D4A843]/30"/>
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-[#D4A843]/20
                                  flex items-center justify-center
                                  text-[#D4A843] font-black text-xl">
                    {course.creator?.name?.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase
                                tracking-wider">Instructor</p>
                  <p className="font-bold text-white text-base">
                    {course.creator?.name || "Expert Instructor"}
                  </p>
                </div>
              </div>
            </div>

            {/* Right — Thumbnail */}
            <div className="lg:col-span-2">
              <div className="rounded-[28px] overflow-hidden shadow-2xl
                              ring-1 ring-white/10">
                <img
                  src={course.thumbnail ||
                    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600"}
                  alt={course.title}
                  className="w-full h-75 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Guest Banner ── */}
      {!user && (
        <div className="bg-[#D4A843] py-4">
          <div className="max-w-6xl mx-auto px-6 flex items-center
                          justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <ShieldCheck size={22} className="text-[#0a0b0f]"/>
              <p className="font-bold text-[#0a0b0f] text-sm">
                Login to enroll in this course and access all lectures
              </p>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="bg-[#0a0b0f] text-white px-6 py-2.5
                         rounded-xl font-black text-sm
                         hover:bg-gray-800 transition-all">
              Login Now →
            </button>
          </div>
        </div>
      )}

      {/* ── Main Content ── */}
      <div className="max-w-6xl mx-auto px-6 py-12
                      grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* Left — Lectures */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-extrabold text-[#0a0b0f]">
              Course Content
            </h2>
            <span className="text-sm font-bold text-gray-400 bg-white
                             px-4 py-2 rounded-xl border border-gray-100">
              {course.lectures?.length || 0} lectures • {duration}
            </span>
          </div>

          {course.lectures?.length === 0 ? (
            <div className="bg-white rounded-[24px] p-15 text-center
                            border border-gray-100">
              <BookOpen size={48} className="text-gray-200 mx-auto mb-4"/>
              <p className="text-gray-400 font-bold">No lectures added yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {course.lectures?.map((lecture, index) => {

                const canAccess = lecture.isPreviewFree || isEnrolled;
                const isLocked = !user || (!isEnrolled && !lecture.isPreviewFree);

                return (
                  <div
                    key={lecture._id || index}
                    onClick={() => handleLectureClick(lecture)}
                    className={`bg-white rounded-[20px] p-5 border
                               flex items-center gap-4 transition-all
                               cursor-pointer group
                               ${isLocked
                                 ? 'border-gray-100 hover:border-gray-200 opacity-80'
                                 : 'border-gray-100 hover:border-[#D4A843]/40 hover:shadow-md'
                               }`}
                  >
                    {/* Icon */}
                    <div className={`w-11 h-11 rounded-xl flex items-center
                                    justify-center flex-shrink-0 transition-all
                                    font-black text-sm
                                    ${canAccess
                                      ? 'bg-[#D4A843]/10 text-[#D4A843] group-hover:bg-[#D4A843] group-hover:text-white'
                                      : 'bg-gray-100 text-gray-400'
                                    }`}>
                      {isLocked
                        ? <Lock size={16}/>
                        : <Play size={16}/>
                      }
                    </div>

                    {/* Title */}
                    <div className="flex-1">
                      <p className={`font-bold transition-colors
                                    ${canAccess
                                      ? 'text-[#0a0b0f] group-hover:text-[#D4A843]'
                                      : 'text-gray-500'
                                    }`}>
                        {lecture.lectureTitle}
                      </p>
                      {lecture.duration ? (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {lecture.duration} mins
                        </p>
                      ) : null}
                    </div>

                    {/* Badge */}
                    {lecture.isPreviewFree ? (
                      <span className="flex items-center gap-1.5 bg-green-50
                                       text-green-600 text-xs font-bold
                                       px-3 py-1.5 rounded-xl flex-shrink-0">
                        <Globe size={12}/> Free
                      </span>
                    ) : !user ? (
                      <span className="flex items-center gap-1.5 bg-[#D4A843]/10
                                       text-[#D4A843] text-xs font-bold
                                       px-3 py-1.5 rounded-xl flex-shrink-0">
                        <Lock size={12}/> Login
                      </span>
                    ) : !isEnrolled ? (
                      <span className="flex items-center gap-1.5 bg-gray-50
                                       text-gray-400 text-xs font-bold
                                       px-3 py-1.5 rounded-xl flex-shrink-0">
                        <Lock size={12}/> Enroll
                      </span>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        
            </div>
          </div>
  );
};
export default CourseDetailPage;