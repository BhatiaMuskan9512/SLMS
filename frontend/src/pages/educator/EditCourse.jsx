// import React, { useEffect, useState } from 'react';
// import { useNavigate, useParams, Link } from 'react-router-dom';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import { 
//     BiArrowBack, 
//     BiCloudUpload, 
//     BiPlus, 
//     BiTrash, 
//     BiCheckCircle, 
//     BiVideo 
// } from "react-icons/bi";

// const EditCourse = () => {
//     const navigate = useNavigate();
//     const { courseId } = useParams();

//     // --- States ---
//     const [course, setCourse] = useState(null);
//     const [lectures, setLectures] = useState([]);
//     const [thumbnail, setThumbnail] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [fetching, setFetching] = useState(true);

//     // 1. Fetch Course and Lecture Data
//     const fetchCourseDetails = async () => {
//         try {
//             const res = await axios.get(`http://localhost:8000/api/course/get-course/${courseId}`, { withCredentials: true });
//             setCourse(res.data);
            
//             const lecRes = await axios.get(`http://localhost:8000/api/course/course-lecture/${courseId}`, { withCredentials: true });
//             setLectures(lecRes.data);
//         } catch (error) {
//             toast.error("Failed to load course details");
//         } finally {
//             setFetching(false);
//         }
//     };

//     useEffect(() => {
//         fetchCourseDetails();
//     }, [courseId]);

//     // 2. Handle Thumbnail Upload & Metadata Update
//     const handleUpdateCourse = async (e) => {
//         e.preventDefault();
//         setLoading(true);

//         const formData = new FormData();
//         if (thumbnail) formData.append("thumbnail", thumbnail);
//         formData.append("title", course.title);
//         formData.append("category", course.category);
//         formData.append("price", course.price);
//         formData.append("isPublished", course.isPublished);

//         try {
//             await axios.post(`http://localhost:8000/api/course/edit-course/${courseId}`, formData, { withCredentials: true });
//             toast.success("Course updated successfully!");
//             fetchCourseDetails(); // Refresh data
//         } catch (error) {
//             toast.error("Update failed");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // 3. Delete Lecture Logic
//     const handleDeleteLecture = async (lectureId) => {
//         if (!window.confirm("Are you sure you want to delete this lecture?")) return;
//         try {
//             await axios.delete(`http://localhost:8000/api/course/remove-lecture/${lectureId}`, { withCredentials: true });
//             toast.success("Lecture removed");
//             fetchCourseDetails();
//         } catch (error) {
//             toast.error("Delete failed");
//         }
//     };

//     if (fetching) return <div className="p-10 text-center font-bold">Loading Course Data...</div>;

//     return (
//         <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
//             {/* --- Header --- */}
          
//             <div className="max-w-5xl mx-auto mb-8 flex justify-between items-center">
//                 <button onClick={() => navigate('/educator/courses')} className="flex items-center gap-2 text-gray-500 hover:text-black">
//                     <BiArrowBack /> Back
//                 </button>
//                 <h1 className="text-2xl font-bold text-gray-800">Edit Course</h1>
//                 <div className="w-[80px]"></div> {/* Spacer */}
//             </div>

//             <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                
//                 {/* --- Left Column: Course Details Form --- */}
//                 <div className="lg:col-span-2 space-y-6">
//                     <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
//                         <form onSubmit={handleUpdateCourse} className="space-y-4">
//                             <div>
//                                 <label className="block text-sm font-bold mb-2">Course Title</label>
//                                 <input 
//                                     type="text" 
//                                     className="w-full p-3 border rounded-xl outline-none focus:border-black"
//                                     value={course?.title}
//                                     onChange={(e) => setCourse({...course, title: e.target.value})}
//                                 />
//                             </div>

//                             <div className="grid grid-cols-2 gap-4">
//                                 <div>
//                                     <label className="block text-sm font-bold mb-2">Price (₹)</label>
//                                     <input 
//                                         type="number" 
//                                         className="w-full p-3 border rounded-xl outline-none"
//                                         value={course?.price}
//                                         onChange={(e) => setCourse({...course, price: e.target.value})}
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-bold mb-2">Status</label>
//                                     <select 
//                                         className="w-full p-3 border rounded-xl outline-none"
//                                         value={course?.isPublished}
//                                         onChange={(e) => setCourse({...course, isPublished: e.target.value === 'true'})}
//                                     >
//                                         <option value="false">Draft</option>
//                                         <option value="true">Published</option>
//                                     </select>
//                                 </div>
//                             </div>

//                             {/* Thumbnail Preview & Upload
//                             <div>
//                                 <label className="block text-sm font-bold mb-2">Course Thumbnail</label>
//                                 <div className="flex items-center gap-4">
//                                     <img 
//                                         src={thumbnail ? URL.createObjectURL(thumbnail) : course?.thumbnail} 
//                                         className="w-32 h-20 object-cover rounded-lg border" 
//                                         alt="Preview"
//                                     />
//                                     <label className="cursor-pointer bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center gap-2 text-sm">
//                                         <BiCloudUpload className="text-xl" /> Change Image
//                                         <input type="file" hidden onChange={(e) => setThumbnail(e.target.files[0])} />
//                                     </label>
//                                 </div>
//                             </div> */}

