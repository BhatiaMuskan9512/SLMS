import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Card from '../components/Card';
import { BiSearchAlt, BiLoaderAlt, BiSortAlt2 } from "react-icons/bi";

const AllCourses = () => {
    // 1. Get search query from URL (e.g., ?search=react)
    const [searchParams] = useSearchParams();
    const query = searchParams.get('search');

    // 2. Local states for filtering and AI results
    const { courseData } = useSelector((state) => state.course);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [aiActive, setAiActive] = useState(false);

    // 3. Logic: Fetch AI Search results OR Show all Published Courses
    useEffect(() => {
        const handleSearch = async () => {
            if (query) {
                setLoading(true);
                setAiActive(true);
                try {
                    // Call the AI search endpoint on the backend
                    const response = await axios.post(
                        "http://localhost:8000/api/course/search", 
                        { prompt: query },
                        { withCredentials: true }
                    );
                    setFilteredCourses(response.data);
                } catch (error) {
                    console.error("AI Search failed:", error);
                    setFilteredCourses([]);
                } finally {
                    setLoading(false);
                }
            } else {
                // If no search query, show all courses from Redux
                setAiActive(false);
                setFilteredCourses(courseData);
            }
        };

        handleSearch();
    }, [query, courseData]);

    return (
        <div className="min-h-screen bg-gray-50 pt-[100px] pb-20 px-5 sm:px-10 lg:px-20">
            
            {/* --- Page Header --- */}
            <div className="max-w-7xl mx-auto mb-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            {aiActive ? `AI Results for: "${query}"` : "Browse All Courses"}
                        </h1>
                        <p className="text-gray-500 mt-2">
                            {aiActive 
                                ? `Gemini AI found ${filteredCourses.length} courses matching your request.` 
                                : `Explore our library of ${courseData.length} professional courses.`
                            }
                        </p>
                    </div>

                    {/* Simple Filter UI (Optional Visual) */}
                    <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm text-sm font-medium text-gray-600">
                        <BiSortAlt2 className="text-xl" />
                        <span>Filter by Category</span>
                    </div>
                </div>
            </div>

            {/* --- Main Content Area --- */}
            <div className="max-w-7xl mx-auto">
                {loading ? (
                    /* Loading State */
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <BiLoaderAlt className="text-5xl text-black animate-spin" />
                        <p className="text-gray-500 font-medium animate-pulse">Gemini AI is analyzing your request...</p>
                    </div>
                ) : filteredCourses.length > 0 ? (
                    /* Courses Grid */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredCourses.map((course) => (
                            <Card 
                                key={course._id}
                                id={course._id}
                                thumbnail={course.thumbnail}
                                title={course.title}
                                category={course.category}
                                price={course.price}
                                reviews={course.reviews}
                            />
                        ))}
                    </div>
                ) : (
                    /* No Results Found */
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-4xl mb-4">
                            <BiSearchAlt className="text-gray-400" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">No courses found</h2>
                        <p className="text-gray-500 mt-2">Try searching for something else, or browse our categories.</p>
                        <button 
                            onClick={() => window.location.href = '/all-courses'}
                            className="mt-6 text-blue-600 font-bold hover:underline"
                        >
                            Clear search and view all
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllCourses;