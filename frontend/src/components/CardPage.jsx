import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Card from './Card';

const CardPage = () => {
    // 1. Fetching course data from the Redux store
    const { courseData } = useSelector((state) => state.course);

    // 2. Local state to hold only the "Popular" courses (Top 6)
    const [popularCourses, setPopularCourses] = useState([]);

    useEffect(() => {
        // Logic to slice the first 6 courses from the global courseData
        if (courseData && courseData.length > 0) {
            const sliced = courseData.slice(0, 6);
            setPopularCourses(sliced);
        }
    }, [courseData]);

    return (
        <div className="relative flex items-center justify-center flex-col w-full py-12">
            {/* --- Section Header --- */}
            <h1 className="text-3xl sm:text-5xl font-bold text-center mt-[30px] px-5 text-gray-800">
                Our Popular Courses
            </h1>
            
            <span className="w-[80%] sm:w-[50%] text-[15px] text-center mt-[30px] mb-[30px] px-5 text-gray-500">
                Discover our top-rated courses designed to boost your skills. Join thousands of students learning world-class content from expert educators.
            </span>

            {/* --- Courses Grid --- */}
            <div className="w-full min-h-[100vh] flex items-center justify-center flex-wrap gap-[50px] lg:p-[50px] md:p-[30px] p-[10px] mb-[40px]">
                {popularCourses.length > 0 ? (
                    popularCourses.map((course, index) => (
                        <Card 
                            key={index}
                            id={course._id}
                            thumbnail={course.thumbnail}
                            title={course.title}
                            category={course.category}
                            price={course.price}
                            reviews={course.reviews}
                        />
                    ))
                ) : (
                    // Optional: Skeleton or No Course Message
                    <p className="text-gray-400 text-lg">No popular courses available yet.</p>
                )}
            </div>
        </div>
    );
};

export default CardPage;