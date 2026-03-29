import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BiPlayCircle, BiTimeFive, BiBarChartAlt, BiUserVoice, BiCheckShield, BiLoaderAlt } from "react-icons/bi";
import { setSingleCourse } from '../redux/courseSlice';

const CourseDetail = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const { singleCourse } = useSelector((state) => state.course);
    const [loading, setLoading] = useState(true);

    // 1. Fetch Course Details from Backend
    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/course/get-course/${courseId}`);
                dispatch(setSingleCourse(res.data));
            } catch (error) {
                toast.error("Course not found");
                navigate('/');
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [courseId, dispatch, navigate]);

    // 2. Enrollment Logic (Buy Course)
    const handleEnroll = async () => {
        if (!isAuthenticated) {
            toast.error("Please login to enroll");
            return navigate('/login');
        }

        try {
            const res = await axios.post(
                `http://localhost:8000/api/course/enroll/${courseId}`, 
                {}, 
                { withCredentials: true }
            );
            if (res.data.success) {
                toast.success("Successfully Enrolled!");
                navigate(`/view-lectures/${courseId}`);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Enrollment failed");
        }
    };

    if (loading) return (
        <div className="h-screen flex items-center justify-center">
            <BiLoaderAlt className="animate-spin text-4xl text-black" />
        </div>
    );

    const isEnrolled = singleCourse?.enrolled?.includes(user?._id);

    return (
        <div className="min-h-screen bg-white pt-[100px] pb-20 px-5 sm:px-10 lg:px-20 font-jakarta">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
                
                {/* --- Left Side: Course Info --- */}
                <div className="flex-1">
                    <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                        {singleCourse?.category}
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mt-6 leading-tight">
                        {singleCourse?.title}
                    </h1>
                    <p className="text-gray-500 mt-6 text-lg leading-relaxed">
                        {singleCourse?.description}
                    </p>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12 border-y border-gray-100 py-8">
                        <div className="flex items-center gap-3">
                            <BiTimeFive className="text-2xl text-gray-400" />
                            <div><p className="text-xs text-gray-400 font-bold uppercase">Duration</p><p className="font-bold">12h 30m</p></div>
                        </div>
                        <div className="flex items-center gap-3">
                            <BiBarChartAlt className="text-2xl text-gray-400" />
                            <div><p className="text-xs text-gray-400 font-bold uppercase">Level</p><p className="font-bold">Beginner</p></div>
                        </div>
                        <div className="flex items-center gap-3">
                            <BiUserVoice className="text-2xl text-gray-400" />
                            <div><p className="text-xs text-gray-400 font-bold uppercase">Language</p><p className="font-bold">Hindi/Eng</p></div>
                        </div>
                        <div className="flex items-center gap-3">
                            <BiCheckShield className="text-2xl text-gray-400" />
                            <div><p className="text-xs text-gray-400 font-bold uppercase">Certificate</p><p className="font-bold">Yes</p></div>
                        </div>
                    </div>
                </div>

                {/* --- Right Side: Pricing & Thumbnail --- */}
                <div className="w-full lg:w-[450px]">
                    <div className="bg-white rounded-[40px] border border-gray-100 shadow-2xl p-8 sticky top-[120px]">
                        <div className="relative group overflow-hidden rounded-3xl mb-8">
                            <img 
                                src={singleCourse?.thumbnail} 
                                alt="Thumbnail" 
                                className="w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <BiPlayCircle className="text-white text-6xl" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between mb-8 px-2">
                            <div>
                                <p className="text-gray-400 text-sm font-bold uppercase tracking-tighter">Full Course Access</p>
                                <h2 className="text-4xl font-black text-gray-900">₹{singleCourse?.price}</h2>
                            </div>
                            <span className="text-green-500 font-bold bg-green-50 px-3 py-1 rounded-lg text-sm">Save 40%</span>
                        </div>

                        {isEnrolled ? (
                            <button 
                                onClick={() => navigate(`/view-lectures/${singleCourse?._id}`)}
                                className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-3"
                            >
                                <BiPlayCircle size={24} /> Continue Learning
                            </button>
                        ) : (
                            <button 
                                onClick={handleEnroll}
                                className="w-full py-5 bg-black text-white rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all shadow-xl shadow-gray-200"
                            >
                                Enroll Now
                            </button>
                        )}
                        
                        <p className="text-center text-gray-400 text-xs mt-6">
                            30-Day Money-Back Guarantee • Lifetime Access
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CourseDetail;