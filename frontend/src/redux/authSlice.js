import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // 1. Stores the complete user object (name, email, photoUrl, role, etc.)
    user: null,
    
    // 2. Boolean to track if a session is active
    isAuthenticated: false,
    
    // 3. Loading state for auth-check on page refresh
    loading: true,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // Sets the user data after successful Login, Signup, or Profile Update
        setUser: (state, action) => {
            state.user = action.payload;
        },

        // Updates the login status
        setIsAuthenticated: (state, action) => {
            state.isAuthenticated = action.payload;
        },

        // Updates the loading state (used in the App.jsx check)
        setLoading: (state, action) => {
            state.loading = action.payload;
        },

        // Clears everything when the user logs out
        logoutUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
        }
    }
});

// Exporting actions for use with useDispatch()
export const { 
    setUser, 
    setIsAuthenticated, 
    setLoading, 
    logoutUser 
} = authSlice.actions;

// Exporting the reducer to be registered in store.js
export default authSlice.reducer;