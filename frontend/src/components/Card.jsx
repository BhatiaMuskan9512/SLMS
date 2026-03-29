import React from 'react';
import { FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Card = ({ thumbnail, title, category, price, id, reviews }) => {
    const navigate = useNavigate();

    // Logic to calculate Average Rating for this specific card
    const calculateAverageRating = (reviews) => {
        if (!reviews || reviews.length === 0) {
            return 0;
        }

        const total = reviews.reduce((sum, review) => {
            return sum + (review.rating || 0);
        }, 0);

        return (total / reviews.length).toFixed(1);
    };

    const averageRating = calculateAverageRating(reviews);

    return (
        <div 
            onClick={() => navigate(`/view-course/${id}`)}
            className="max-w-[300px] w-full bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border cursor-pointer group"
        >
            {/* Course Thumbnail */}
            <div className="relative h-48 w-full overflow-hidden">
                <img 
                    src={thumbnail || 'https://via.placeholder.com/300x200?text=No+Thumbnail'} 
                    alt={title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
            </div>

            {/* Course Content */}
            <div className="p-5 space-y-2">
                {/* Category Badge */}
                <span className="px-2 py-0.5 bg-gray-100 rounded-full text-gray-600 text-[12px] font-medium capitalize">
                    {category}
                </span>

                {/* Course Title */}
                <h2 className="text-lg font-semibold text-gray-800 line-clamp-2 min-h-[56px]">
                    {title}
                </h2>

                {/* Meta Information (Price & Rating) */}
                <div className="flex justify-between items-center text-sm text-gray-600 mt-3 border-t pt-3">
                    <div className="flex items-center gap-1">
                        <span className="text-lg font-bold text-black">
                            ₹{price || "N/A"}
                        </span>
                    </div>

                    <div className="flex items-center gap-1">
                        <span className="font-semibold text-gray-800">{averageRating}</span>
                        <FaStar className="text-yellow-500 mb-1" />
                        <span className="text-gray-400 text-xs">({reviews?.length || 0})</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;