import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // 1. All published courses (for students/home page)
    courseData: [],
    
    // 2. Specific courses created by the logged-in educator
    creatorCourses: [],
    
    // 3. Global list of reviews/testimonials
    reviews: [],
    
    // 4. Detailed data for a single selected course
    singleCourse: null,
};

const courseSlice = createSlice({
    name: "course",
    initialState,
    reducers: {
        // Sets the main gallery of courses
        setCourseData: (state, action) => {
            state.courseData = action.payload;
        },

        // Sets the educator's private course list
        setCreatorCourses: (state, action) => {
            state.creatorCourses = action.payload;
        },

        // Sets the reviews to be displayed on the Home Page
        setReviews: (state, action) => {
            state.reviews = action.payload;
        },

        // Sets data for a specific course (used in CourseDetail page)
        setSingleCourse: (state, action) => {
            state.singleCourse = action.payload;
        },

        // Utility to clear course data on logout if necessary
        clearCourseState: (state) => {
            state.courseData = [];
            state.creatorCourses = [];
            state.reviews = [];
            state.singleCourse = null;
        }
    }
});

// Exporting actions to be used with useDispatch()
export const { 
    setCourseData, 
    setCreatorCourses, 
    setReviews, 
    setSingleCourse, 
    clearCourseState 
} = courseSlice.actions;

// Exporting the reducer to be registered in store.js
export default courseSlice.reducer;