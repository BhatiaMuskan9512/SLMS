import React from 'react';

const ExploreCourses = () => {
  const coursesData = [
    {
      id: 1,
      icon: "🤖",
      tag: "AI/ML",
      tagColor: "text-[#3ecfc6] bg-[#3ecfc6]/10",
      bgGradient: "from-[#0f1a35] to-[#0a1020]",
      title: "Machine Learning with Python & TensorFlow",
      meta: "Dr. Priya Mehra · 48 lessons · 12h",
      rating: "★★★★★ 4.9",
      price: "₹1,299"
    },
    {
      id: 2,
      icon: "⚛️",
      tag: "Frontend",
      tagColor: "text-[#d4a843] bg-[#d4a843]/10",
      bgGradient: "from-[#1a2a1f] to-[#0f1f15]",
      title: "Advanced React & System Design",
      meta: "Rahul Doshi · 60 lessons · 18h",
      rating: "★★★★★ 4.8",
      price: "₹999"
    },
    {
      id: 3,
      icon: "📊",
      tag: "Data",
      tagColor: "text-[#f26a5e] bg-[#f26a5e]/10",
      bgGradient: "from-[#2a1a30] to-[#1a0f20]",
      title: "Data Visualization with D3.js & Python",
      meta: "Anita Sharma · 36 lessons · 10h",
      rating: "★★★★☆ 4.7",
      price: "₹899"
    },
    {
      id: 4,
      icon: "☁️",
      tag: "Cloud",
      tagColor: "text-[#64b4ff] bg-[#64b4ff]/10",
      bgGradient: "from-[#2a1e0a] to-[#1a1205]",
      title: "AWS Cloud Practitioner Masterclass",
      meta: "Vikram Joshi · 52 lessons · 14h",
      rating: "★★★★★ 4.9",
      price: "₹1,499"
    }
  ];

  return (
    <section className="bg-[#0a0b0f] py-24 px-6 md:px-14 overflow-hidden" id="courses">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16 animate-fade-up">
          <span className="text-[11.5px] tracking-[2.5px] uppercase text-[#d4a843] font-semibold block mb-4">Explore</span>
          <h2 className="font-cormorant text-[clamp(32px,5vw,58px)] font-light leading-[1.2] text-white mb-4">
            Top-rated <span className="italic text-[#d4a843]">courses</span><br />this season
          </h2>
          <p className="font-outfit text-white/45 text-lg font-light max-w-[500px]">
            Hand-picked by our expert curriculum team.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {coursesData.map((course) => (
            <div 
              key={course.id}
              className="group bg-[#12141d] border border-white/5 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-[#d4a843]/30 hover:shadow-2xl hover:shadow-black/60 cursor-pointer"
            >
              {/* Thumbnail Area */}
              <div className={`h-40 flex items-center justify-center text-5xl relative bg-gradient-to-br ${course.bgGradient} transition-transform duration-500 group-hover:scale-105`}>
                <span className="transition-transform duration-500 group-hover:scale-110">{course.icon}</span>
                <div className={`absolute top-3 left-3 text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-md uppercase ${course.tagColor}`}>
                  {course.tag}
                </div>
              </div>

              {/* Info Area */}
              <div className="p-5">
                <h3 className="text-[14.5px] font-medium text-white/90 mb-2 leading-snug group-hover:text-white transition-colors">
                  {course.title}
                </h3>
                <p className="text-[12px] text-white/35 mb-4">{course.meta}</p>
                
                <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
                  <div className="text-[12px] text-[#d4a843] tracking-wider">{course.rating}</div>
                  <div className="font-cormorant text-[19px] font-bold text-[#d4a843]">{course.price}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-14 text-center">
          <button className="px-10 py-4 bg-transparent border-[1.5px] border-white/20 rounded-xl text-[14.5px] font-medium text-white/70 hover:border-[#d4a843] hover:text-[#d4a843] hover:bg-[#d4a843]/5 transition-all duration-300 active:scale-95">
            Browse all 800+ courses →
          </button>
        </div>
      </div>
    </section>
  );
};

export default ExploreCourses;

// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { BiPlayCircle } from "react-icons/bi";
// import { 
//     MdOutlineDevices, 
//     MdOutlineAutoAwesome, 
//     MdOutlineDraw, 
//     MdOutlinePhonelinkSetup, 
//     MdOutlineSecurity, 
//     MdOutlineTerminal, 
//     MdOutlineBarChart, 
//     MdOutlineMemory 
// } from "react-icons/md";

// const ExploreCourses = () => {
//     const navigate = useNavigate();

//     // Data for mapping category icons
//     const categories = [
//         { name: "Web Dev", icon: <MdOutlineDevices />, color: "bg-purple-100", textColor: "text-purple-600" },
//         { name: "UI/UX", icon: <MdOutlineDraw />, color: "bg-green-100", textColor: "text-green-600" },
//         { name: "App Dev", icon: <MdOutlinePhonelinkSetup />, color: "bg-red-100", textColor: "text-red-600" },
//         { name: "Ethical Hacking", icon: <MdOutlineSecurity />, color: "bg-blue-100", textColor: "text-blue-600" },
//         { name: "AI & ML", icon: <MdOutlineAutoAwesome />, color: "bg-yellow-100", textColor: "text-yellow-600" },
//         { name: "Data Science", icon: <MdOutlineBarChart />, color: "bg-orange-100", textColor: "text-orange-600" },
//         { name: "Data Analytics", icon: <MdOutlineMemory />, color: "bg-teal-100", textColor: "text-teal-600" },
//         { name: "AI Tools", icon: <MdOutlineTerminal />, color: "bg-indigo-100", textColor: "text-indigo-600" },
//     ];

//     return (
//         <div className="w-full min-h-[50vh] flex flex-col lg:flex-row items-center justify-center gap-4 px-[30px] py-10 bg-gray-50">
            
//             {/* --- Left / Top Section --- */}
//             <div className="w-full lg:w-[350px] flex flex-col items-center lg:items-start justify-center gap-1 text-center lg:text-left px-5">
//                 <span className="text-[35px] font-semibold text-gray-800">Explore</span>
//                 <span className="text-[35px] font-semibold text-gray-800">Our Courses</span>
//                 <p className="text-[17px] text-gray-500 mt-2">
//                     Level up your skills with our wide range of professional courses curated by industry experts.
//                 </p>
//                 <button 
//                     onClick={() => navigate('/all-courses')}
//                     className="flex items-center gap-2 px-5 py-2.5 bg-black text-white border-2 border-white rounded-[10px] text-[18px] font-light mt-10 hover:bg-gray-800 transition-all cursor-pointer"
//                 >
//                     View All Courses <BiPlayCircle className="text-2xl" />
//                 </button>
//             </div>

//             {/* --- Right / Bottom Section (Category Grid) --- */}
//             <div className="w-full max-w-[720px] flex items-center justify-center flex-wrap gap-[40px] lg:gap-[60px] py-10">
//                 {categories.map((item, index) => (
//                     <div 
//                         key={index} 
//                         className="w-[100px] h-[130px] flex flex-col items-center gap-3 text-center text-[13px] font-light cursor-pointer group"
//                         onClick={() => navigate('/all-courses')}
//                     >
//                         {/* Icon Box */}
//                         <div className={`w-[100px] h-[90px] ${item.color} ${item.textColor} rounded-xl flex items-center justify-center text-[40px] shadow-sm group-hover:shadow-md transition-all duration-300`}>
//                             {item.icon}
//                         </div>
//                         {/* Category Name */}
//                         <span className="text-gray-700 font-medium">{item.name}</span>
//                     </div>
//                 ))}
//             </div>

//         </div>
//     );
// };

// export default ExploreCourses;