// // import React, { useState, useEffect } from 'react';

// // const Navbar = ({ setIsHovering }) => {
// //   const [scrolled, setScrolled] = useState(false);

// //   useEffect(() => {
// //     const handleScroll = () => setScrolled(window.scrollY > 20);
// //     window.addEventListener('scroll', handleScroll);
// //     return () => window.removeEventListener('scroll', handleScroll);
// //   }, []);

// //   return (
// //     <nav className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 px-6 md:px-16 py-5 flex items-center justify-between ${scrolled ? 'bg-cream/80 backdrop-blur-lg shadow-sm' : 'bg-transparent'}`}>
      
// //       {/* Logo */}
// //       <div className="font-cormorant text-3xl font-bold tracking-tight cursor-pointer text-ink">
// //         Edu<span className="text-[#d4a843]">Nova</span>
// //       </div>

// //       {/* Nav Links */}
// //       <div className="hidden lg:flex items-center gap-[6px] flex-1 justify-center">
// //         {['Features', 'Courses', 'How it Works', 'Pricing', 'Reviews'].map((item) => {
// //           const linkId = item.toLowerCase().replace(/\s/g, '');
// //           return (
// //             <a
// //               key={item}
// //               href={`#${linkId}`}
// //               onMouseEnter={() => setIsHovering(true)}
// //               onMouseLeave={() => setIsHovering(false)}
// //               className="group relative px-[12px] py-[7px] text-[13.5px] font-medium text-gray-600 transition-all duration-200 hover:!text-[#d4a843] hover:bg-[#d4a843]/10 rounded-lg"
// //             >
// //               {item}
// //               <span className="absolute bottom-[3px] left-1/2 -translate-x-1/2 w-0 h-[1.5px] bg-[#d4a843] transition-all duration-300 group-hover:w-[60%]"></span>
// //             </a>
// //           );
// //         })}
// //       </div>

// //       {/* Auth Buttons */}
// //       <div className="flex items-center gap-4">
// //         {/* Sign In - Outline to Solid on Hover */}
// //         <button 
// //           onMouseEnter={() => setIsHovering(true)} 
// //           onMouseLeave={() => setIsHovering(false)}
// //           className="px-6 py-2.5 border border-black/10 rounded-xl font-outfit text-[14px] font-semibold text-ink transition-all duration-300 hover:!border-[#d4a843] hover:!text-[#d4a843] hover:bg-[#d4a843]/5"
// //         >
// //           Sign In
// //         </button>
       

// //         {/* Get Started - Solid to Outline on Hover (Inverse) */}
// //         <button 
// //           onMouseEnter={() => setIsHovering(true)} 
// //           onMouseLeave={() => setIsHovering(false)}
// //           className="px-6 py-2.5 bg-[#d4a843] text-white border border-[#d4a843] rounded-xl font-outfit text-[14px] font-bold shadow-lg shadow-[#d4a843]/20 transition-all duration-300 transform hover:-translate-y-0.5 hover:bg-[#d4a843]  hover:text-white"
// //         >
// //           Get Started Free
// //         </button>
// //       </div>
// //     </nav>
// //   );
// // };

// // export default Navbar;

// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { BiSearch, BiMenu, BiX, BiUserCircle, BiLogOut, BiChevronDown, BiBookOpen } from "react-icons/bi";
// import { logoutUser } from '../redux/authSlice';
// import toast from 'react-hot-toast';
// import axios from 'axios';
// import authSlice  from '../redux/authSlice';

// const Navbar = () => {
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
    
//     // 1. Get User and Auth state from Redux
//     const { user, isAuthenticated } = useSelector((state) => state.auth);

//     // 2. Local states for UI toggles
//     const [isMenuOpen, setIsMenuOpen] = useState(false);
//     const [isProfileOpen, setIsProfileOpen] = useState(false);
//     const [searchQuery, setSearchQuery] = useState("");

//     // 3. Handle Logout Logic
//     const handleLogout = async () => {
//     try {
//         const res = await axios.get("http://localhost:8000/api/auth/log-out", {
//             withCredentials: true // Cookies clear karne ke liye ye zaruri hai
//         });

//         if (res.data.success) {
//             // 1. LocalStorage se token aur user details hatao
//             dispatch(logoutUser());
//             localStorage.removeItem('token');
//             localStorage.removeItem('userEmail'); 
//             localStorage.clear();
           
//             toast.success(res.data.message);
            
