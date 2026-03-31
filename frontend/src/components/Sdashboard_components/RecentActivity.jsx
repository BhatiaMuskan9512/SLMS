import React from 'react';

const RecentActivity = () => {
    // Data array with mixed text styles using inline JSX
    const activities = [
        {
            id: 1,
            icon: '✅',
            bgClass: 'bg-[#3ecfc6]/10',
            content: <>Completed <strong className="font-semibold text-gray-900">Chapter 3</strong> — Python for Data Science</>,
            time: '2 hours ago'
        },
        {
            id: 2,
            icon: '🏆',
            bgClass: 'bg-[#d4a843]/10',
            content: <>Earned <strong className="font-semibold text-gray-900">SQL Expert</strong> certificate</>,
            time: 'Yesterday'
        },
        {
            id: 3,
            icon: '📝',
            bgClass: 'bg-[#a78bfa]/10',
            content: <>Submitted <strong className="font-semibold text-gray-900">React Assignment #4</strong></>,
            time: '2 days ago'
        },
        {
            id: 4,
            icon: '⭐',
            bgClass: 'bg-[#6bcb77]/10',
            content: <>Rated <strong className="font-semibold text-gray-900">UI/UX Design</strong> course — 5 stars</>,
            time: '3 days ago'
        },
        {
            id: 5,
            icon: '🔥',
            bgClass: 'bg-[#f26a5e]/10',
            content: <>Reached <strong className="font-semibold text-gray-900">7-day streak</strong> milestone!</>,
            time: '4 days ago'
        }
    ];

    return (
        <div className="bg-white rounded-[24px] border border-black/5 p-2.5 shadow-sm h-full">
            
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4">
                <span className="text-[15px] font-bold text-[#0a0b0f]">
                    Recent Activity
                </span>
            </div>

            {/* Activity List */}
            <div className="flex flex-col">
                {activities.map((activity, index) => (
                    <div 
                        key={activity.id}
                        className={`flex items-start gap-3 px-5 py-4 hover:bg-[#fafaf8] transition-colors cursor-pointer ${
                            index !== 0 ? 'border-t border-black/5' : ''
                        }`}
                    >
                        {/* Circle Icon */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 mt-0.5 ${activity.bgClass}`}>
                            {activity.icon}
                        </div>

                        {/* Text Info */}
                        <div className="flex-1 min-w-0">
                            <div className="text-[13px] text-[#4a4c58] leading-relaxed">
                                {activity.content}
                            </div>
                            <div className="text-[11px] text-[#8a8c98] mt-1">
                                {activity.time}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
        </div>
    );
};

export default RecentActivity;