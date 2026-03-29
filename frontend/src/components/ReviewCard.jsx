import React from 'react';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';

const ReviewCard = ({ user, rating, comment, createdAt }) => {
    
    // Function to render the correct number of stars based on the rating
    const renderStars = (num) => {
        return [...Array(5)].map((_, index) => (
            <FaStar 
                key={index} 
                className={index < num ? "text-yellow-400" : "text-gray-200"} 
            />
        ));
    };

    // Format the date to a readable string (e.g., "Oct 24, 2023")
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="min-w-[300px] max-w-[350px] bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4 hover:shadow-md transition-shadow duration-300">
            
            {/* --- Quote Icon & Rating --- */}
            <div className="flex justify-between items-center">
                <FaQuoteLeft className="text-gray-200 text-2xl" />
                <div className="flex gap-0.5 text-sm">
                    {renderStars(rating)}
                </div>
            </div>

            {/* --- Review Comment --- */}
            <p className="text-gray-600 text-[15px] leading-relaxed italic line-clamp-4 min-h-[90px]">
                "{comment}"
            </p>

            {/* --- User Info Section --- */}
            <div className="flex items-center gap-3 mt-2 pt-4 border-t border-gray-50">
                <img 
                    src={user?.photoUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                    alt={user?.name} 
                    className="w-10 h-10 rounded-full object-cover border border-gray-100"
                />
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-800 truncate max-w-[150px]">
                        {user?.name || "Anonymous User"}
                    </span>
                    <span className="text-[11px] text-gray-400 uppercase tracking-wider">
                        {createdAt ? formatDate(createdAt) : "Recently"}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ReviewCard;