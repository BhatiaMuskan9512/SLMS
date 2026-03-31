import React from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate

const CTAStrip = () => {
  const navigate = useNavigate(); // 2. Initialize navigate function

  return (
    <section className="relative py-32 px-6 overflow-hidden text-center bg-gradient-to-br from-[#fdf8ef] to-[#f5edda]">
      
      {/* Background Glow Effect... */}
      <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-radial-gradient from-[#d4a8431f] to-transparent pointer-events-none"></div>

      <div className="relative z-10 max-w-4xl mx-auto animate-fade-up">
        {/* Main Heading */}
        <h2 className="font-cormorant text-[clamp(32px,5vw,62px)] font-light text-[#0a0b0f] leading-[1.2] mb-6">
          Ready to start your <br />
          <span className="italic text-[#d4a843]">learning journey?</span>
        </h2>

        {/* Subtext */}
        <p className="font-outfit text-gray-500 text-lg font-light mb-10">
          Join 50,000+ learners. Free to start. No credit card needed.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button 
            // 3. Add onClick to navigate to login
            onClick={() => navigate('/login')} 
            className="px-10 py-5 bg-[#0a0b0f] text-white rounded-xl font-outfit font-semibold text-[16px] shadow-2xl shadow-black/10 hover:bg-[#d4a843] hover:text-[#0a0b0f] transition-all duration-300 transform hover:-translate-y-1 active:scale-95"
          >
            Start Learning Free →
          </button>
          
          <button 
            onClick={() => navigate('/all-courses')} // Isse All Courses page par bhej sakte hain
            className="px-10 py-5 border border-black/10 rounded-xl font-outfit font-medium text-[#0a0b0f] hover:bg-black/5 transition-all duration-300 active:scale-95"
          >
            Explore Courses
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTAStrip;