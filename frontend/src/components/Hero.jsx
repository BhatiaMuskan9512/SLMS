
// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { BiPlayCircle, BiRocket } from "react-icons/bi";
// import { motion } from "framer-motion";

// const Hero = () => {
//     const navigate = useNavigate();

//     return (
//         <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center text-center px-5 bg-white overflow-hidden pt-[80px]">
            
//             {/* --- Background Decorative Elements --- */}
//             <div className="absolute top-20 left-10 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>
//             <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-100 rounded-full blur-3xl opacity-30"></div>

//             {/* --- Hero Content --- */}
//             <motion.div 
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.8 }}
//                 className="max-w-4xl z-10"
//             >
//                 <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-100 px-4 py-2 rounded-full mb-8 shadow-sm">
//                     <BiRocket className="text-blue-600" />
//                     <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">The Future of Learning is Here</span>
//                 </div>

//                 <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.1] tracking-tighter">
//                     Master New Skills with <br />
//                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
//                         AI-Powered Courses
//                     </span>
//                 </h1>

//                 <p className="mt-8 text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium">
//                     Experience a revolutionary way of learning with our expert-led video courses, 
//                     integrated with Gemini AI for instant search and smart predictions.
//                 </p>

//                 {/* --- Action Buttons --- */}
//                 <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5">
//                     <button 
//                         onClick={() => navigate('/all-courses')}
//                         className="px-10 py-5 bg-black text-white rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all shadow-xl shadow-gray-200"
//                     >
//                         Explore Courses
//                     </button>
                    
//                     <button 
//                         onClick={() => navigate('/search-ai')}
//                         className="px-10 py-5 bg-white text-black border-2 border-gray-100 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all flex items-center gap-3"
//                     >
//                         <BiPlayCircle className="text-2xl text-blue-600" /> 
//                         Try AI Search
//                     </button>
//                 </div>
//             </motion.div>

//             {/* --- Bottom Stats / Trust Badges --- */}
//             <div className="mt-20 pt-10 border-t border-gray-50 w-full max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-8 opacity-50">
//                 <div className="text-center">
//                     <p className="text-2xl font-bold text-gray-900">10k+</p>
//                     <p className="text-xs font-bold uppercase text-gray-400">Students</p>
//                 </div>
//                 <div className="text-center">
//                     <p className="text-2xl font-bold text-gray-900">500+</p>
//                     <p className="text-xs font-bold uppercase text-gray-400">Courses</p>
//                 </div>
//                 <div className="text-center">
//                     <p className="text-2xl font-bold text-gray-900">4.9/5</p>
//                     <p className="text-xs font-bold uppercase text-gray-400">Rating</p>
//                 </div>
//                 <div className="text-center">
//                     <p className="text-2xl font-bold text-gray-900">24/7</p>
//                     <p className="text-xs font-bold uppercase text-gray-400">Support</p>
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default Hero;

import React from 'react';
import home from '../assets/home1.jpg';
import { useNavigate } from 'react-router-dom';
import { BiRocket, BiPlayCircle } from 'react-icons/bi';

const Hero = () => {
    const navigate = useNavigate();

    return (
        <section className="relative w-full min-h-[85vh] flex flex-col items-center justify-center text-center px-6 bg-white overflow-hidden pt-[100px] font-jakarta">
            
            {/* --- Decorative Blur Elements --- */}
            <div className="absolute top-10 left-[-5%] w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-40"></div>
            <div className="absolute bottom-10 right-[-10%] w-80 h-80 bg-purple-100 rounded-full blur-3xl opacity-40"></div>

            {/* --- Hero Content --- */}
            <div className="max-w-4xl z-10 flex flex-col items-center">
                
                {/* Badge */}
                <div className="inline-flex items-center gap-2.5 bg-gray-50 border border-gray-100 px-5 py-2.5 rounded-full mb-10 shadow-inner">
                    <BiRocket className="text-blue-600 text-lg" />
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-widest">
                        Revolutionizing Education with AI
                    </span>
                </div>

                {/* Heading */}
                <h1 className="text-5xl md:text-7xl font-black text-gray-950 leading-[1.05] tracking-tighter">
                    Unlock Your Potential with <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                        Smart Video Courses
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="mt-10 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-medium">
                    Dive into our diverse range of expert-led video lectures, enhanced with 
                    intelligent Gemini AI for precise searches and smart recommendations.
                </p>

                {/* Action Buttons */}
                <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-6 w-full">
                    <button 
                        onClick={() => navigate('/all-courses')}
                        className="w-full sm:w-auto px-12 py-5 bg-gray-950 text-white rounded-3xl font-bold text-lg hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 active:scale-95"
                    >
                        Explore Courses
                    </button>
                    
                    <button 
                        onClick={() => navigate('/search-ai')}
                        className="w-full sm:w-auto px-12 py-5 bg-white text-gray-950 border-2 border-gray-100 rounded-3xl font-bold text-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-3 active:scale-95"
                    >
                        <BiPlayCircle className="text-3xl text-blue-600" /> 
                        Try AI Search
                    </button>
                </div>
            </div>

            {/* --- Trust Badges / Stats Section (Optional but looks professional) --- */}
            <div className="mt-24 w-full max-w-6xl border-t border-gray-100 pt-10 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40">
                <div className="text-center">
                    <p className="text-3xl font-black text-gray-950">25K+</p>
                    <p className="text-xs font-bold uppercase text-gray-500 tracking-wider">Active Students</p>
                </div>
                <div className="text-center">
                    <p className="text-3xl font-black text-gray-950">800+</p>
                    <p className="text-xs font-bold uppercase text-gray-500 tracking-wider">Courses</p>
                </div>
                <div className="text-center">
                    <p className="text-3xl font-black text-gray-950">4.9/5</p>
                    <p className="text-xs font-bold uppercase text-gray-500 tracking-wider">Rating</p>
                </div>
                <div className="text-center">
                    <p className="text-3xl font-black text-gray-950">24/7</p>
                    <p className="text-xs font-bold uppercase text-gray-500 tracking-wider">Support</p>
                </div>
            </div>

        </section>
    );
};

export default Hero;