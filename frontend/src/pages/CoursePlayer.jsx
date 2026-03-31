import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BiArrowBack, BiPlay, BiLoaderAlt } from "react-icons/bi";

const CoursePlayer = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    
    const [course, setCourse] = useState(null);
    const [activeLecture, setActiveLecture] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                // Backend se course fetch karein (with lectures)
                const res = await axios.get(`http://localhost:8000/api/course/get-course/${courseId}`, {
                    withCredentials: true 
                });
                setCourse(res.data);
                if (res.data.lectures?.length > 0) {
                    setActiveLecture(res.data.lectures[0]);
                }
            } catch (error) {
                console.error("Error fetching course:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourseData();
    }, [courseId]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#F6F4EC]">
            <BiLoaderAlt className="text-5xl text-[#d4a843] animate-spin" />
        </div>
    );

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-[#F6F4EC] pt-[80px]">
            
            {/* --- Left Side: Video Player --- */}
            <div className="w-full lg:w-[70%] bg-[#0a0b0f] p-4 lg:p-8 flex flex-col">
                <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white flex items-center gap-2 mb-6 w-fit">
                    <BiArrowBack /> Back
                </button>

                <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
                    {activeLecture?.videoUrl ? (
                        <video src={activeLecture.videoUrl} controls autoPlay className="w-full h-full" />
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-500">No video available</div>
                    )}
                </div>

                <div className="mt-8 p-6 bg-white rounded-2xl shadow-sm">
                    <h1 className="text-2xl font-bold text-gray-900">{activeLecture?.lectureTitle}</h1>
                    <p className="text-gray-500 mt-1">{course?.title}</p>
                </div>
            </div>

            {/* --- Right Side: Lecture List --- */}
            <div className="w-full lg:w-[30%] bg-white border-l border-gray-100 overflow-y-auto lg:h-[calc(100vh-80px)]">
                <div className="p-6 border-b border-gray-50 bg-gray-50/50 sticky top-0 backdrop-blur-md">
                    <h2 className="text-xl font-bold text-gray-900">Course Content</h2>
                </div>
                <div className="flex flex-col">
                    {course?.lectures?.map((lecture, index) => (
                        <button 
                            key={lecture._id}
                            onClick={() => setActiveLecture(lecture)}
                            className={`p-5 text-left border-b border-gray-50 flex items-center gap-4 transition-all ${activeLecture?._id === lecture._id ? 'bg-[#d4a843]/10 border-l-4 border-l-[#d4a843]' : 'hover:bg-gray-50'}`}
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${activeLecture?._id === lecture._id ? 'bg-[#d4a843] text-white' : 'bg-gray-100 text-gray-400'}`}>
                                {index + 1}
                            </div>
                            <span className={`font-semibold ${activeLecture?._id === lecture._id ? 'text-[#8a5a00]' : 'text-gray-600'}`}>
                                {lecture.lectureTitle}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CoursePlayer;