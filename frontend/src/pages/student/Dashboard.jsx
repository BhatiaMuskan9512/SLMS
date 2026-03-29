import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    
    // 1. Redux se user aur auth state nikaalna
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    // 2. Security Check: Agar login nahi hai toh dhakka maar kar login pe bhejo
    // useEffect(() => {
    //     if (!isAuthenticated) {
    //         navigate("/login");
    //     }
    // }, [isAuthenticated, navigate]);

    return (
        <div className="min-h-screen bg-gray-50 pt-[100px] pb-10 px-5 sm:px-10">
            <div className="max-w-6xl mx-auto">
                
                {/* --- Welcome Header Section --- */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Welcome back, {user?.name || "Learner"}! 👋
                        </h1>
                        <p className="text-gray-500 mt-2">
                            Ready to continue your "SkillLink" journey? Happy learning!
                        </p>
                    </div>
                    <div className="bg-purple-50 px-6 py-3 rounded-xl border border-purple-100">
                        <p className="text-sm text-purple-600 font-bold uppercase tracking-wider">Student Profile</p>
                        <p className="text-gray-700 font-medium">{user?.email}</p>
                    </div>
                </div>

                {/* --- Enrolled Courses Section --- */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800">My Enrolled Courses</h2>
                    <span className="bg-black text-white text-xs px-3 py-1 rounded-full">
                        {user?.enrolledCourses?.length || 0} Courses
                    </span>
                </div>

                {/* --- Courses Grid --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {user?.enrolledCourses && user.enrolledCourses.length > 0 ? (
                        user.enrolledCourses.map((course) => (
                            <div key={course._id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all group">
                                <div className="relative">
                                    <img 
                                        src={course.thumbnail || "https://via.placeholder.com/300x180"} 
                                        alt={course.title} 
                                        className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" 
                                    />
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold shadow-sm text-purple-600">
                                        Active
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="font-bold text-gray-800 text-lg mb-2 truncate">
                                        {course.title}
                                    </h3>
                                    <div className="w-full bg-gray-100 h-2 rounded-full mb-4">
                                        <div className="bg-purple-600 h-2 rounded-full w-[45%]"></div>
                                    </div>
                                    <button 
                                        onClick={() => navigate(`/course-view/${course._id}`)}
                                        className="w-full bg-black text-white py-3 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors shadow-sm"
                                    >
                                        Continue Learning
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        /* --- Empty State: Agar koi course nahi hai --- */
                        <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <span className="text-4xl">📚</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">No courses found</h3>
                            <p className="text-gray-500 mt-2 mb-6">Explore our catalog and start your first course today!</p>
                            <button 
                                onClick={() => navigate("/all-courses")}
                                className="bg-purple-600 text-white px-8 py-3 rounded-full font-bold hover:bg-purple-700 transition-all shadow-md"
                            >
                                Browse Courses
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;