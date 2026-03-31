import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. useNavigate import karein

const Hero = ({ setIsHovering }) => {
  const navigate = useNavigate(); // 2. Hook ko initialize karein
  
  const [counts, setCounts] = useState({ learners: 0, courses: 0, rate: 0, countries: 0 });

  useEffect(() => {
    const targets = { learners: 50, courses: 800, rate: 98, countries: 120 };
    const duration = 2000;
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);

    let frame = 0;
    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      setCounts({
        learners: Math.floor(targets.learners * progress),
        courses: Math.floor(targets.courses * progress),
        rate: Math.floor(targets.rate * progress),
        countries: Math.floor(targets.countries * progress),
      });

      if (frame === totalFrames) clearInterval(timer);
    }, frameDuration);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20 px-6 overflow-hidden bg-[#fdf8ef]">
      
      {/* Background Elements... (Same as your code) */}
      <div className="absolute top-[-100px] right-[-100px] w-[600px] h-[600px] rounded-full bg-radial-gradient from-[#d4a8432e] to-transparent animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[-80px] left-[-80px] w-[400px] h-[400px] rounded-full bg-radial-gradient from-[#3ecfc61f] to-transparent animate-bounce pointer-events-none" style={{animationDuration: '10s'}}></div>
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[linear-gradient(rgba(212,168,67,1)_1px,transparent_1px),linear-gradient(90deg,rgba(212,168,67,1)_1px,transparent_1px)] bg-[size:60px_60px]"></div>

      <div className="relative z-10 max-w-4xl text-center">
        
        {/* Trusted Pill */}
        <div className="animate-fade-up delay-100 inline-flex items-center gap-2 bg-[#d4a8431f] border border-[#d4a8434d] rounded-full px-4 py-1.5 text-[12.5px] font-semibold text-[#d4a843] mb-8 cursor-pointer hover:bg-[#d4a84333] transition-all">
          ★ Trusted by 50,000+ learners worldwide
        </div>

        {/* Heading & Paragraph */}
        <h1 className="animate-fade-up delay-200 font-cormorant text-[clamp(42px,7vw,88px)] font-light leading-[1.1] text-[#0a0b0f] mb-4">
          <span className="italic text-[#d4a843]">Transform</span> the Way<br />
          <strong className="font-bold">You Learn</strong> & Grow
        </h1>

        <p className="animate-fade-up delay-300 font-outfit text-gray-500 text-lg md:text-xl max-w-xl mx-auto mb-10 font-light leading-relaxed">
          An elegant, powerful learning platform designed for the modern learner. Master new skills with world-class instructors.
        </p>

        {/* Actions - UPDATED BUTTON */}
        <div className="animate-fade-up delay-400 flex flex-wrap items-center justify-center gap-4">
          <button 
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={() => navigate('/login')} // 3. Click par login page par bhejein
            className="px-10 py-4 bg-[#0a0b0f] text-[#e8c96d] rounded-xl font-semibold text-[15px] shadow-2xl shadow-[#d4a84366] hover:bg-[#d4a843] hover:text-[#0a0b0f] transition-all duration-300 transform hover:-translate-y-1"
          >
            Start Learning Free →
          </button>
          
          <button className="px-10 py-4 border border-black/20 rounded-xl font-medium text-[#0a0b0f] flex items-center gap-2 hover:bg-[#d4a8430d] hover:border-[#d4a843] transition-all">
            ▶ Watch Demo
          </button>
        </div>

        {/* Social Proof & Stats... (Same as your code) */}
        <div className="animate-fade-up delay-500 mt-14 flex flex-col items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              <Avatar letter="A" color="from-[#e8c96d] to-[#f0a500]" />
              <Avatar letter="R" color="from-[#3ecfc6] to-[#36b5ad]" />
              <Avatar letter="S" color="from-[#a78bfa] to-[#8b6fe0]" />
              <Avatar letter="N" color="from-[#f26a5e] to-[#e55555]" />
              <Avatar letter="P" color="from-[#6bcb77] to-[#4ab556]" />
            </div>
            <div className="text-sm font-outfit text-gray-600">
              <span className="font-bold text-[#0a0b0f]">4.9/5</span> from 12,000+ reviews
            </div>
          </div>

          <div className="flex flex-wrap gap-12 mt-10 justify-center border-t border-black/5 pt-10">
            <Stat num={counts.learners} label="K+ Learners" />
            <Stat num={counts.courses} label="Expert Courses" />
            <Stat num={counts.rate} label="% Completion Rate" />
            <Stat num={counts.countries} label="+ Countries" />
          </div>
        </div>
      </div>
    </section>
  );
};