//                             <button 
//                                 type="submit" 
//                                 disabled={loading}
//                                 className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-all"
//                             >
//                                 {loading ? "Saving Changes..." : "Save Course Details"}
//                             </button>
//                         </form>
//                     </div>
//                 </div>

//                 {/* --- Right Column: Lecture Management --- */}
//                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
//                     <div className="flex justify-between items-center mb-6">
//                         <h2 className="font-bold text-gray-800">Lectures ({lectures.length})</h2>
//                         <Link 
//                             to={`/educator/create-lecture/${courseId}`}
//                             className="p-2 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200"
//                         >
//                             <BiPlus size={20} />
//                         </Link>
//                     </div>

//                     <div className="space-y-3">
                        
//                         {/* {lectures?.map((lec, index) => (
//                             <div key={lec._id} className="p-3 border rounded-xl flex items-center justify-between hover:bg-gray-50 group">
//                                 <div className="flex items-center gap-3">
//                                     <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-xs font-bold">
//                                         {index + 1}
//                                     </div>
//                                     <div>
//                                         <p className="text-sm font-medium text-gray-700 truncate max-w-[120px]">{lec.title}</p>
//                                         {lec.videoUrl ? (
//                                             <span className="text-[10px] text-green-500 flex items-center gap-1"><BiCheckCircle /> Video Uploaded</span>
//                                         ) : (
//                                             <span className="text-[10px] text-red-400">No Video</span>
//                                         )}
//                                     </div>
//                                 </div>
//                                 <div className="flex items-center gap-1">
//                                     <Link to={`/educator/edit-lecture/${lec._id}`} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-md">
//                                         <BiVideo size={18} />
//                                     </Link>
//                                     <button onClick={() => handleDeleteLecture(lec._id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-md">
//                                         <BiTrash size={18} />
//                                     </button>
//                                 </div>
//                             </div>
//                         ))} */}
                        
//                     </div>
//                 </div>

//             </div>
//         </div>
//     );
// };

// export default EditCourse;
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
    BiArrowBack, 
    BiCloudUpload, 
    BiPlus, 
    BiTrash, 
    BiCheckCircle, 
    BiVideo 
} from "react-icons/bi";

