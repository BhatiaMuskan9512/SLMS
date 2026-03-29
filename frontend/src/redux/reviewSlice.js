import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // 1. Array for all public reviews shown on the landing page
    allReviews: [],
    
    // 2. Reviews written by the currently logged-in user
    myReviews: [],
    
    // 3. Loading state specifically for review submissions
    reviewLoading: false,
};

const reviewSlice = createSlice({
    name: "review",
    initialState,
    reducers: {
        // Sets the global testimonials for the ReviewPage component
        setAllReviews: (state, action) => {
            state.allReviews = action.payload;
        },

        // Sets the reviews specifically belonging to the logged-in student
        setMyReviews: (state, action) => {
            state.myReviews = action.payload;
        },

        // Toggle loading state when posting a new review
        setReviewLoading: (state, action) => {
            state.reviewLoading = action.payload;
        },

        // Add a newly created review to the top of the local state 
        // (Avoids a full page refresh after a student leaves a review)
        addReviewToState: (state, action) => {
            state.allReviews.unshift(action.payload);
            state.myReviews.unshift(action.payload);
        },

        // Clears review data on logout
        clearReviewState: (state) => {
            state.allReviews = [];
            state.myReviews = [];
            state.reviewLoading = false;
        }
    }
});

// Exporting actions for useDispatch()
export const { 
    setAllReviews, 
    setMyReviews, 
    setReviewLoading, 
    addReviewToState, 
    clearReviewState 
} = reviewSlice.actions;

// Exporting the reducer for store.js
export default reviewSlice.reducer;