import React from 'react';

const Achievements = () => {
    // Achievements ka data array
    const badgesData = [
        // Unlocked Badges
        { id: 1, icon: '🥇', name: 'First Step', message: 'First Step: Completed your first lesson!', isLocked: false },
        { id: 2, icon: '🗄️', name: 'SQL Expert', message: 'SQL Expert: Completed SQL course!', isLocked: false },
        { id: 3, icon: '🔥', name: 'Week Warrior', message: 'Week Warrior: 7-day study streak!', isLocked: false },
        { id: 4, icon: '🦉', name: 'Night Owl', message: 'Night Owl: Studied after midnight!', isLocked: false },
        
        // Locked Badges (unlocked nahi huye hain)
        { id: 5, icon: '⚡', name: 'Speed Learner', message: 'Speed Learner: Locked — finish a course in under 7 days', isLocked: true },
        { id: 6, icon: '⭐', name: 'Top Rated', message: 'Top Rated: Locked — get 100 upvotes on answers', isLocked: true },
        { id: 7, icon: '🤝', name: 'Mentor', message: 'Mentor: Locked — help 10 learners', isLocked: true },
        { id: 8, icon: '👑', name: 'Legend', message: 'Legend: Locked — complete 10 courses', isLocked: true },
    ];

    const handleBadgeClick = (message) => {
        alert(message);
        // Yahan par custom Toast lagaya ja sakta hai future me
    };

    return (
        <div className="bg-white rounded-[24px] border border-black/5 p-2.5 shadow-sm h-full">
            
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4">
                <span className="text-[15px] font-bold text-[#0a0b0f]">
                    Achievements
                </span>
                <button 
                    onClick={() => alert("Opening all achievements...")}
                    className="text-[13px] text-[#d4a843] cursor-pointer font-medium hover:underline focus:outline-none"
                >
                    See all →
                </button>
            </div>

            {/* Badges Grid */}
            {/* 4 columns layout, margin/padding adjusted to match image */}
            <div className="grid grid-cols-4 gap-6 px-7 pt-4 pb-10">
                {badgesData.map((badge) => (
                    <div 
                        key={badge.id}
                        onClick={() => handleBadgeClick(badge.message)}
                        // Agar locked hai toh pura item 40% opaque dikhega
                        className={`text-center cursor-pointer transition-transform duration-200 hover:scale-[1.08] ${
                            badge.isLocked ? 'opacity-40' : 'opacity-100'
                        }`}
                    >
                        {/* Icon Circle */}
                        {/* Background color aapke image wale 'cream2' jaisa rakha hai */}
                        <div 
                            className={`mx-auto text-[32px] w-[70px] h-[70px] bg-[#f2efe6] rounded-full flex items-center justify-center border border-transparent transition-colors hover:border-[#d4a843] ${
                                badge.isLocked ? 'grayscale' : 'grayscale-0'
                            }`}
                        >
                            {badge.icon}
                        </div>
                        
                        {/* Badge Name */}
                        <div className="text-[11px] text-[#4a4c58] font-medium mt-3">
                            {badge.name}
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default Achievements;