//             // 2. User ko wapas Login page par bhej do
//             navigate("/login");
//         }
//     } catch (error) {
//         console.log(error);
//         toast.error("Logout failed!");
//     }
// };
//     // const handleLogout = async () => {
//     //     try {
//     //         await dispatch(logoutUser()).unwrap();
//     //         toast.success("Logged out successfully");
//     //         navigate("/login");
//     //     } catch (error) {
//     //         toast.error("Logout failed");
//     //     }
//     // };

//     // 4. Handle Search Logic
//     const handleSearch = (e) => {
//         e.preventDefault();
//         if (searchQuery.trim()) {
//             navigate(`/all-courses?search=${searchQuery}`);
//             setSearchQuery("");
//             setIsMenuOpen(false);
//         }
//     };

//     return (
//         <nav className="w-full h-[80px] bg-white border-b border-gray-100 fixed top-0 left-0 z-50 px-5 sm:px-10 flex items-center justify-between">
            
//             {/* --- Logo Section --- */}
//             <Link to="/" className="flex items-center gap-2 text-xl font-bold text-black">
//                 <div className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center text-2xl">
//                     S
//                 </div>
//                 Skill<span className="text-[#d4a843]">Link</span>
//             </Link>

//             {/* --- Desktop Search Bar --- */}
//             <form 
//                 onSubmit={handleSearch}
//                 className="hidden md:flex items-center bg-gray-100 px-4 py-2 rounded-full w-full max-w-[400px] mx-4"
//             >
//                 <input 
//                     type="text" 
//                     placeholder="Search courses (e.g. 'I want to learn AI')"
//                     className="bg-transparent border-none outline-none w-full text-sm text-gray-700"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                 />
//                 <button type="submit">
//                     <BiSearch className="text-gray-500 text-xl cursor-pointer hover:text-black" />
//                 </button>
//             </form>

//             {/* --- Navigation Links & Profile --- */}
//             <div className="flex items-center gap-4 sm:gap-6">
                
//                 {/* Desktop Links */}
//                 <div className="hidden lg:flex items-center gap-6 text-[15px] font-medium text-gray-600">
//                     <Link to="/all-courses" className="hover:text-black transition-colors">Explore</Link>
//                     {user?.role === 'educator' && (
//                         <Link to="/educator/dashboard" className="text-purple-600 font-bold hover:text-purple-700">Instructor</Link>
//                     )}
//                 </div>

//                 {/* Auth Buttons / Profile Dropdown */}
//                 {!isAuthenticated ? (
//                     <div className="flex items-center gap-3">
//                         <Link to="/login"
//                         className="px-6 py-2.5 border border-black/10 rounded-xl font-outfit text-[14px] font-semibold text-ink transition-all duration-300 hover:!border-[#d4a843] hover:!text-[#d4a843] hover:bg-[#d4a843]/5">Login</Link>
//                         <Link to="/signup" 
//                         className="px-6 py-2.5 bg-[#d4a843] text-white border border-[#d4a843] rounded-xl font-outfit text-[14px] font-bold shadow-lg shadow-[#d4a843]/20 transition-all duration-300 transform hover:-translate-y-0.5 hover:bg-[#d4a843]  hover:text-white">
//                             Join for Free
//                         </Link>
//                     </div>
//                 ) : (
//                     <div className="relative">
//                         <button 
//                             onClick={() => setIsProfileOpen(!isProfileOpen)}
//                             className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-all"
//                         >
//                             <img 
//                                 src={user?.photoUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
//                                 alt="Profile" 
//                                 className="w-9 h-9 rounded-full object-cover border border-gray-200"
//                             />
//                             <BiChevronDown className={`text-xl transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
//                         </button>

//                         {/* Dropdown Menu */}
//                         {isProfileOpen && (
//                             <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 shadow-xl rounded-2xl py-2 z-[60]">
//                                 <div className="px-4 py-3 border-b border-gray-50">
//                                     <p className="text-sm font-bold text-gray-800 truncate">{user?.name}</p>
//                                     <p className="text-xs text-gray-500 truncate">{user?.email}</p>
//                                 </div>
//                                 <Link onClick={() => setIsProfileOpen(false)} to="/my-profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50">
//                                     <BiUserCircle className="text-lg" /> My Profile
//                                 </Link>
//                                 <Link onClick={() => setIsProfileOpen(false)} to="/my-courses" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50">
//                                     <BiBookOpen className="text-lg" /> My Courses
//                                 </Link>
//                                 <button 
//                                     onClick={handleLogout}
//                                     className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors mt-1 border-t border-gray-50"
//                                 >
//                                     <BiLogOut className="text-lg" /> Logout
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                 )}

//                 {/* Mobile Menu Toggle */}
//                 <button 
//                     onClick={() => setIsMenuOpen(!isMenuOpen)}
//                     className="lg:hidden text-3xl text-gray-800"
//                 >
//                     {isMenuOpen ? <BiX /> : <BiMenu />}
//                 </button>
//             </div>

