import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCourseData } from "../redux/courseSlice";

/**
 * Custom Hook: useGetPublishedCourse
 * Fetches only the courses that are live/published for students to see.
 */
const useGetPublishedCourse = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchPublishedCourses = async () => {
            try {
                // 1. Call the backend API for published courses
                // Note: This is a public route, so credentials aren't strictly required, 
                // but we keep consistency with the project's axios setup.
                const response = await axios.get(
                    "http://localhost:8000/api/course/get-published", 
                    { withCredentials: true }
                );

                // 2. If data is returned, update the global courseData in Redux
                if (response.data) {
                    dispatch(setCourseData(response.data));
                }
            } catch (error) {
                // Log the error but ensure the app doesn't crash
                console.error("Error fetching published courses:", error.message);
                // Optionally clear the data or set to empty array on failure
                dispatch(setCourseData([]));
            }
        };

        fetchPublishedCourses();
    }, [dispatch]); // Runs once when the app/main container mounts
};

export default useGetPublishedCourse;