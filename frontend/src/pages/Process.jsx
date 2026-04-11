import React, { useEffect, useState } from 'react';

const Process = () => {
  const [animateBars, setAnimateBars] = useState(false);

  // Jab user scroll karke yahan aayega, tab bars animate honge
  useEffect(() => {
    const timer = setTimeout(() => setAnimateBars(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const steps = [
    { num: "01", title: "Create your free account", text: "Sign up in 30 seconds. No credit card required. Instantly access 200+ free lessons." },
    { num: "02", title: "Get your learning path", text: "Tell us your goals. Our AI crafts a personalised curriculum just for you." },
    { num: "03", title: "Learn at your own pace", text: "Watch lessons, complete challenges, and track progress on any device, anytime." },
    { num: "04", title: "Earn & share certificates", text: "Complete your path, earn a verified certificate, and share it with the world." },
  ];

  return (
    <section className="py-24 px-6 md:px-14 bg-[#F8F1E3]" id="process">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        
        {/* Left Side: Steps */}
        <div className="animate-fade-up">
          <span className="text-[11.5px] tracking-[2px] uppercase text-[#d4a843] font-semibold block mb-4">Process</span>
          <h2 className="font-cormorant text-[clamp(32px,5vw,58px)] font-light leading-[1.2] text-[#0a0b0f] mb-10">
            Learning made <br /><span className="italic text-[#d4a843]">effortless</span>
          </h2>
          
          <div className="flex flex-col">
            {steps.map((step, index) => (
              <div key={index} className="group flex gap-8 py-8 border-b border-black/5 last:border-none cursor-pointer transition-all">
                <div className="font-cormorant text-5xl font-bold text-[#d4a843]/20 group-hover:text-[#d4a843]/60 transition-colors duration-300">
                  {step.num}
                </div>
                <div>
                  <h3 className="font-cormorant text-2xl font-semibold text-[#0a0b0f] mb-2">{step.title}</h3>
                  <p className="font-outfit text-gray-500 text-[14.5px] font-light leading-relaxed">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Visual Dashboard */}
        <div className="bg-[#0a0b0f] rounded-[32px] p-10 relative overflow-hidden shadow-2xl animate-fade-up delay-300">
          {/* Subtle Glow Effect */}
          <div className="absolute -top-16 -right-16 w-60 h-60 rounded-full bg-[#d4a843]/10 blur-[80px]"></div>
          
          <div className="relative z-10">
            <span className="text-[10px] text-white/30 tracking-widest uppercase mb-6 block">Your Progress Dashboard</span>
            
            {/* Course Completion Card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-4">
              <span className="text-[11px] text-white/40 uppercase tracking-wider mb-4 block">Course Completion</span>
              
              <ProgressBar label="Machine Learning" val="78%" color="bg-gradient-to-r from-[#d4a843] to-[#f0a500]" width={animateBars ? "78%" : "0%"} />
              <ProgressBar label="React Advanced" val="52%" color="bg-gradient-to-r from-[#3ecfc6] to-[#36b5ad]" width={animateBars ? "52%" : "0%"} />
              <ProgressBar label="Data Visualization" val="91%" color="bg-gradient-to-r from-[#c4aeff] to-[#a78bfa]" width={animateBars ? "91%" : "0%"} />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-[#d4a843]/10 border border-[#d4a843]/20 rounded-xl p-5 text-center transition-transform hover:scale-105">
                <div className="font-cormorant text-3xl font-bold text-[#d4a843]">14</div>
                <div className="text-[10px] text-white/40 mt-1 uppercase">Day Streak 🔥</div>
              </div>
              <div className="bg-[#3ecfc6]/10 border border-[#3ecfc6]/20 rounded-xl p-5 text-center transition-transform hover:scale-105">
                <div className="font-cormorant text-3xl font-bold text-[#3ecfc6]">320</div>
                <div className="text-[10px] text-white/40 mt-1 uppercase">XP Points ⚡</div>
              </div>
            </div>

            {/* Certificate Alert */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4 hover:bg-white/10 transition-colors cursor-pointer">
              <span className="text-3xl">🎓</span>
              <div>
                <div className="text-sm font-semibold text-white/90">Certificate Earned!</div>
                <div className="text-[11px] text-white/30 mt-1">SQL & Database Design — Level 2</div>
              </div>
              <span className="ml-auto text-[11px] text-[#d4a843] font-medium uppercase tracking-wider">View →</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

// Reusable Progress Bar Component
const ProgressBar = ({ label, val, color, width }) => (
  <div className="mb-4">
    <div className="flex justify-between text-[11px] mb-2">
      <span className="text-white/40">{label}</span>
      <span className="text-white/80 font-medium">{val}</span>
    </div>
    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-[1500ms] ease-out ${color}`} style={{ width }}></div>
    </div>
  </div>
);

export default Process;