// import { configureStore } from "@reduxjs/toolkit";
// import authSlice from './authSlice';
// import courseSlice from './courseSlice';
// import lectureSlice from './lectureSlice';
// import reviewSlice from './reviewSlice';

// /**
//  * The Redux Store:
//  * This combines all our individual logic slices into a single state tree.
//  */
// const store = configureStore({
//     reducer: {
//         // 'auth' handles user login, signup, and profile data
//         auth: authSlice,
        
//         // 'course' handles the main course catalog and educator's courses
//         course: courseSlice,
        
//         // 'lecture' handles the video content for the course player
//         lecture: lectureSlice,
        
//         // 'review' handles student feedback and home page testimonials
//         review: reviewSlice,
//     },
//     // Middleware configuration (Optional: standard RTK setup)
//     middleware: (getDefaultMiddleware) =>
//         getDefaultMiddleware({
//             serializableCheck: false, // Often disabled when handling file uploads/complex objects
//         }),
// });

// export default store;
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { 
    persistStore, 
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // LocalStorage use karne ke liye
import authSlice from './authSlice';
import courseSlice from './courseSlice';
import lectureSlice from './lectureSlice';
import reviewSlice from './reviewSlice';

// 1. Saare reducers ko combine karein
const rootReducer = combineReducers({
    auth: authSlice,
    course: courseSlice,
    lecture: lectureSlice,
    review: reviewSlice,
});

// 2. Persist Configuration
const persistConfig = {
    key: "root",
    version: 1,
    storage,
    // whitelist: ['auth', 'course'] // Optional: agar sirf kuch slices save karne hon
};

// 3. Persisted Reducer banayein
const persistedReducer = persistReducer(persistConfig, rootReducer);

/**
 * The Redux Store:
 * Ab humne persistence add kar di hai taaki refresh par data na jaye.
 */
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Redux Persist ke actions ko ignore karne ke liye (taaki console errors na aayein)
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);
export default store;