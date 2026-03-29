import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { 
    BiPlayCircle, 
    BiLockAlt, 
    BiChevronLeft, 
    BiCheckCircle, 
    BiLoaderAlt 
} from "react-icons/bi";

const ViewCourse = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    
    // 1. Get Auth & Course data from Redux
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const { courseData } = useSelector((state) => state.course);

    // 2. Local States
    const [currentCourse, setCurrentCourse] = useState(null);
    const [lectures, setLectures] = useState([]);
    const [selectedLecture, setSelectedLecture] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEnrolled, setIsEnrolled] = useState(false);

    // 3. Fetch Course and Lecture Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get Specific Course Details
                const courseRes = await axios.get(`http://localhost:8000/api/course/get-course/${courseId}`, { withCredentials: true });
                const course = courseRes.data;
                setCurrentCourse(course);

                // Check Enrollment Status
                if (user && course.enrolled?.includes(user._id)) {
                    setIsEnrolled(true);
                    // Fetch Lectures only if enrolled
                    const lecRes = await axios.get(`http://localhost:8000/api/course/course-lecture/${courseId}`, { withCredentials: true });
                    setLectures(lecRes.data);
                    
                    // Default to the first lecture
                    if (lecRes.data.length > 0) {
                        setSelectedLecture(lecRes.data[0]);
                    }
                } else {
                    setIsEnrolled(false);
                }
            } catch (error) {
                console.error("Error fetching course content", error);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchData();
        } else {
            navigate('/login');
        }
    }, [courseId, user, isAuthenticated, navigate]);

    if (loading) return (
        <div className="h-screen flex items-center justify-center">
            <BiLoaderAlt className="animate-spin text-4xl text-black" />
        </div>
    );

    // 4. Access Denied UI
    if (!isEnrolled) return (
        <div className="min-h-screen flex flex-col items-center justify-center p-5 text-center bg-gray-50">
            <BiLockAlt className="text-6xl text-red-400 mb-4" />
            <h1 className="text-2xl font-bold text-gray-800">Access Denied</h1>
            <p className="text-gray-500 mt-2">You must be enrolled in this course to view the lectures.</p>
            <button 
                onClick={() => navigate(`/course-detail/${courseId}`)}
                className="mt-6 bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all"
            >
                Go to Course Page
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-white pt-[80px] flex flex-col lg:flex-row">
            
            {/* --- Left Side: Video Player & Info --- */}
            <div className="flex-1 p-5 lg:p-10 border-r border-gray-100">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-black mb-6 transition-all"
                >
                    <BiChevronLeft size={20} /> Back to Course Info
                </button>

                {/* Video Container */}
                <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
                    {selectedLecture?.videoUrl ? (
                        <video 
                            key={selectedLecture._id} // Key forces re-render on lecture change
                            controls 
                            controlsList="nodownload"
                            className="w-full h-full"
                        >
                            <source src={selectedLecture.videoUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-white gap-4">
                            <BiPlayCircle size={60} className="text-gray-600" />
                            <p className="text-gray-400">No video available for this lecture yet.</p>
                        </div>
                    )}
                </div>

                {/* Lecture Details */}
                <div className="mt-8">
                    <h1 className="text-2xl font-bold text-gray-800">{selectedLecture?.title}</h1>
                    <p className="text-gray-400 text-sm mt-2 uppercase tracking-widest font-bold">
                        Course: {currentCourse?.title}
                    </p>
                    <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <p className="text-sm text-blue-700 flex items-center gap-2">
                            <BiCheckCircle /> Currently watching lecture {lectures.indexOf(selectedLecture) + 1} of {lectures.length}
                        </p>
                    </div>
                </div>
            </div>

            {/* --- Right Side: Playlist Sidebar --- */}
            <div className="w-full lg:w-[400px] bg-gray-50 h-auto lg:h-[calc(100vh-80px)] overflow-y-auto p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-6 px-2">Course Lectures</h2>
                <div className="space-y-3">
                    {lectures.map((lec, index) => (
                        <button 
                            key={lec._id}
                            onClick={() => setSelectedLecture(lec)}
                            className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
                                selectedLecture?._id === lec._id 
                                ? "bg-black text-white border-black shadow-lg" 
                                : "bg-white text-gray-700 border-gray-100 hover:border-gray-300"
                            }`}
                        >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                                selectedLecture?._id === lec._id ? "bg-gray-800" : "bg-gray-100"
                            }`}>
                                {index + 1}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold truncate max-w-[200px]">{lec.title}</p>
                                <span className={`text-[10px] uppercase font-bold ${
                                    selectedLecture?._id === lec._id ? "text-gray-400" : "text-gray-400"
                                }`}>
                                    Lecture Video
                                </span>
                            </div>
                            {lec.videoUrl && <BiPlayCircle className="text-xl" />}
                        </button>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default ViewCourse;