//             {/* --- Mobile Sidebar Overlay --- */}
//             {isMenuOpen && (
//                 <div className="lg:hidden fixed inset-0 top-[80px] bg-white z-40 p-6 flex flex-col gap-6 animate-in slide-in-from-right duration-300">
//                     <form onSubmit={handleSearch} className="flex items-center bg-gray-100 px-4 py-3 rounded-xl w-full">
//                         <input 
//                             type="text" 
//                             placeholder="Search courses..."
//                             className="bg-transparent border-none outline-none w-full text-sm"
//                             value={searchQuery}
//                             onChange={(e) => setSearchQuery(e.target.value)}
//                         />
//                         <BiSearch className="text-gray-500 text-xl" />
//                     </form>
                    
//                     <div className="flex flex-col gap-4 text-lg font-medium text-gray-700">
//                         <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
//                         <Link to="/all-courses" onClick={() => setIsMenuOpen(false)}>Explore Courses</Link>
//                         {user?.role === 'educator' && (
//                             <Link to="/educator/dashboard" onClick={() => setIsMenuOpen(false)} className="text-purple-600">Instructor Dashboard</Link>
//                         )}
//                         <Link to="/about" onClick={() => setIsMenuOpen(false)}>About Us</Link>
//                     </div>
//                 </div>
//             )}
//         </nav>
//     );
// };

// export default Navbar;
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
    BiSearch, BiMenu, BiX, BiUserCircle, 
    BiLogOut, BiChevronDown, BiBookOpen, BiChalkboard 
} from "react-icons/bi";
import { logoutUser } from '../redux/authSlice';
import toast from 'react-hot-toast';
import axios from 'axios';

