import React from 'react';

const ReviewPage = () => {
  const reviews = [
    {
      name: "Arjun Kulkarni",
      role: "ML Engineer at Google",
      quote: "EduNova changed my career trajectory completely. The AI learning path was eerily accurate about what I needed to learn next.",
      initials: "AK",
      gradient: "from-[#e8c96d] to-[#f0a500]",
      featured: false
    },
    {
      name: "Sneha Patel",
      role: "Frontend Dev at Razorpay",
      quote: "The quality of instruction is unmatched. I went from zero to landing a ₹28 LPA role in 8 months using EduNova alone.",
      initials: "SP",
      gradient: "from-[#3ecfc6] to-[#36b5ad]",
      featured: true // Middle card highlight
    },
    {
      name: "Rohan Verma",
      role: "Data Scientist at Flipkart",
      quote: "I've tried every platform. Nothing comes close to EduNova's depth of content and how beautiful the experience is to use.",
      initials: "RV",
      gradient: "from-[#a78bfa] to-[#8b6fe0]",
      featured: false
    }
  ];

  return (
    <section className="py-24 px-6 bg-[#F8F1E3]" id="testimonials">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16 animate-fade-up">
          <span className="text-[11.5px] tracking-[2px] uppercase text-[#d4a843] font-semibold block mb-4">
            Testimonials
          </span>
          <h2 className="font-cormorant text-[clamp(32px,5vw,58px)] font-light leading-[1.2] text-[#0a0b0f] mb-4">
            Loved by <span className="italic text-[#d4a843]">learners</span><br />everywhere
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((item, index) => (
            <div 
              key={index}
              className={`p-10 rounded-3xl bg-white transition-all duration-300 group hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/5 border ${
                item.featured ? 'border-[#d4a843]/40' : 'border-black/5'
              }`}
            >
              {/* Stars */}
              <div className="text-[#d4a843] text-sm mb-6 tracking-[2px]">★★★★★</div>
              
              {/* Quote */}
              <p className="font-cormorant text-[20px] italic leading-relaxed text-[#0a0b0f] mb-8 min-h-[100px]">
                "{item.quote}"
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-4">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm bg-gradient-to-br ${item.gradient} shadow-lg shadow-black/5`}>
                  {item.initials}
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#0a0b0f]">{item.name}</div>
                  <div className="text-[12.5px] text-gray-400">{item.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewPage;
// import React, { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import ReviewCard from './ReviewCard';

// const ReviewPage = () => {
//     // 1. Extract review data from the global Redux state
//     const { reviews } = useSelector((state) => state.course);

//     // 2. Local state to store filtered "Top Reviews"
//     const [topReviews, setTopReviews] = useState([]);

//     useEffect(() => {
//         // Logic: Only show reviews with a rating of 4 or 5 on the Home Page
//         if (reviews && reviews.length > 0) {
//             const filtered = reviews.filter((rev) => rev.rating >= 4);
//             // Slice to show only the latest 8 top reviews
//             setTopReviews(filtered.slice(0, 8));
//         }
//     }, [reviews]);

//     return (
//         <div className="w-full py-20 bg-gray-50 flex flex-col items-center justify-center">
            
//             {/* --- Section Header --- */}
//             <div className="text-center mb-16 px-5">
//                 <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
//                     What Our Students Say
//                 </h2>
//                 <div className="w-20 h-1.5 bg-black mx-auto rounded-full"></div>
//                 <p className="text-gray-500 mt-6 max-w-2xl mx-auto text-[16px]">
//                     Don't just take our word for it. Join thousands of satisfied learners who have transformed their careers through our expert-led courses.
//                 </p>
//             </div>

//             {/* --- Reviews Grid/Container --- */}
//             <div className="w-full max-w-7xl px-5 sm:px-10 flex flex-wrap justify-center gap-8">
//                 {topReviews.length > 0 ? (
//                     topReviews.map((review, index) => (
//                         <ReviewCard 
//                             key={index}
//                             user={review.user}
//                             rating={review.rating}
//                             comment={review.comment}
//                             createdAt={review.createdAt}
//                         />
//                     ))
//                 ) : (
//                     // Fallback message if no 4+ star reviews exist
//                     <div className="text-center py-10">
//                         <p className="text-gray-400 italic">No featured reviews yet. Be the first to leave one!</p>
//                     </div>
//                 )}
//             </div>

//             {/* --- Stats Footer (Optional visual from video) --- */}
//             <div className="mt-20 flex flex-wrap justify-center gap-10 sm:gap-20 border-t border-gray-200 pt-10 w-[80%]">
//                 <div className="text-center">
//                     <p className="text-2xl font-bold text-black">10k+</p>
//                     <p className="text-sm text-gray-500 uppercase tracking-widest">Students</p>
//                 </div>
//                 <div className="text-center">
//                     <p className="text-2xl font-bold text-black">500+</p>
//                     <p className="text-sm text-gray-500 uppercase tracking-widest">Courses</p>
//                 </div>
//                 <div className="text-center">
//                     <p className="text-2xl font-bold text-black">4.8/5</p>
//                     <p className="text-sm text-gray-500 uppercase tracking-widest">Average Rating</p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ReviewPage;