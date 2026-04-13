// import React, { useEffect } from 'react';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import axios from 'axios';
// import { Toaster } from 'react-hot-toast';

// // --- Components & Layouts ---
// import Navbar from './components/Navbar';
// import Footer from './components/Footer';

// // --- Public Pages ---
// import Home from './pages/Home';
// import Login from './pages/auth/Login';
// import Signup from './pages/auth/Signup';
// import ForgetPassword from './pages/auth/ForgetPassword';
// import VerifyOTP from './pages/auth/VerifyOTP';
// import ResetPassword from './pages/auth/ResetPassword';
// import AllCourses from './pages/AllCourses';
// import CourseDetail from './pages/CourseDetail';
// import SearchWithAI from './pages/SearchWithAI';

// // --- Student Pages ---
// import MyEnrolledCourses from './pages/MyEnrolledCourses';
// import ViewLectures from './pages/ViewLectures';
// import Profile from './pages/Profile';
// import EditProfile from './pages/EditProfile';

// // --- Educator Pages ---
// import Dashboard from './pages/educator/Dashboard';
// import Courses from './pages/educator/Courses';
// import CreateCourse from './pages/educator/CreateCourse';
// import EditCourse from './pages/educator/EditCourse';
// import CreateLecture from './pages/educator/CreateLecture';
// import EditLecture from './pages/educator/EditLecture';

// // --- Redux Actions ---
// import { setUser, setIsAuthenticated, setLoading } from './redux/authSlice';

// const App = () => {
//     const dispatch = useDispatch();
//     const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

//     // 1. Persist Login: Check if user is already logged in on mount
//     useEffect(() => {
//         const checkUser = async () => {
//             try {
//                 // const res = await axios.get("http://localhost:8000/api/user/profile", { withCredentials: true });
//                 if (res.data) {
//                     dispatch(setUser(res.data.user));
//                     dispatch(setIsAuthenticated(true));
//                 }
//             } catch (error) {
//                 // Not logged in or token expired
//                 dispatch(setIsAuthenticated(false));
//             } finally {
//                 dispatch(setLoading(false));
//             }
//         };
//         checkUser();
//     }, [dispatch]);

//     // 2. Loading Screen (Prevents "flickering" of login/logout buttons)
//     if (loading) return (
//         <div className="h-screen flex items-center justify-center font-bold text-gray-400 animate-pulse">
//             LOADING VIRTUAL COURSE...
//         </div>
//     );

//     return (
//         <BrowserRouter>
//             {/* Global Toast Notifications */}
//             <Toaster position="top-center" reverseOrder={false} />
            
//             <Navbar />
            
//             <main className="min-h-screen">
//                 <Routes>
//                     {/* --- Public Routes --- */}
//                     <Route path="/" element={<Home />} />
//                     <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
//                     <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/" />} />
//                     <Route path="/all-courses" element={<AllCourses />} />
//                     <Route path="/course-detail/:courseId" element={<CourseDetail />} />
//                     <Route path="/search-ai" element={<SearchWithAI />} />
//                     <Route path="/forget-password" element={<ForgetPassword />} />
//                     <Route path="/verify-otp" element={<VerifyOTP />} />
//                     <Route path="/reset-password" element={<ResetPassword />} />

//                     {/* --- Student Routes (Authenticated) --- */}
//                     <Route path="/my-courses" element={isAuthenticated ? <MyEnrolledCourses /> : <Navigate to="/login" />} />
//                     <Route path="/view-lectures/:courseId" element={isAuthenticated ? <ViewLectures /> : <Navigate to="/login" />} />
//                     <Route path="/my-profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
//                     <Route path="/edit-profile" element={isAuthenticated ? <EditProfile /> : <Navigate to="/login" />} />

//                     {/* --- Educator Routes (Role Protected) --- */}
//                     <Route path="/educator/dashboard" element={user?.role === 'educator' ? <Dashboard /> : <Navigate to="/" />} />
//                     <Route path="/educator/courses" element={user?.role === 'educator' ? <Courses /> : <Navigate to="/" />} />
//                     <Route path="/educator/create-course" element={user?.role === 'educator' ? <CreateCourse /> : <Navigate to="/" />} />
//                     <Route path="/educator/edit-course/:courseId" element={user?.role === 'educator' ? <EditCourse /> : <Navigate to="/" />} />
//                     <Route path="/educator/create-lecture/:courseId" element={user?.role === 'educator' ? <CreateLecture /> : <Navigate to="/" />} />
//                     <Route path="/educator/edit-lecture/:lectureId" element={user?.role === 'educator' ? <EditLecture /> : <Navigate to="/" />} />

//                 </Routes>
//             </main>

//             <Footer />
//         </BrowserRouter>
//     );
// };

// export default App;

import React, { useEffect } from 'react';
// 🌟 FIX: Saare router imports ek hi line mein kar diye (useLocation ke sath)
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import { FaDashcube } from 'react-icons/fa';

// --- Components & Layouts ---
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// --- Public Pages ---
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgetPassword from './pages/auth/ForgetPassword';
import VerifyOTP from './pages/auth/VerifyOTP';
import ResetPassword from './pages/auth/ResetPassword';

// --- Course Explorer Pages ---
import AllCourses from './pages/AllCourses'; 
import CourseDetail from './pages/CourseDetail';

// --- Student Pages (Private) ---
import MyEnrolledCourses from './pages/MyEnrolledCourses';
import ViewLectures from './pages/ViewLectures';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';

