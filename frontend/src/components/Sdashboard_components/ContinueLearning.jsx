import React, { useState, useEffect } from 'react';

const ContinueLearning = () => {
    // Progress bar animation ke liye state
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        // Component load hone ke thodi der baad width set karega taaki animation dikhe
        const timer = setTimeout(() => setAnimate(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const coursesData = [
        {
            id: 1,
            icon: '🐍',
            gradient: 'from-[#0f1a35] to-[#0a1020]',
            title: 'Python for Data Science',
            meta: 'Arjun Mehta · Chapter 4 of 12',
            progress: 66,
            color: '#3ecfc6'
        },
        {
            id: 2,
            icon: '⚛️',
            gradient: 'from-[#1a2a1f] to-[#0f1f15]',
            title: 'Advanced React & Next.js',
            meta: 'Priya Sharma · Chapter 7 of 15',
            progress: 42,
            color: '#d4a843'
        },
        {
            id: 3,
            icon: '🎨',
            gradient: 'from-[#2a1a30] to-[#1a0f20]',
            title: 'UI/UX Design Masterclass',
            meta: 'Riya Kapoor · Chapter 2 of 10',
            progress: 18,
            color: '#a78bfa'
        },
        {
            id: 4,
            icon: '🗄️',
            gradient: 'from-[#2a1e0a] to-[#1a1205]',
            title: 'SQL & Database Design',
            meta: 'Vikram Joshi · Chapter 9 of 9 ✅',
            progress: 100,
            color: '#6bcb77'
        }
    ];

    const handleCourseClick = (title, icon) => {
        alert(`Opening ${title} ${icon}`);
        // Yahan aap useNavigate() se us course ke page par bhej sakti hain
    };

    return (
        <div className="bg-white rounded-[24px] border border-black/5 p-2.5 shadow-sm">
            
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4">
                <span className="text-[15px] font-bold text-[#0a0b0f]">
                    Continue Learning
                </span>
                <button 
                    onClick={() => alert("Opening all courses...")}
                    className="text-[13px] text-[#d4a843] cursor-pointer font-medium hover:underline focus:outline-none"
                >
                    View all →
                </button>
            </div>

            {/* Course List */}
            <div className="flex flex-col">
                {coursesData.map((course, index) => (
                    <div 
                        key={course.id}
                        onClick={() => handleCourseClick(course.title, course.icon)}
                        className={`flex items-center gap-3.5 px-5 py-3.5 cursor-pointer transition-colors hover:bg-[#fafaf8] rounded-xl ${
                            index !== 0 ? 'border-t border-black/5' : ''
                        }`}
                    >
                        {/* Thumbnail */}
                        <div className={`w-[52px] h-[52px] rounded-xl flex items-center justify-center text-2xl shrink-0 bg-gradient-to-br ${course.gradient}`}>
                            {course.icon}
                        </div>

                        {/* Info & Progress */}
                        <div className="flex-1 min-w-0">
                            <h3 className="text-[14px] font-semibold text-[#0a0b0f] truncate">
                                {course.title}
                            </h3>
                            <p className="text-[12px] text-[#8a8c98] mt-0.5">
                                {course.meta}
                            </p>
                            
                            {/* Progress Bar Container */}
                            <div className="flex items-center gap-2 mt-2">
                                <div className="flex-1 h-1 bg-[#f0eadb] rounded-full overflow-hidden">
                                    <div 
                                        className="h-full rounded-full transition-all duration-1000 ease-out"
                                        style={{ 
                                            width: animate ? `${course.progress}%` : '0%',
                                            backgroundColor: course.color 
                                        }}
                                    />
                                </div>
                                <span className="text-[11px] text-[#8a8c98] font-medium shrink-0">
                                    {course.progress}%
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
        </div>
    );
};

export default ContinueLearning;