// Sub-components
const Avatar = ({ letter, color }) => (
  <div className={`w-9 h-9 rounded-full border-2 border-[#fdf8ef] flex items-center justify-center text-white text-[12px] font-bold bg-gradient-to-br ${color}`}>
    {letter}
  </div>
);

const Stat = ({ num, label }) => (
  <div className="text-center group">
    <div className="font-cormorant text-4xl font-bold text-[#0a0b0f] group-hover:text-[#d4a843] transition-colors">{num}</div>
    <div className="text-[11px] text-gray-400 uppercase tracking-widest mt-1">{label}</div>
  </div>
);

export default Hero;
// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { BiRocket, BiPlayCircle } from 'react-icons/bi';

// // --- 1. Apni Badi Hero Image ko Yahan Import Karein ---
// import homeimage from '../assets/home1.jpg'; // check extension (.png or .jpg)

// const Hero = () => {
//     const navigate = useNavigate();

//     return (
//         // flex-col md:flex-row is key: Mobile par vertical, Laptop par side-by-side.
//         <section className="relative w-full min-h-[90vh] flex flex-col md:flex-row items-center justify-between px-6 md:px-16 bg-white overflow-hidden pt-[110px] font-jakarta gap-12">
            
//             {/* --- Decorative Blur Elements (Taki tutorial jaisa premium look aaye) --- */}
//             <div className="absolute top-10 left-[-5%] w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-30"></div>
//             <div className="absolute bottom-10 right-[-10%] w-80 h-80 bg-purple-100 rounded-full blur-3xl opacity-30 z-0"></div>

//             {/* ========================================================== */}
//             {/* --- LEFT SIDE: Text Content (w-full md:w-1/2) --- */}
//             {/* ========================================================== */}
//             <div className="w-full md:w-[55%] flex flex-col items-center md:items-start text-center md:text-left z-10">
                
//                 {/* Badge */}
//                 <div className="inline-flex items-center gap-2.5 bg-gray-50 border border-gray-100 px-5 py-2.5 rounded-full mb-10 shadow-inner">
//                     <BiRocket className="text-blue-600 text-lg" />
//                     <span className="text-xs font-bold text-gray-700 uppercase tracking-widest">
//                         Revolutionizing Education with AI
//                     </span>
//                 </div>

//                 {/* Heading */}
//                 <h1 className="text-5xl md:text-7xl font-black text-gray-950 leading-[1.05] tracking-tighter">
//                     Unlock Your Potential with <br />
//                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
//                         Smart Video Courses
//                     </span>
//                 </h1>

//                 {/* Subtitle */}
//                 <p className="mt-10 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto md:mx-0 leading-relaxed font-medium">
//                     Dive into our diverse range of expert-led video lectures, enhanced with 
//                     intelligent Gemini AI for precise searches and smart recommendations.
//                 </p>

//                 {/* Action Buttons */}
//                 <div className="mt-14 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-6 w-full max-w-lg md:max-w-full">
//                     <button 
//                         onClick={() => navigate('/all-courses')}
//                         className="w-full sm:w-auto px-12 py-5 bg-gray-950 text-white rounded-3xl font-bold text-lg hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 active:scale-95"
//                     >
//                         Explore Courses
//                     </button>
                    
