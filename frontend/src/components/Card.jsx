import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast'; 

const Card = ({ id, thumbnail, title, category, price, reviews, rating = "4.5", instructor = "Expert Instructor" }) => {
    const navigate = useNavigate();
    
    // Redux se check karein ki user Login hai ya nahi
    const { user } = useSelector((state) => state.auth || state.user); 

    const isFree = !price || price === 0;

    // --- ENROLLMENT LOGIC ---
    const handleEnroll = async (e) => {
        e.stopPropagation(); // Card ke normal click ko rokne ke liye

        // Step 1: Authentication Check
        if (!user) {
            toast.error("Please login to enroll in courses!");
            navigate('/login'); // User ko login page par bhej dein
            return;
        }

        if (isFree) {
            // Step 2: API Call (Database Update)
            try {
                const toastId = toast.loading("Enrolling...");

                const response = await axios.post(
                    `http://localhost:8000/api/course/${id}/enroll`,
                    {}, 
                    { withCredentials: true } 
                );

                // Step 3: Success Notification & Redirect
                toast.success(response.data.message, { id: toastId });
                navigate(`/course-player/${id}`); 

            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to enroll");
                
                if(error.response?.status === 400) {
                     navigate(`/course-player/${id}`);
                }
            }
        } else {
            toast("Redirecting to payment gateway...", { icon: '💳' });
        }
    };

    return (
        <div 
            className="bg-white rounded-[24px] overflow-hidden border border-black/5 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group cursor-pointer"
            onClick={() => navigate(`/course-view/${id}`)}
        >
            {/* --- Thumbnail Area --- */}
            <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                {thumbnail ? (
                    <img 
                        src={thumbnail} 
                        alt={title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                            e.target.onerror = null; 
                            e.target.src = "https://placehold.co/600x400/eeeeee/cccccc?text=Course+Image";
                        }}
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#0f1a35] to-[#0a1020] flex items-center justify-center">
                        <span className="text-white font-bold text-xl opacity-50">SkillLink</span>
                    </div>
                )}
                
                {category && (
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-[#0a0b0f] shadow-sm">
                        {category}
                    </div>
                )}
            </div>

            {/* --- Content Area --- */}
            <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-lg text-[#0a0b0f] leading-snug line-clamp-2 mb-2 group-hover:text-[#d4a843] transition-colors">
                    {title}
                </h3>
                
                <p className="text-sm text-gray-500 mb-4 flex-1 line-clamp-1">
                    by <span className="font-medium text-gray-700">{instructor}</span>
                </p>

                <div className="flex items-center gap-1.5 mb-5">
                    <span className="text-yellow-400 text-sm">★</span>
                    <span className="text-sm font-bold text-gray-800">{rating}</span>
                    <span className="text-xs text-gray-400">({reviews || 0} reviews)</span>
                </div>

                <div className="w-full h-px bg-gray-100 mb-4"></div>

                {/* Footer: Price & Action */}
                <div className="flex items-center justify-between mt-auto">
                    <div className="font-extrabold text-xl text-[#0a0b0f]">
                        {isFree ? <span className="text-green-600">Free</span> : `₹${price.toLocaleString('en-IN')}`}
                    </div>
                    
                    <button 
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                            isFree 
                            ? 'bg-[#0a0b0f] text-white hover:bg-gray-800' 
                            : 'bg-[#d4a843]/10 text-[#8a5a00] hover:bg-[#d4a843]/20'
                        }`}
                        onClick={handleEnroll} 
                    >
                        {isFree ? 'Enroll for Free' : 'Buy Now'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Card;


// import React from 'react';
// import { FaStar } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';

// const Card = ({ thumbnail, title, category, price, id, reviews }) => {
//     const navigate = useNavigate();

//     // Logic to calculate Average Rating for this specific card
//     const calculateAverageRating = (reviews) => {
//         if (!reviews || reviews.length === 0) {
//             return 0;
//         }

//         const total = reviews.reduce((sum, review) => {
//             return sum + (review.rating || 0);
//         }, 0);

//         return (total / reviews.length).toFixed(1);
//     };

//     const averageRating = calculateAverageRating(reviews);

//     return (
//         <div 
//             onClick={() => navigate(`/view-course/${id}`)}
//             className="max-w-[300px] w-full bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border cursor-pointer group"
//         >
//             {/* Course Thumbnail */}
//             <div className="relative h-48 w-full overflow-hidden">
//                 <img 
//                     src={thumbnail || 'https://via.placeholder.com/300x200?text=No+Thumbnail'} 
//                     alt={title} 
//                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                 />
//             </div>

//             {/* Course Content */}
//             <div className="p-5 space-y-2">
//                 {/* Category Badge */}
//                 <span className="px-2 py-0.5 bg-gray-100 rounded-full text-gray-600 text-[12px] font-medium capitalize">
//                     {category}
//                 </span>

//                 {/* Course Title */}
//                 <h2 className="text-lg font-semibold text-gray-800 line-clamp-2 min-h-[56px]">
//                     {title}
//                 </h2>

//                 {/* Meta Information (Price & Rating) */}
//                 <div className="flex justify-between items-center text-sm text-gray-600 mt-3 border-t pt-3">
//                     <div className="flex items-center gap-1">
//                         <span className="text-lg font-bold text-black">
//                             ₹{price || "N/A"}
//                         </span>
//                     </div>

//                     <div className="flex items-center gap-1">
//                         <span className="font-semibold text-gray-800">{averageRating}</span>
//                         <FaStar className="text-yellow-500 mb-1" />
//                         <span className="text-gray-400 text-xs">({reviews?.length || 0})</span>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Card;