const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const dropdownRef = useRef(null); // Dropdown outside click handle karne ke liye

    // --- Redux State ---
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    // --- UI States ---
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // --- Click Outside Logic ---
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // --- Your Logout Logic ---
    const handleLogout = async () => {
        try {
            const res = await axios.get("http://localhost:8000/api/auth/log-out", {
                withCredentials: true 
            });

            if (res.data.success) {
                dispatch(logoutUser());
                localStorage.clear();
                toast.success(res.data.message || "Logged out successfully");
                setIsProfileOpen(false);
                navigate("/login");
            }
        } catch (error) {
            console.log(error);
            toast.error("Logout failed!");
        }
    };

    // --- Search Logic ---
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/all-courses?search=${searchQuery}`);
            setSearchQuery("");
            setIsMenuOpen(false);
        }
    };

    return (
        <nav className="w-full h-[80px] bg-[#F9F6EE] border-b border-[#D4A373]/20 fixed top-0 left-0 z-50 px-5 sm:px-10 flex items-center justify-between font-jakarta">
            
            {/* --- Logo Section --- */}
            <Link to="/" className="flex items-center gap-2 text-2xl font-serif font-bold text-[#1A1A1A]">
                <div className="w-10 h-10 bg-[#1A1A1A] text-[#D4A373] rounded-xl flex items-center justify-center text-2xl shadow-lg">
                    S
                </div>
                Skill<span className="text-[#D4A373]">Link</span>
            </Link>

            {/* --- Desktop Search Bar (EduNova Style) ---
            <form 
                onSubmit={handleSearch}
                className="hidden md:flex items-center bg-white px-5 py-2.5 rounded-2xl w-full max-w-[400px] mx-4 shadow-sm border border-[#D4A373]/10"
            >
                <input 
                    type="text" 
                    placeholder="Search courses..."
                    className="bg-transparent border-none outline-none w-full text-sm text-gray-700"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit">
                    <BiSearch className="text-[#D4A373] text-xl cursor-pointer hover:scale-110 transition-transform" />
                </button>
            </form> */}

            {/* --- Navigation Links --- */}
            <div className="flex items-center gap-4 sm:gap-6">
                
                <div className="hidden lg:flex items-center gap-8 text-[15px] font-bold text-[#1A1A1A]/70">
                    <Link to="/all-courses" className="hover:text-[#D4A373] transition-colors">Explore</Link>
                    {/* Role Based Link */}
                    {user?.role === 'educator' && (
                        <Link to="/educator/dashboard" className="text-[#D4A373] font-black border-b-2 border-[#D4A373]">Instructor</Link>
                    )}
                </div>

                {/* --- Auth/Profile Section --- */}
                {!isAuthenticated ? (
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-[#1A1A1A] font-bold text-sm hover:text-[#D4A373] transition-colors">Login</Link>
                        <Link to="/signup" className="bg-[#1A1A1A] text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-xl shadow-black/10 hover:bg-black transition-all transform hover:-translate-y-0.5">
                            Join for Free
                        </Link>
                    </div>
                ) : (
                    <div className="relative" ref={dropdownRef}>
                        <button 
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-2 p-1 rounded-full border-2 border-[#D4A373]/20 hover:border-[#D4A373] transition-all bg-white"
                        >
                            <img 
                                src={user?.photoUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                                alt="Profile" 
                                className="w-9 h-9 rounded-full object-cover"
                            />
                            <BiChevronDown className={`text-xl text-[#1A1A1A] transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* --- Role-Based Dropdown Menu --- */}
                        {isProfileOpen && (
                            <div className="absolute right-0 mt-4 w-64 bg-white border border-[#F9F6EE] shadow-2xl rounded-[30px] py-4 z-[60] animate-in fade-in zoom-in duration-200">
                                <div className="px-6 py-3 border-b border-gray-50 mb-2">
                                    <p className="text-sm font-black text-[#1A1A1A] truncate">{user?.name}</p>
                                    <p className="text-[10px] text-[#D4A373] font-bold uppercase tracking-widest">{user?.role}</p>
                                </div>
                                
                                <div className="flex flex-col">
                                    <Link onClick={() => setIsProfileOpen(false)} to="/my-profile" className="flex items-center gap-3 px-6 py-3 text-sm text-gray-600 hover:bg-[#F9F6EE] transition-colors">
                                        <BiUserCircle className="text-lg text-[#D4A373]" /> My Profile
                                    </Link>

                                    {/* --- Student Specific --- */}
                                    {user?.role === 'student' && (
                                        <>
                                            <Link onClick={() => setIsProfileOpen(false)} to="/my-courses" className="flex items-center gap-3 px-6 py-3 text-sm text-gray-600 hover:bg-[#F9F6EE] transition-colors">
                                                <BiBookOpen className="text-lg text-[#D4A373]" /> My Courses
                                            </Link>
                                            <Link onClick={() => setIsProfileOpen(false)} to="/student/dashboard" className="flex items-center gap-3 px-6 py-3 text-sm text-gray-600 hover:bg-[#F9F6EE] transition-colors">
                                                <BiChalkboard className="text-lg text-[#D4A373]" /> Learning Dashboard
                                            </Link>
                                        </>
                                    )}

                                    {/* --- Educator Specific --- */}
                                    {user?.role === 'educator' && (
                                        <>
                                            <Link onClick={() => setIsProfileOpen(false)} to="/educator/dashboard" className="flex items-center gap-3 px-6 py-3 text-sm text-gray-600 hover:bg-[#F9F6EE] transition-colors">
                                                <BiChalkboard className="text-lg text-[#D4A373]" /> Instructor Console
                                            </Link>
                                            <Link onClick={() => setIsProfileOpen(false)} to="/educator/courses" className="flex items-center gap-3 px-6 py-3 text-sm text-gray-600 hover:bg-[#F9F6EE] transition-colors">
                                                <BiBookOpen className="text-lg text-[#D4A373]" /> Manage Courses
                                            </Link>
                                        </>
                                    )}

                                    <button 
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-6 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors mt-2 border-t border-gray-50 font-bold"
                                    >
                                        <BiLogOut className="text-lg" /> Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Mobile Menu Button */}
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="lg:hidden text-3xl text-[#1A1A1A]"
                >
                    {isMenuOpen ? <BiX /> : <BiMenu />}
                </button>
            </div>

            {/* --- Mobile Menu (Merged Logic) --- */}
            {isMenuOpen && (
                <div className="lg:hidden fixed inset-0 top-[80px] bg-[#F9F6EE] z-40 p-8 flex flex-col gap-8 animate-in slide-in-from-right">
                    <form onSubmit={handleSearch} className="flex items-center bg-white px-5 py-4 rounded-2xl shadow-sm">
                        <input 
                            type="text" 
                            placeholder="Search..."
                            className="bg-transparent border-none outline-none w-full text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <BiSearch className="text-[#D4A373] text-xl" />
                    </form>
                    
                    <div className="flex flex-col gap-6 text-xl font-bold text-[#1A1A1A]">
                        <Link to="/all-courses" onClick={() => setIsMenuOpen(false)}>Explore Courses</Link>
                        {user?.role === 'educator' && (
                            <Link to="/educator/dashboard" onClick={() => setIsMenuOpen(false)} className="text-[#D4A373]">Instructor Console</Link>
                        )}
                        <Link to="/my-profile" onClick={() => setIsMenuOpen(false)}>My Profile</Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;