//                     <button 
//                         onClick={() => navigate('/search-ai')}
//                         className="w-full sm:w-auto px-12 py-5 bg-white text-gray-950 border-2 border-gray-100 rounded-3xl font-bold text-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-3 active:scale-95"
//                     >
//                         <BiPlayCircle className="text-3xl text-blue-600" /> 
//                         Try AI Search
//                     </button>
//                 </div>
//             </div>

//             {/* ========================================================== */}
//             {/* --- RIGHT SIDE: Large Image Content (w-full md:w-[45%]) --- */}
//             {/* ========================================================== */}
//             <div className="w-full md:w-[45%] flex items-center justify-center z-10 p-5 md:p-0">
//                 {/* Image contains modern animation and styling */}
//                 <img 
//                     src={homeimage} // --- 2. Variable ko Yahan Use Karein ---
//                     alt="AI Powered Education" 
//                     className="w-full h-auto max-w-[500px] md:max-w-none rounded-[40px] shadow-2xl shadow-blue-50 object-cover animate-float" 
//                 />
//             </div>

//         </section>
//     );
// };

// export default Hero;

// // import React from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import { BiPlayCircle, BiRocket } from "react-icons/bi";
// // import { motion } from "framer-motion";

// // const Hero = () => {
// //     const navigate = useNavigate();

// //     return (
// //         <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center text-center px-5 bg-white overflow-hidden pt-[80px]">
            
// //             {/* --- Background Decorative Elements --- */}
// //             <div className="absolute top-20 left-10 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>
// //             <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-100 rounded-full blur-3xl opacity-30"></div>

// //             {/* --- Hero Content --- */}
// //             <motion.div 
// //                 initial={{ opacity: 0, y: 20 }}
// //                 animate={{ opacity: 1, y: 0 }}
// //                 transition={{ duration: 0.8 }}
// //                 className="max-w-4xl z-10"
// //             >
// //                 <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-100 px-4 py-2 rounded-full mb-8 shadow-sm">
// //                     <BiRocket className="text-blue-600" />
// //                     <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">The Future of Learning is Here</span>
// //                 </div>

// //                 <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.1] tracking-tighter">
// //                     Master New Skills with <br />
// //                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
// //                         AI-Powered Courses
// //                     </span>
// //                 </h1>

// //                 <p className="mt-8 text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium">
// //                     Experience a revolutionary way of learning with our expert-led video courses, 
// //                     integrated with Gemini AI for instant search and smart predictions.
// //                 </p>

// //                 {/* --- Action Buttons --- */}
// //                 <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5">
// //                     <button 
// //                         onClick={() => navigate('/all-courses')}
// //                         className="px-10 py-5 bg-black text-white rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all shadow-xl shadow-gray-200"
// //                     >
// //                         Explore Courses
// //                     </button>
                    
// //                     <button 
// //                         onClick={() => navigate('/search-ai')}
// //                         className="px-10 py-5 bg-white text-black border-2 border-gray-100 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all flex items-center gap-3"
// //                     >
// //                         <BiPlayCircle className="text-2xl text-blue-600" /> 
// //                         Try AI Search
// //                     </button>
// //                 </div>
// //             </motion.div>

// //             {/* --- Bottom Stats / Trust Badges --- */}
// //             <div className="mt-20 pt-10 border-t border-gray-50 w-full max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-8 opacity-50">
// //                 <div className="text-center">
// //                     <p className="text-2xl font-bold text-gray-900">10k+</p>
// //                     <p className="text-xs font-bold uppercase text-gray-400">Students</p>
// //                 </div>
// //                 <div className="text-center">
// //                     <p className="text-2xl font-bold text-gray-900">500+</p>
// //                     <p className="text-xs font-bold uppercase text-gray-400">Courses</p>
// //                 </div>
// //                 <div className="text-center">
// //                     <p className="text-2xl font-bold text-gray-900">4.9/5</p>
// //                     <p className="text-xs font-bold uppercase text-gray-400">Rating</p>
// //                 </div>
// //                 <div className="text-center">
// //                     <p className="text-2xl font-bold text-gray-900">24/7</p>
// //                     <p className="text-xs font-bold uppercase text-gray-400">Support</p>
// //                 </div>
// //             </div>
// //         </section>
// //     );
// // };

