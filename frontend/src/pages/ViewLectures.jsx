import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
    BiPlayCircle, 
    BiChevronLeft, 
    BiLockAlt, 
    BiLoaderAlt, 
    BiCheckCircle 
} from "react-icons/bi";

const ViewLectures = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();

    // 1. Get Auth state from Redux
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    // 2. Local States
    const [lectures, setLectures] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [courseTitle, setCourseTitle] = useState("");
    const [loading, setLoading] = useState(true);
    const [hasAccess, setHasAccess] = useState(false);

    // 3. Fetch Data and Verify Access
    useEffect(() => {
        const fetchContent = async () => {
            try {
                // Fetch course details to check enrollment
                const courseRes = await axios.get(`http://localhost:8000/api/course/get-course/${courseId}`, { withCredentials: true });
                const course = courseRes.data;
                setCourseTitle(course.title);

                // Verification Logic: User must be logged in AND enrolled in this specific course
                if (user && course.enrolled?.includes(user._id)) {
                    setHasAccess(true);
                    
                    // Fetch the actual lectures for this course
                    const lecRes = await axios.get(`http://localhost:8000/api/course/course-lecture/${courseId}`, { withCredentials: true });
                    setLectures(lecRes.data);

                    // Auto-select the first lecture if it exists
                    if (lecRes.data.length > 0) {
                        setSelectedVideo(lecRes.data[0]);
                    }
                } else {
                    setHasAccess(false);
                    toast.error("You are not enrolled in this course.");
                }
            } catch (error) {
                console.error("Error loading lectures:", error);
                toast.error("Failed to load course content.");
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchContent();
        } else {
            navigate('/login');
        }
    }, [courseId, user, isAuthenticated, navigate]);

    // 4. Loading UI
    if (loading) {
        return (
            <div className="h-screen flex flex-col items-center justify-center gap-4">
                <BiLoaderAlt className="animate-spin text-5xl text-black" />
                <p className="text-gray-500 font-medium">Loading your classroom...</p>
            </div>
        );
    }

    // 5. Access Denied UI
    if (!hasAccess) {
        return (
            <div className="h-screen flex flex-col items-center justify-center text-center p-5">
                <BiLockAlt className="text-7xl text-gray-200 mb-4" />
                <h1 className="text-2xl font-bold text-gray-800">Premium Content</h1>
                <p className="text-gray-500 mt-2">Please enroll in this course to access the video lectures.</p>
                <button 
                    onClick={() => navigate(`/course-detail/${courseId}`)}
                    className="mt-6 bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg"
                >
                    Back to Course Info
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pt-[80px] flex flex-col lg:flex-row">
            
            {/* --- Left Column: Video Player --- */}
            <div className="flex-1 p-4 sm:p-8 lg:p-12 border-r border-gray-100">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-black mb-8 transition-colors text-sm font-bold"
                >
                    <BiChevronLeft size={20} /> RETURN TO DASHBOARD
                </button>

                <div className="w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl relative">
                    {selectedVideo?.videoUrl ? (
                        <video 
                            key={selectedVideo._id} // Important: Forces video reload on source change
                            controls 
                            controlsList="nodownload"
                            className="w-full h-full object-contain"
                        >
                            <source src={selectedVideo.videoUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-white gap-4 italic">
                            <BiPlayCircle size={60} className="text-gray-700" />
                            <p className="text-gray-500">Video coming soon...</p>
                        </div>
                    )}
                </div>

                <div className="mt-10">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{selectedVideo?.title}</h1>
                    <div className="flex items-center gap-3 mt-4 text-sm font-bold text-blue-600 bg-blue-50 w-fit px-4 py-2 rounded-full border border-blue-100">
                        <BiCheckCircle /> Currently Watching: {courseTitle}
                    </div>
                </div>
            </div>

            {/* --- Right Column: Lecture Sidebar --- */}
            <div className="w-full lg:w-[400px] bg-gray-50 h-auto lg:h-[calc(100vh-80px)] overflow-y-auto p-6 sm:p-8">
                <h3 className="text-lg font-bold text-gray-800 mb-8 px-2 flex items-center justify-between">
                    Course Content
                    <span className="text-[10px] bg-gray-200 px-2 py-1 rounded text-gray-600">
                        {lectures.length} LESSONS
                    </span>
                </h3>
                
                <div className="space-y-4">
                    {lectures.map((lec, index) => (
                        <button 
                            key={lec._id}
                            onClick={() => setSelectedVideo(lec)}
                            className={`w-full flex items-center gap-4 p-5 rounded-2xl border transition-all text-left group ${
                                selectedVideo?._id === lec._id 
                                ? "bg-black text-white border-black shadow-xl scale-[1.02]" 
                                : "bg-white text-gray-700 border-gray-100 hover:border-gray-300"
                            }`}
                        >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                                selectedVideo?._id === lec._id ? "bg-gray-800" : "bg-gray-100"
                            }`}>
                                {index + 1}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold truncate max-w-[200px]">{lec.title}</p>
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                                    {selectedVideo?._id === lec._id ? "Playing Now" : "Lecture Video"}
                                </span>
                            </div>
                            <BiPlayCircle className={`text-xl ${selectedVideo?._id === lec._id ? "text-white" : "text-gray-300 group-hover:text-black"}`} />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ViewLectures;