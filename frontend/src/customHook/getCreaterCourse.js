import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCreatorCourses } from "../redux/courseSlice";

/**
 * Custom Hook: getCreatorCourse
 * Fetches courses created by the logged-in educator.
 */
const useGetCreatorCourse = () => {
    const dispatch = useDispatch();
    
    // We only want to fetch if the user is actually authenticated
    const { isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchCreatorCourses = async () => {
            try {
                // 1. Call the backend API for creator-specific courses
                const response = await axios.get(
                    "http://localhost:8000/api/course/get-creator", 
                    { withCredentials: true } // Required to send the JWT for identification
                );

                // 2. If successful, update the creatorCourses array in Redux
                if (response.data) {
                    dispatch(setCreatorCourses(response.data));
                }
            } catch (error) {
                // Log the error but keep the array empty in Redux
                console.error("Error fetching creator courses:", error.message);
                dispatch(setCreatorCourses([]));
            }
        };

        // Only trigger the API call if the user is logged in
        if (isAuthenticated) {
            fetchCreatorCourses();
        }
    }, [dispatch, isAuthenticated]); // Re-run if authentication status changes
};

export default useGetCreatorCourse;