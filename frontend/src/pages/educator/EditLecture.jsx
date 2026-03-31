// import React, { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import { 
//     BiArrowBack, 
//     BiCloudUpload, 
//     BiCheckCircle, 
//     BiLoaderAlt,
//     BiMoviePlay
// } from "react-icons/bi";

// const EditLecture = () => {
//     const navigate = useNavigate();
//     const { lectureId } = useParams();

//     // --- States ---
//     const [title, setTitle] = useState("");
//     const [video, setVideo] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [fetching, setFetching] = useState(true);

//     // 1. Fetch Existing Lecture Data (Title check karne ke liye)
//     useEffect(() => {
//         const fetchLecture = async () => {
//             try {
//                 // Check karein aapka backend route kya hai, maine 'edit-lecture' assume kiya hai fetching ke liye bhi
//                 const res = await axios.get(`http://localhost:8000/api/course/get-lecture/${lectureId}`, { withCredentials: true });
//                 setTitle(res.data.lectureTitle || "");
//             } catch (error) {
//                 console.error("Fetch error:", error);
//             } finally {
//                 setFetching(false);
//             }
//         };
//         fetchLecture();
//     }, [lectureId]);

//     // 2. Handle Update & Video Upload
//     const handleUpdateLecture = async (e) => {
//         e.preventDefault();
        
//         if (!title.trim()) return toast.error("Please enter a lecture title");

//         setLoading(true);

//         // FormData is must for file uploads
//         const formData = new FormData();
        
//         // BACKEND FIX: 'title' ki jagah 'lectureTitle' bhej rahe hain
//         formData.append("lectureTitle", title); 
        
//         if (video) {
//             // Multer 'video' key expect karta hai aapke controller logic mein
//             formData.append("video", video); 
//         }

//         try {
//             const response = await axios.post(
//                 `http://localhost:8000/api/course/edit-lecture/${lectureId}`, 
//                 formData, 
//                 { 
//                     withCredentials: true,
//                     headers: { 'Content-Type': 'multipart/form-data' }
//                 }
//             );

//             if (response.data) {
//                 toast.success("Lecture & Video updated successfully!");
//                 navigate(-1); // Wapas Edit Course page par bhejne ke liye
//             }
//         } catch (error) {
//             console.error(error);
//             toast.error(error.response?.data?.message || "Failed to upload video");
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (fetching) return <div className="p-20 text-center font-bold text-slate-400">Loading Lecture Data...</div>;

//     return (
//         <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6">
            
//             {/* --- Back Link --- */}
//             <div className="w-full max-w-[550px] mb-6">
//                 <button 
//                     onClick={() => navigate(-1)} 
//                     className="flex items-center gap-2 text-slate-500 hover:text-[#c5a358] font-bold transition-all"
//                 >
//                     <BiArrowBack size={20}/> Back to Course
//                 </button>
//             </div>

//             {/* --- Upload Card --- */}
//             <div className="w-full max-w-[550px] bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-10">
//                 <div className="flex flex-col items-center mb-10 text-center">
//                     <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-[1.5rem] flex items-center justify-center text-4xl mb-5 shadow-inner">
//                         <BiMoviePlay />
//                     </div>
//                     <h1 className="text-3xl font-black text-[#1e293b]">Edit Lesson</h1>
//                     <p className="text-slate-400 mt-2 font-medium">
//                         Update your content and upload high-quality video.
//                     </p>
//                 </div>

//                 <form onSubmit={handleUpdateLecture} className="space-y-8">
//                     {/* Title Input */}
//                     <div className="space-y-3">
//                         <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Lecture Title</label>
//                         <input 
//                             type="text" 
//                             placeholder="Enter new title..."
//                             className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-[#1e293b]"
//                             value={title}
//                             onChange={(e) => setTitle(e.target.value)}
//                             required
//                         />
//                     </div>

//                     {/* Drag & Drop Styled Video Upload */}
//                     <div className="space-y-3">
//                         <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Video Lesson (.mp4)</label>
//                         <div className="relative group">
//                             <input 
//                                 type="file" 
//                                 accept="video/*"
//                                 className="hidden" 
//                                 id="video-upload"
//                                 onChange={(e) => setVideo(e.target.files[0])}
//                             />
//                             <label 
//                                 htmlFor="video-upload"
//                                 className={`flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-[2rem] cursor-pointer transition-all ${
//                                     video ? "border-emerald-400 bg-emerald-50/30" : "border-slate-200 hover:border-blue-400 bg-slate-50/50"
//                                 }`}
//                             >
//                                 {video ? (
//                                     <div className="flex flex-col items-center text-emerald-600 animate-in zoom-in duration-300">
//                                         <BiCheckCircle className="text-5xl mb-2" />
//                                         <span className="text-sm font-black text-center px-4 truncate w-full">{video.name}</span>
//                                         <span className="text-[10px] font-black uppercase mt-1 tracking-tighter bg-emerald-100 px-2 py-0.5 rounded">Ready to Sync</span>
//                                     </div>
//                                 ) : (
//                                     <div className="flex flex-col items-center text-slate-400 group-hover:scale-105 transition-transform">
//                                         <BiCloudUpload className="text-5xl mb-2 group-hover:text-blue-500" />
//                                         <span className="text-sm font-bold">Choose a video file</span>
//                                         <span className="text-[10px] mt-1 italic">Maximum size recommended: 50MB</span>
//                                     </div>
//                                 )}
//                             </label>
//                         </div>
//                     </div>

