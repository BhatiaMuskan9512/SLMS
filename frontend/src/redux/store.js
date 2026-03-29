import { configureStore } from "@reduxjs/toolkit";
import authSlice from './authSlice';
import courseSlice from './courseSlice';
import lectureSlice from './lectureSlice';
import reviewSlice from './reviewSlice';

/**
 * The Redux Store:
 * This combines all our individual logic slices into a single state tree.
 */
const store = configureStore({
    reducer: {
        // 'auth' handles user login, signup, and profile data
        auth: authSlice,
        
        // 'course' handles the main course catalog and educator's courses
        course: courseSlice,
        
        // 'lecture' handles the video content for the course player
        lecture: lectureSlice,
        
        // 'review' handles student feedback and home page testimonials
        review: reviewSlice,
    },
    // Middleware configuration (Optional: standard RTK setup)
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Often disabled when handling file uploads/complex objects
        }),
});

export default store;