const EditCourse = () => {
    const navigate = useNavigate();
    const { courseId } = useParams();

    // --- States ---
    const [course, setCourse] = useState({
        title: "",
        category: "",
        price: 0,
        isPublished: false,
        thumbnail: ""
    });
    const [lectures, setLectures] = useState([]);
    const [thumbnail, setThumbnail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    // 1. Fetch Course and Lecture Data
    const fetchCourseDetails = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/api/course/get-course/${courseId}`, { withCredentials: true });
            setCourse(res.data);
            
            // Yahan hum lectures array set kar rahe hain jo backend se aa raha hai
            const lecRes = await axios.get(`http://localhost:8000/api/course/course-lecture/${courseId}`, { withCredentials: true });
            // Backend response check karein (kuch cases mein res.data.course.lectures hota hai)
            setLectures(lecRes.data.course?.lectures || lecRes.data || []);
        } catch (error) {
            toast.error("Failed to load course details");
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchCourseDetails();
    }, [courseId]);

    // 2. Handle Thumbnail Upload & Metadata Update
    // const handleUpdateCourse = async (e) => {
    //     e.preventDefault();
    //     setLoading(true);

    //     const formData = new FormData();
    //     if (thumbnail) formData.append("thumbnail", thumbnail);
    //     formData.append("title", course.title);
    //     formData.append("category", course.category);
    //     formData.append("price", course.price);
    //     formData.append("isPublished", course.isPublished);

    //     try {
    //         await axios.post(`http://localhost:8000/api/course/edit-course/${courseId}`, formData, { withCredentials: true });
    //         toast.success("Course updated successfully!");
    //         fetchCourseDetails(); // Refresh data
    //     } catch (error) {
    //         toast.error("Update failed");
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    const handleUpdateCourse = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    if (thumbnail) formData.append("thumbnail", thumbnail);
    
    // In fields ko dhyan se check karein
    formData.append("title", course.title);
    formData.append("category", course.category || "Web Development"); // Default value agar khali ho
    formData.append("price", course.price || 0);
    formData.append("isPublished", course.isPublished);

    try {
        const res = await axios.post(
            `http://localhost:8000/api/course/edit-course/${courseId}`, 
            formData, 
            { 
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' } 
            }
        );
        toast.success("Course updated successfully!");
        fetchCourseDetails(); 
    } catch (error) {
        console.error(error.response?.data); // Isse console mein error check karein
        toast.error(error.response?.data?.message || "Update failed");
    } finally {
        setLoading(false);
    }
    };

    // 3. Delete Lecture Logic
    const handleDeleteLecture = async (lectureId) => {
        if (!window.confirm("Are you sure you want to delete this lecture?")) return;
        try {
            await axios.delete(`http://localhost:8000/api/course/remove-lecture/${lectureId}`, { withCredentials: true });
            toast.success("Lecture removed");
            fetchCourseDetails(); // Refresh list after delete
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    if (fetching) return <div className="p-10 text-center font-bold text-gray-500">Loading Course Data...</div>;

    return (
        <div className="p-4 sm:p-8 bg-[#f8fafc] min-h-screen">
            {/* --- Header --- */}
            <div className="max-w-6xl mx-auto mb-8 flex justify-between items-center">
                <button onClick={() => navigate('/educator/courses')} className="flex items-center gap-2 text-gray-500 hover:text-[#c5a358] font-semibold transition-colors">
                    <BiArrowBack /> Back to Courses
                </button>
                <h1 className="text-3xl font-black text-[#1e293b]">Edit Course</h1>
                <div className="w-[100px]"></div>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* --- Left Column: Course Details Form --- */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                        <form onSubmit={handleUpdateCourse} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Course Title</label>
                                <input 
                                    type="text" 
                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#c5a358] focus:border-transparent transition-all"
                                    value={course?.title || ""}
                                    onChange={(e) => setCourse({...course, title: e.target.value})}
                                    placeholder="Enter course title"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Price (₹)</label>
                                    <input 
                                        type="number" 
                                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#c5a358]"
                                        value={course?.price || 0}
                                        onChange={(e) => setCourse({...course, price: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Publication Status</label>
                                    <select 
                                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#c5a358] appearance-none"
                                        value={course?.isPublished}
                                        onChange={(e) => setCourse({...course, isPublished: e.target.value === 'true'})}
                                    >
                                        <option value="false">Draft (Hidden)</option>
                                        <option value="true">Published (Live)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Thumbnail Section */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Course Thumbnail</label>
                                <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                                    <img 
                                        src={thumbnail ? URL.createObjectURL(thumbnail) : course?.thumbnail || "https://via.placeholder.com/150"} 
                                        className="w-48 h-28 object-cover rounded-xl shadow-md border-2 border-white" 
                                        alt="Thumbnail Preview"
                                    />
                                    <label className="cursor-pointer bg-[#1e293b] text-white px-6 py-3 rounded-xl hover:bg-slate-800 flex items-center gap-2 font-bold transition-all shadow-lg active:scale-95">
                                        <BiCloudUpload className="text-xl text-[#c5a358]" /> Change Image
                                        <input type="file" hidden onChange={(e) => setThumbnail(e.target.files[0])} />
                                    </label>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-[#c5a358] text-white py-4 rounded-2xl font-black text-lg hover:bg-[#b08e48] transition-all shadow-xl shadow-[#c5a358]/20 disabled:bg-slate-300"
                            >
                                {loading ? "Updating Course..." : "Save Course Details"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* --- Right Column: Lecture Management --- */}
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col h-fit">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="font-black text-xl text-[#1e293b]">Lectures</h2>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Total: {lectures.length}</p>
                        </div>
                        <Link 
                            to={`/educator/create-lecture/${courseId}`}
                            className="w-12 h-12 bg-[#c5a358]/10 text-[#c5a358] rounded-2xl flex items-center justify-center hover:bg-[#c5a358] hover:text-white transition-all shadow-sm"
                        >
                            <BiPlus size={28} />
                        </Link>
                    </div>

                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                        {lectures && lectures.length > 0 ? (
                            lectures.map((lec, index) => (
                                <div key={lec._id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between group hover:border-[#c5a358]/50 hover:bg-white transition-all shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white border border-slate-200 text-[#1e293b] rounded-xl flex items-center justify-center text-sm font-black shadow-sm group-hover:bg-[#c5a358] group-hover:text-white transition-colors">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800 truncate max-w-[120px]">
                                                {lec.lectureTitle}
                                            </p>
                                            {lec.videoUrl ? (
                                                <span className="text-[10px] text-emerald-500 flex items-center gap-1 font-bold mt-1 uppercase tracking-tighter">
                                                    <BiCheckCircle /> Video Ready
                                                </span>
                                            ) : (
                                                <span className="text-[10px] text-rose-400 font-bold mt-1 uppercase tracking-tighter italic">
                                                    Missing Video
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Link 
                                            to={`/educator/edit-lecture/${lec._id}`} 
                                            className="p-2.5 text-blue-500 bg-white border border-slate-100 rounded-xl hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                                        >
                                            <BiVideo size={20} />
                                        </Link>
                                        <button 
                                            onClick={() => handleDeleteLecture(lec._id)} 
                                            className="p-2.5 text-rose-400 bg-white border border-slate-100 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                                        >
                                            <BiTrash size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 px-4 border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/50">
                                <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">No Lectures Yet</p>
                                <p className="text-[11px] text-slate-300 mt-2 italic">Click the + button to start adding content</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default EditCourse;