// // export default Hero;

// // import React from 'react';
// // import home from '../assets/home1.jpg';
// // import { useNavigate } from 'react-router-dom';
// // import { BiRocket, BiPlayCircle } from 'react-icons/bi';

// // const Hero = () => {
// //     const navigate = useNavigate();

// //     return (
// //         <section className="relative w-full min-h-[85vh] flex flex-col items-center justify-center text-center px-6 bg-white overflow-hidden pt-[100px] font-jakarta">
            
// //             {/* --- Decorative Blur Elements --- */}
// //             <div className="absolute top-10 left-[-5%] w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-40"></div>
// //             <div className="absolute bottom-10 right-[-10%] w-80 h-80 bg-purple-100 rounded-full blur-3xl opacity-40"></div>

// //             {/* --- Hero Content --- */}
// //             <div className="max-w-4xl z-10 flex flex-col items-center">
                
// //                 {/* Badge */}
// //                 <div className="inline-flex items-center gap-2.5 bg-gray-50 border border-gray-100 px-5 py-2.5 rounded-full mb-10 shadow-inner">
// //                     <BiRocket className="text-blue-600 text-lg" />
// //                     <span className="text-xs font-bold text-gray-700 uppercase tracking-widest">
// //                         Revolutionizing Education with AI
// //                     </span>
// //                 </div>

// //                 {/* Heading */}
// //                 <h1 className="text-5xl md:text-7xl font-black text-gray-950 leading-[1.05] tracking-tighter">
// //                     Unlock Your Potential with <br />
// //                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
// //                         Smart Video Courses
// //                     </span>
// //                 </h1>

// //                 {/* Subtitle */}
// //                 <p className="mt-10 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-medium">
// //                     Dive into our diverse range of expert-led video lectures, enhanced with 
// //                     intelligent Gemini AI for precise searches and smart recommendations.
// //                 </p>

// //                 {/* Action Buttons */}
// //                 <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-6 w-full">
// //                     <button 
// //                         onClick={() => navigate('/all-courses')}
// //                         className="w-full sm:w-auto px-12 py-5 bg-gray-950 text-white rounded-3xl font-bold text-lg hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 active:scale-95"
// //                     >
// //                         Explore Courses
// //                     </button>
                    
// //                     <button 
// //                         onClick={() => navigate('/search-ai')}
// //                         className="w-full sm:w-auto px-12 py-5 bg-white text-gray-950 border-2 border-gray-100 rounded-3xl font-bold text-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-3 active:scale-95"
// //                     >
// //                         <BiPlayCircle className="text-3xl text-blue-600" /> 
// //                         Try AI Search
// //                     </button>
// //                 </div>
// //             </div>

// //             {/* --- Trust Badges / Stats Section (Optional but looks professional) --- */}
// //             <div className="mt-24 w-full max-w-6xl border-t border-gray-100 pt-10 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40">
// //                 <div className="text-center">
// //                     <p className="text-3xl font-black text-gray-950">25K+</p>
// //                     <p className="text-xs font-bold uppercase text-gray-500 tracking-wider">Active Students</p>
// //                 </div>
// //                 <div className="text-center">
// //                     <p className="text-3xl font-black text-gray-950">800+</p>
// //                     <p className="text-xs font-bold uppercase text-gray-500 tracking-wider">Courses</p>
// //                 </div>
// //                 <div className="text-center">
// //                     <p className="text-3xl font-black text-gray-950">4.9/5</p>
// //                     <p className="text-xs font-bold uppercase text-gray-500 tracking-wider">Rating</p>
// //                 </div>
// //                 <div className="text-center">
// //                     <p className="text-3xl font-black text-gray-950">24/7</p>
// //                     <p className="text-xs font-bold uppercase text-gray-500 tracking-wider">Support</p>
// //                 </div>
// //             </div>

// //         </section>
// //     );
// // };

// // export default Hero;