//                     {/* Action Button */}
//                     <button 
//                         type="submit"
//                         disabled={loading}
//                         className={`w-full py-5 rounded-[1.5rem] font-black text-white transition-all shadow-xl flex items-center justify-center gap-3 ${
//                             loading ? "bg-slate-300 cursor-not-allowed shadow-none" : "bg-[#1e293b] hover:bg-slate-800 shadow-slate-200 active:scale-[0.98]"
//                         }`}
//                     >
//                         {loading ? (
//                             <>
//                                 <BiLoaderAlt className="animate-spin text-2xl" />
//                                 Syncing with Cloudinary...
//                             </>
//                         ) : (
//                             "Update & Save Content"
//                         )}
//                     </button>
                    
//                     {loading && (
//                         <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse">
//                             Processing media. Do not refresh or close.
//                         </p>
//                     )}
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default EditLecture;

// import React, { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import { BiArrowBack, BiLink, BiLoaderAlt, BiMoviePlay } from "react-icons/bi";

// const EditLecture = () => {
//     const navigate = useNavigate();
//     const { lectureId } = useParams();

//     const [title, setTitle] = useState("");
//     const [videoFile, setVideoFile] = useState(null); // Ab hum sirf string (link) save karenge
//     const [loading, setLoading] = useState(false);
//     const [fetching, setFetching] = useState(true);

//     useEffect(() => {
//         const fetchLecture = async () => {
//             try {
//                 const res = await axios.get(`http://localhost:8000/api/course/get-lecture/${lectureId}`, { withCredentials: true });
//                 setTitle(res.data.lectureTitle || "");
//                 setVideoLink(res.data.videoUrl || ""); // Purana link fetch karein
//             } catch (error) {
//                 console.error("Fetch error:", error);
//             } finally {
//                 setFetching(false);
//             }
//         };
//         fetchLecture();
//     }, [lectureId]);

//     const handleUpdateLecture = async (e) => {
//         e.preventDefault();
//         if (!title.trim()) return toast.error("Please enter a lecture title");
//         if (!videoLink.trim()) return toast.error("Please provide a video link");

//         setLoading(true);

//         try {
//             // Ab hum FormData ki jagah simple JSON bhej rahe hain kyunki file nahi hai
//             const response = await axios.post(
//                 `http://localhost:8000/api/course/edit-lecture/${lectureId}`, 
//                 { 
//                     lectureTitle: title, 
//                     videoUrl: videoLink // Direct link bhej rahe hain
//                 }, 
//                 { withCredentials: true }
//             );

//             if (response.data) {
//                 toast.success("Lecture link updated!");
//                 navigate(-1);
//             }
//         } catch (error) {
//             toast.error(error.response?.data?.message || "Failed to update");
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (fetching) return <div className="p-20 text-center font-bold text-slate-400">Loading...</div>;

//     return (
//         <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6">
//             <div className="w-full max-w-[550px] mb-6">
//                 <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-[#c5a358] font-bold transition-all">
//                     <BiArrowBack size={20}/> Back
//                 </button>
//             </div>

//             <div className="w-full max-w-[550px] bg-white rounded-[2.5rem] shadow-xl p-10 border border-slate-100">
//                 <div className="flex flex-col items-center mb-10 text-center">
//                     <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-[1.5rem] flex items-center justify-center text-4xl mb-5">
//                         <BiMoviePlay />
//                     </div>
//                     <h1 className="text-3xl font-black text-[#1e293b]">Lecture Link</h1>
//                     <p className="text-slate-400 mt-2 font-medium text-sm">Paste a video URL (YouTube/Cloudinary) to update this lesson.</p>
//                 </div>

//                 <form onSubmit={handleUpdateLecture} className="space-y-8">
//                     <div className="space-y-3">
//                         <label className="text-xs font-black uppercase text-slate-400 ml-1">Lecture Title</label>
//                         <input 
//                             type="text" 
//                             className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:border-blue-500 transition-all font-bold"
//                             value={title}
//                             onChange={(e) => setTitle(e.target.value)}
//                         />
//                     </div>

