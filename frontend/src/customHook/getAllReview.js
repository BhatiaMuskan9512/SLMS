import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setReviews } from "../redux/courseSlice";

/**
 * Custom Hook: getAllReviews
 * Fetches all course reviews from the database and updates the Redux store.
 */
const getAllReviews = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                // 1. Call the backend API (ensure your backend is running)
                const response = await axios.get(
                    "http://localhost:8000/api/review/get-review", 
                    { withCredentials: true }
                );

                // 2. If successful, update the global Redux state
                if (response.data) {
                    dispatch(setReviews(response.data));
                }
            } catch (error) {
                // Log error but don't break the UI
                console.error("Error fetching reviews:", error.message);
            }
        };

        fetchReviews();
    }, [dispatch]); // Runs once when the app/component mounts
};

export default getAllReviews;