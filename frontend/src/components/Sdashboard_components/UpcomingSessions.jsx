import React from 'react';

const UpcomingSessions = () => {
    // Schedule ka data array
    const scheduleData = [
        {
            id: 1,
            day: '28',
            month: 'MAR',
            title: 'Python Live Q&A Session',
            subtitle: '6:00 PM · with Arjun Mehta',
            tagLabel: 'Live',
            tagStyle: 'bg-[#3ecfc6]/10 text-[#0f6e56]', // Teal transparent bg, dark teal text
            onClickMessage: 'Joining Python Live Q&A… 🐍'
        },
        {
            id: 2,
            day: '30',
            month: 'MAR',
            title: 'React Performance Workshop',
            subtitle: '4:00 PM · Zoom · 90 min',
            tagLabel: 'Workshop',
            tagStyle: 'bg-[#d4a843]/10 text-[#8a5a00]', // Gold transparent bg, dark gold text
            onClickMessage: 'Opening React Workshop… ⚛️'
        },
        {
            id: 3,
            day: '02',
            month: 'APR',
            title: 'UI/UX Assignment Due',
            subtitle: 'Submit Figma prototype',
            tagLabel: 'Due',
            tagStyle: 'bg-[#f26a5e]/10 text-[#993c1d]', // Coral transparent bg, dark coral text
            onClickMessage: 'Opening Assignment… 📝'
        }
    ];

    const handleItemClick = (message) => {
        alert(message);
        // Custom Toast function future me yahan ayega
    };

    return (
        <div className="bg-white rounded-[24px] border border-black/5 p-2.5 shadow-sm h-full">
            
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4">
                <span className="text-[15px] font-bold text-[#0a0b0f]">
                    Upcoming Sessions
                </span>
                <button 
                    onClick={() => alert("Opening schedule… 🗓️")}
                    className="text-[13px] text-[#d4a843] cursor-pointer font-medium hover:underline focus:outline-none"
                >
                    View schedule →
                </button>
            </div>

            {/* List Items */}
            <div className="flex flex-col">
                {scheduleData.map((item, index) => (
                    <div 
                        key={item.id}
                        onClick={() => handleItemClick(item.onClickMessage)}
                        className={`flex items-center gap-4 px-5 py-3.5 hover:bg-[#fafaf8] transition-colors cursor-pointer ${
                            index !== 0 ? 'border-t border-black/5' : ''
                        }`}
                    >
                        {/* Date Block */}
                        <div className="w-[44px] text-center shrink-0">
                            <div className="font-['Cormorant_Garamond'] text-[22px] font-bold text-[#0a0b0f] leading-none mb-1">
                                {item.day}
                            </div>
                            <div className="text-[10px] text-[#8a8c98] tracking-[0.5px] uppercase font-medium">
                                {item.month}
                            </div>
                        </div>

                        {/* Info Block */}
                        <div className="flex-1 min-w-0">
                            <div className="text-[13px] font-semibold text-[#0a0b0f] truncate">
                                {item.title}
                            </div>
                            <div className="text-[12px] text-[#8a8c98] mt-0.5 truncate">
                                {item.subtitle}
                            </div>
                        </div>

                        {/* Tag/Badge */}
                        <span className={`text-[11px] font-bold px-2 py-1 rounded-md shrink-0 ${item.tagStyle}`}>
                            {item.tagLabel}
                        </span>
                    </div>
                ))}
            </div>
            
        </div>
    );
};

export default UpcomingSessions;