//                     <div className="space-y-3">
//                         <label className="text-xs font-black uppercase text-slate-400 ml-1">Video URL / Link</label>
//                         <div className="relative">
//                             <BiLink className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
//                             <input 
//                                 type="text" 
//                                 placeholder="https://example.com/video.mp4"
//                                 className="w-full pl-12 pr-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:border-blue-500 transition-all font-medium text-blue-600"
//                                 value={videoLink}
//                                 onChange={(e) => setVideoLink(e.target.value)}
//                             />
//                         </div>
//                     </div>

//                     <button 
//                         type="submit"
//                         disabled={loading}
//                         className="w-full py-5 rounded-[1.5rem] font-black text-white bg-[#1e293b] hover:bg-slate-800 transition-all flex items-center justify-center gap-3 disabled:bg-slate-300"
//                     >
//                         {loading ? <BiLoaderAlt className="animate-spin text-2xl" /> : "Save Link"}
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };
// export default EditLecture;


import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BiArrowBack, BiCloudUpload, BiCheckCircle, BiLoaderAlt, BiMoviePlay } from "react-icons/bi";

const EditLecture = () => {
    const navigate = useNavigate();
    const { lectureId } = useParams();

    const [title, setTitle] = useState("");
    const [videoFile, setVideoFile] = useState(null); // 1. Link ki jagah File state
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        const fetchLecture = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/course/get-lecture/${lectureId}`, { withCredentials: true });
                setTitle(res.data.lectureTitle || "");
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setFetching(false);
            }
        };
        fetchLecture();
    }, [lectureId]);

    const handleUpdateLecture = async (e) => {
        e.preventDefault();
        if (!title.trim()) return toast.error("Please enter a lecture title");

        setLoading(true);

        // 2. FormData banayein taaki file upload ho sake
        const formData = new FormData();
        formData.append("lectureTitle", title);
        if (videoFile) {
            formData.append("video", videoFile); // 'video' key backend upload.single("video") se match honi chahiye
        }

        try {
            const response = await axios.post(
                `http://localhost:8000/api/course/edit-lecture/${lectureId}`, 
                formData, 
                { 
                    withCredentials: true,
                    headers: { 'Content-Type': 'multipart/form-data' } // Important for files
                }
            );

            if (response.data) {
                toast.success("Video Uploaded Successfully!");
                navigate(-1);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Upload failed");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="p-20 text-center font-bold text-slate-400">Loading...</div>;

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-[550px] mb-6">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-[#c5a358] font-bold transition-all">
                    <BiArrowBack size={20}/> Back
                </button>
            </div>

            <div className="w-full max-w-[550px] bg-white rounded-[2.5rem] shadow-xl p-10 border border-slate-100">
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-[1.5rem] flex items-center justify-center text-4xl mb-5">
                        <BiMoviePlay />
                    </div>
                    <h1 className="text-3xl font-black text-[#1e293b]">Upload Video</h1>
                    <p className="text-slate-400 mt-2 font-medium text-sm">Select a video file to upload for this lesson</p>
                </div>

                <form onSubmit={handleUpdateLecture} className="space-y-6">
                    {/* Title Input */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-slate-400 ml-1">Lecture Title</label>
                        <input 
                            type="text" 
                            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    {/* 3. File Input Area */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-slate-400 ml-1">Select Video File</label>
                        <div className="relative">
                            <input 
                                type="file" 
                                accept="video/*"
                                id="video-input"
                                className="hidden"
                                onChange={(e) => setVideoFile(e.target.files[0])}
                            />
                            <label 
                                htmlFor="video-input"
                                className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-[2rem] cursor-pointer transition-all ${
                                    videoFile ? "border-emerald-400 bg-emerald-50/30 text-emerald-600" : "border-slate-200 hover:border-blue-400 bg-slate-50/50 text-slate-400"
                                }`}
                            >
                                {videoFile ? (
                                    <>
                                        <BiCheckCircle size={40} className="mb-2" />
                                        <span className="text-sm font-bold truncate px-6 w-full text-center">{videoFile.name}</span>
                                    </>
                                ) : (
                                    <>
                                        <BiCloudUpload size={40} className="mb-2" />
                                        <span className="text-sm font-bold">Choose Video File</span>
                                    </>
                                )}
                            </label>
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={loading}
                        className={`w-full py-5 rounded-[1.5rem] font-black text-white shadow-xl transition-all flex items-center justify-center gap-3 ${
                            loading ? "bg-slate-300" : "bg-[#1e293b] hover:bg-slate-800"
                        }`}
                    >
                        {loading ? <><BiLoaderAlt className="animate-spin" /> Uploading...</> : "Update & Upload Video"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditLecture;