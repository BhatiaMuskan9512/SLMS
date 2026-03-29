import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // 1. Array to hold lectures for the currently viewed/edited course
    lectures: [],
    
    // 2. Data for a single lecture (used during editing/uploading)
    lecture: null,
};

const lectureSlice = createSlice({
    name: "lecture",
    initialState,
    reducers: {
        // Sets the full list of lectures for a course
        setLectures: (state, action) => {
            state.lectures = action.payload;
        },

        // Sets a single lecture's data into the state
        setLecture: (state, action) => {
            state.lecture = action.payload;
        },

        // Action to remove a lecture from the local state after a successful delete API call
        removeLectureFromState: (state, action) => {
            state.lectures = state.lectures.filter(
                (lec) => lec._id !== action.payload
            );
        },

        // Clears the lecture state when navigating away or logging out
        clearLectureState: (state) => {
            state.lectures = [];
            state.lecture = null;
        }
    }
});

// Exporting actions for use with useDispatch()
export const { 
    setLectures, 
    setLecture, 
    removeLectureFromState, 
    clearLectureState 
} = lectureSlice.actions;

// Exporting the reducer to be registered in store.js
export default lectureSlice.reducer;