import React from 'react';

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-[#0a0b0f] pt-20 pb-10 px-6 md:px-14 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        
        {/* Footer Top: Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          
          {/* Brand Column (2 columns wide on desktop) */}
          <div className="lg:col-span-2">
            <span 
              onClick={scrollToTop}
              className="font-cormorant text-3xl font-bold text-white cursor-pointer block mb-6"
            >
              Edu<span className="text-[#d4a843]">Nova</span>
            </span>
            <p className="font-outfit text-white/40 text-sm leading-relaxed max-w-xs font-light">
              The world's most elegant learning management system. Built for ambitious minds.
            </p>
            
            {/* Social Icons */}
            <div className="flex gap-3 mt-8">
              {['𝕏', 'in', '▶', '◉'].map((icon, idx) => (
                <div 
                  key={idx}
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 text-sm cursor-pointer transition-all hover:bg-[#d4a843]/15 hover:border-[#d4a843]/30 hover:text-[#d4a843] hover:-translate-y-1"
                >
                  {icon}
                </div>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-[11px] font-bold tracking-[1.5px] uppercase text-white/30 mb-6">Product</h4>
            <ul className="flex flex-col gap-3 font-outfit text-sm font-light">
              <FooterLink label="Courses" target="courses" />
              <FooterLink label="Learning Paths" isComingSoon />
              <FooterLink label="Certificates" isComingSoon />
              <FooterLink label="For Teams" />
              <FooterLink label="Pricing" />
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-[11px] font-bold tracking-[1.5px] uppercase text-white/30 mb-6">Company</h4>
            <ul className="flex flex-col gap-3 font-outfit text-sm font-light text-white/40">
              <FooterLink label="About" />
              <FooterLink label="Blog" />
              <FooterLink label="Careers" />
              <FooterLink label="Contact" />
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-[11px] font-bold tracking-[1.5px] uppercase text-white/30 mb-6">Legal</h4>
            <ul className="flex flex-col gap-3 font-outfit text-sm font-light text-white/40">
              <FooterLink label="Privacy Policy" />
              <FooterLink label="Terms of Use" />
              <FooterLink label="Refund Policy" />
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-[13px] text-white/20 font-light">
            © 2026 EduNova Technologies Pvt. Ltd. All rights reserved.
          </div>
          <div className="text-[13px] text-white/20 font-light">
            Made with <span className="text-[#d4a843]">♥</span> in India
          </div>
        </div>
      </div>
    </footer>
  );
};

// Helper Component for Links
const FooterLink = ({ label, target, isComingSoon }) => (
  <li 
    onClick={() => target && document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' })}
    className="text-white/40 hover:text-[#d4a843] transition-colors cursor-pointer"
  >
    {label} {isComingSoon && <span className="text-[10px] opacity-40 italic ml-1">(Soon)</span>}
  </li>
);

export default Footer;
// import React from 'react';
// import { Link } from 'react-router-dom';
// import { 
//     FaFacebookF, 
//     FaTwitter, 
//     FaInstagram, 
//     FaLinkedinIn, 
//     FaPhoneAlt, 
//     FaEnvelope, 
//     FaMapMarkerAlt 
// } from 'react-icons/fa';

// const Footer = () => {
//     return (
//         <footer className="bg-white border-t border-gray-200 pt-16 pb-8 px-5 sm:px-10 lg:px-20">
//             <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                
//                 {/* --- Column 1: Brand & About --- */}
//                 <div className="space-y-6">
//                     <Link to="/" className="text-2xl font-bold text-black flex items-center gap-2">
//                         <span className="bg-black text-white px-2 py-1 rounded-lg">V</span>
//                         Virtual Course
//                     </Link>
//                     <p className="text-gray-500 text-sm leading-relaxed">
//                         Empowering learners worldwide with high-quality, accessible education. Join our community and start your journey toward mastering new skills today.
//                     </p>
//                     <div className="flex gap-4">
//                         <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-black hover:text-white transition-all cursor-pointer">
//                             <FaFacebookF size={14} />
//                         </div>
//                         <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-black hover:text-white transition-all cursor-pointer">
//                             <FaTwitter size={14} />
//                         </div>
//                         <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-black hover:text-white transition-all cursor-pointer">
//                             <FaInstagram size={14} />
//                         </div>
//                         <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-black hover:text-white transition-all cursor-pointer">
//                             <FaLinkedinIn size={14} />
//                         </div>
//                     </div>
//                 </div>

//                 {/* --- Column 2: Quick Links --- */}
//                 <div>
//                     <h3 className="text-lg font-bold text-gray-800 mb-6">Quick Links</h3>
//                     <ul className="space-y-4 text-gray-500 text-sm">
//                         <li><Link to="/" className="hover:text-black transition-colors">Home</Link></li>
//                         <li><Link to="/all-courses" className="hover:text-black transition-colors">All Courses</Link></li>
//                         <li><Link to="/about" className="hover:text-black transition-colors">About Us</Link></li>
//                         <li><Link to="/contact" className="hover:text-black transition-colors">Contact</Link></li>
//                     </ul>
//                 </div>

//                 {/* --- Column 3: Categories --- */}
//                 <div>
//                     <h3 className="text-lg font-bold text-gray-800 mb-6">Popular Categories</h3>
//                     <ul className="space-y-4 text-gray-500 text-sm">
//                         <li><Link to="/all-courses" className="hover:text-black transition-colors">Web Development</Link></li>
//                         <li><Link to="/all-courses" className="hover:text-black transition-colors">Data Science</Link></li>
//                         <li><Link to="/all-courses" className="hover:text-black transition-colors">UI/UX Design</Link></li>
//                         <li><Link to="/all-courses" className="hover:text-black transition-colors">Ethical Hacking</Link></li>
//                     </ul>
//                 </div>

//                 {/* --- Column 4: Contact Info --- */}
//                 <div>
//                     <h3 className="text-lg font-bold text-gray-800 mb-6">Contact Us</h3>
//                     <ul className="space-y-4 text-gray-500 text-sm">
//                         <li className="flex items-center gap-3">
//                             <FaPhoneAlt className="text-black" />
//                             <span>+91 98765 43210</span>
//                         </li>
//                         <li className="flex items-center gap-3">
//                             <FaEnvelope className="text-black" />
//                             <span>support@virtualcourse.com</span>
//                         </li>
//                         <li className="flex items-center gap-3 leading-relaxed">
//                             <FaMapMarkerAlt className="text-black text-xl" />
//                             <span>123 Education Lane, Tech City, Gujarat, India</span>
//                         </li>
//                     </ul>
//                 </div>

//             </div>

//             {/* --- Bottom Bar --- */}
//             <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 text-xs">
//                 <p>© 2026 Virtual Course LMS. All rights reserved.</p>
//                 <div className="flex gap-6">
//                     <span className="hover:text-gray-600 cursor-pointer transition-colors">Privacy Policy</span>
//                     <span className="hover:text-gray-600 cursor-pointer transition-colors">Terms of Service</span>
//                 </div>
//             </div>
//         </footer>
//     );
// };

// export default Footer;