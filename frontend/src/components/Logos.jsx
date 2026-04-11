import React from 'react';

const Logos = () => {
  const featuresData = [
    {
      icon: "🧠",
      title: "AI-Powered Paths",
      text: "Personalized learning journeys that adapt in real-time to your skill level, pace, and career goals.",
      isFeatured: true, // Black card ke liye
    },
    {
      icon: "🎥",
      title: "HD Video Lessons",
      text: "Cinematic quality content from world-renowned instructors. Offline downloads, captions in 40+ languages.",
    },
    {
      icon: "📊",
      title: "Smart Analytics",
      text: "Deep insights into your learning patterns, strengths, and areas to improve with beautiful visual dashboards.",
    },
    {
      icon: "🏆",
      title: "Live Challenges & XP",
      text: "Gamified experience with daily challenges, streak rewards, leaderboards, and XP points to keep you motivated.",
    },
    {
      icon: "💬",
      title: "Community & Mentors",
      text: "Connect with peers, ask instructors questions, and join live group sessions with industry professionals.",
    },
    {
      icon: "🎓",
      title: "Verified Certificates",
      text: "Industry-recognised certificates on completion. Share directly to LinkedIn and impress recruiters.",
    },
  ];

  return (
    <section className="py-24 px-6 bg-[#F8F1E3]" id="features">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-16 animate-fade-up">
          <span className="text-[11.5px] tracking-[2px] uppercase text-[#d4a843] font-semibold block mb-4">
            Why SkillLink
          </span>
          <h2 className="font-cormorant text-[clamp(32px,5vw,58px)] font-light leading-[1.2] text-[#0a0b0f] mb-4">
            Everything you need to <br />
            <span className="italic text-[#d4a843]">excel</span>
          </h2>
          <p className="font-outfit text-gray-500 text-base font-light max-w-[500px]">
            Thoughtfully crafted tools that adapt to your pace, style, and goals.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuresData.map((feat, index) => (
            <div 
              key={index}
              className={`p-10 rounded-3xl transition-all duration-300 cursor-pointer border group hover:-translate-y-2 ${
                feat.isFeatured 
                ? 'bg-[#0a0b0f] border-[#0a0b0f] shadow-2xl shadow-black/20' 
                : 'bg-white border-black/5 hover:border-[#d4a843]/30 hover:shadow-xl hover:shadow-[#d4a843]/5'
              }`}
            >
              <span className="text-4xl block mb-6 group-hover:scale-110 transition-transform duration-300">
                {feat.icon}
              </span>
              <h3 className={`font-cormorant text-2xl font-semibold mb-3 ${
                feat.isFeatured ? 'text-[#e8c96d]' : 'text-[#0a0b0f]'
              }`}>
                {feat.title}
              </h3>
              <p className={`font-outfit text-sm leading-relaxed font-light ${
                feat.isFeatured ? 'text-white/50' : 'text-gray-500'
              }`}>
                {feat.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Logos;
// import React from 'react';
// import { BiSearchAlt, BiBadgeCheck, BiSupport, BiVideo } from "react-icons/bi";

// const Logos = () => {
//     // Feature data array for clean mapping
//     const features = [
//         {
//             icon: <BiSearchAlt />,
//             title: "AI-Powered Search",
//             desc: "Find the right course using natural language powered by Gemini AI."
//         },
//         {
//             icon: <BiVideo />,
//             title: "Expert-Led Content",
//             desc: "High-quality video lectures from industry professionals."
//         },
//         {
//             icon: <BiBadgeCheck />,
//             title: "Verified Certificates",
//             desc: "Earn a certificate of completion for every course you finish."
//         },
//         {
//             icon: <BiSupport />,
//             title: "24/7 Support",
//             desc: "Get your doubts cleared anytime by our dedicated support team."
//         }
//     ];

//     return (
//         <div className="w-full bg-white py-12 px-5 sm:px-10">
//             <div className="max-w-7xl mx-auto">
//                 {/* --- Grid Container --- */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
//                     {features.map((feature, index) => (
//                         <div 
//                             key={index} 
//                             className="flex flex-col items-center lg:items-start text-center lg:text-left p-6 rounded-2xl border border-gray-100 hover:border-black/10 hover:shadow-sm transition-all duration-300"
//                         >
//                             {/* Icon Circle */}
//                             <div className="w-14 h-14 bg-gray-50 text-black rounded-full flex items-center justify-center text-3xl mb-4">
//                                 {feature.icon}
//                             </div>
                            
//                             {/* Text Content */}
//                             <h3 className="text-lg font-bold text-gray-800 mb-2">
//                                 {feature.title}
//                             </h3>
//                             <p className="text-gray-500 text-sm leading-relaxed">
//                                 {feature.desc}
//                             </p>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             {/* --- Divider Line (Optional as seen in video) --- */}
//             <div className="max-w-7xl mx-auto h-[1px] bg-gray-100 mt-16"></div>
//         </div>
//     );
// };

// export default Logos;