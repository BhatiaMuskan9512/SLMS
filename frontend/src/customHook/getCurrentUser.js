import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, setIsAuthenticated } from "../redux/authSlice";

/**
 * Custom Hook: getCurrentUser
 * This hook runs on app initialization to check for an active session.
 */
const useGetCurrentUser = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // 1. Call the backend to get user details based on the cookie
                const response = await axios.get(
                    "http://localhost:8000/api/user/get-current-user", 
                    { withCredentials: true } // Crucial for sending the JWT cookie
                );

                // 2. If the user exists, update Redux state
                if (response.data) {
                    dispatch(setUser(response.data));
                    dispatch(setIsAuthenticated(true));
                }
            } catch (error) {
                // 3. If unauthorized or error, ensure state reflects "logged out"
                dispatch(setUser(null));
                dispatch(setIsAuthenticated(false));
                console.log("No active session found or error fetching user.");
            }
        };

        fetchUser();
    }, [dispatch]); // Only runs once when the app/component mounts
};

export default useGetCurrentUser;