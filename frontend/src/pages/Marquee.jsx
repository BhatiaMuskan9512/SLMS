import React from 'react';

const Marquee = () => {
  const items = [
    "Machine Learning", "Web Development", "Data Science", 
    "UX Design", "Cloud Computing", "Cybersecurity", 
    "Mobile Development", "Blockchain", "DevOps", "AI Engineering"
  ];

  return (
    <div className="relative bg-[#0a0b0f] py-5 overflow-hidden group">
      
      {/* 🌟 Fade Effect: Left side se dhundhla karne ke liye */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0a0b0f] to-transparent z-10 pointer-events-none"></div>
      
      {/* 🌟 Fade Effect: Right side se dhundhla karne ke liye */}
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0a0b0f] to-transparent z-10 pointer-events-none"></div>

      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-scroll {
            display: flex;
            width: max-content;
            animation: marquee 35s linear infinite;
          }
          .animate-scroll:hover {
            animation-play-state: paused;
          }
        `}
      </style>

      {/* Marquee Track */}
      <div className="animate-scroll flex items-center">
        {/* Array ko double kiya hai loop ko seamless banane ke liye */}
        {[...items, ...items].map((item, index) => (
          <div 
            key={index} 
            className="flex items-center font-cormorant text-[19px] font-light text-white/50 px-12 whitespace-nowrap cursor-pointer hover:text-[#d4a843] transition-colors"
          >
            {item}
            <span className="text-[#d4a843] ml-12 text-xl">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marquee;