// --- Educator Management Pages (Private) ---
import Courses from './pages/educator/Courses'; 
import CreateCourse from './pages/educator/CreateCourse';
import EditCourse from './pages/educator/EditCourse';
import CreateLecture from './pages/educator/CreateLecture';
import EditLecture from './pages/educator/EditLecture';

import EDashboard from './pages/educator/Dashboard';
import SDashboard from './pages/student/Dashboard';
import CoursePlayer from './pages/CoursePlayer';

import Process from './pages/process';

// --- Redux Actions ---
import { setUser, setIsAuthenticated, setLoading } from './redux/authSlice';
import Dashboard from './pages/Admin/Dashboard';

// 🌟 SMART FOOTER LOGIC
const SmartFooter = () => {
  const location = useLocation();
  
  // 🚫 In URLs par Footer NAHI dikhana hai
  const hideFooterRoutes = [
    '/student/dashboard', 
    '/my-courses', 
    '/course-player',
    '/my-profile'
  ];

  const shouldHide = hideFooterRoutes.some(route => location.pathname.includes(route));

  if (shouldHide) {
    return null; 
  }

  return <Footer />; 
};

const App = () => {
    const dispatch = useDispatch();
    const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

    // 1. Persist Login Check
    useEffect(() => {
        const checkUser = async () => {
            try {
                const res = await axios.get("http://localhost:8000/api/user/get-current-user", { withCredentials: true });
                if (res.data.success) {
                    dispatch(setUser(res.data.user));
                    dispatch(setIsAuthenticated(true));
                }
            } catch (error) {
                dispatch(setIsAuthenticated(false));
            } finally {
                dispatch(setLoading(false));
            }
        };
        checkUser();
    }, [dispatch]);

    // 2. Loading Spinner
    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-white font-jakarta">
            <div className="text-center">
                <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                <p className="mt-5 text-gray-500 font-bold uppercase tracking-widest text-xs animate-pulse">Loading Experience...</p>
            </div>
        </div>
    );
    
    return (
        <BrowserRouter>
            <Toaster position="top-center" reverseOrder={false} />
            
            <Navbar />
           
            <main className="pt-[80px] min-h-screen">
                <Routes>
                    {/* --- Public Routes --- */}
                    <Route path="/" 
                        element={ isAuthenticated ? (
                        user?.role === 'student' ? 
                        <Navigate to="/student/dashboard" /> 
                        : <Navigate to="/educator/dashboard"/>): <Home />} />
                    <Route path="/login"
                        element={isAuthenticated  ? (
                             user?.role === 'student' ? 
                             <Navigate to="/student/dashboard" />  :
                             user?.role === 'admin' ? <Navigate to="/admin/dashboard"/>
                        : <Navigate to="/educator/dashboard"/>): <Login />} />
                   
                    <Route path="/student/dashboard" element={<SDashboard />} />
                    <Route path="/educator/dashboard" element={<EDashboard />} />
                    
                    <Route path="/admin/dashboard" element={<Dashboard/>}/>
                    <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/" />} />
                    <Route path="/forget-password" element={<ForgetPassword />} />
                    <Route path="/verify-otp" element={<VerifyOTP />} />
                    <Route path="/reset-password" element={<ResetPassword />} />

                    {/* --- Course Explorer Routes --- */}
                    <Route path="/all-courses" element={<AllCourses />} />
                    <Route path="/course-detail/:courseId" element={<CourseDetail />} />


                    <Route path="/admin/dashboard" element={user?.role === 'admin' ? <Dashboard/> : <Navigate to="/login"/>}/>
                    {/* --- Student Routes (Authentication Required) --- */}
                    <Route path="/my-courses" element={isAuthenticated ? <MyEnrolledCourses /> : <Navigate to="/login" />} />
                    <Route path="/view-lectures/:courseId" element={isAuthenticated ? <ViewLectures /> : <Navigate to="/login" />} />
                    <Route path="/course-player/:courseId" element={isAuthenticated ? <CoursePlayer /> : <Navigate to="/login" />} />
                    <Route path="/my-profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
                    <Route path="/edit-profile" element={isAuthenticated ? <EditProfile /> : <Navigate to="/login" />} />
                    <Route path="/student/progress" element={isAuthenticated ? <div className="p-10 ml-[280px]">Progress Page Coming Soon</div> : <Navigate to="/login" />} />
                    <Route path="/student/settings" element={isAuthenticated ? <div className="p-10 ml-[280px]">Settings Page Coming Soon</div> : <Navigate to="/login" />} />

                    {/* --- Educator Management Routes --- */}
                    <Route path="/educator/courses" element={user?.role === 'educator' ? <Courses /> : <Navigate to="/login" />} />
                    <Route path="/educator/create-course" element={user?.role === 'educator' ? <CreateCourse /> : <Navigate to="/" />} />
                    <Route path="/educator/edit-course/:courseId" element={user?.role === 'educator' ? <EditCourse /> : <Navigate to="/" />} />
                    <Route path="/educator/create-lecture/:courseId" element={user?.role === 'educator' ? <CreateLecture /> : <Navigate to="/" />} />
                    <Route path="/educator/edit-lecture/:lectureId" element={user?.role === 'educator' ? <EditLecture /> : <Navigate to="/" />} />
                
                </Routes> 
            </main>
              
           {/* 🌟 Smart Footer */}
           <SmartFooter />
        </BrowserRouter>
    );
};

export default App;