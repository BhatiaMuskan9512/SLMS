import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { logoutUser } from '../../../src/redux/authSlice';



// ── Helpers ───────────────────────────────────────────────
const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};
const formatDate = () =>
  new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
const getInitials = (name = '') =>
  name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'IN';
const formatINR = (n) => {
  if (n >= 100000) return '₹' + (n / 100000).toFixed(1) + 'L';
  if (n >= 1000)   return '₹' + (n / 1000).toFixed(1) + 'K';
  return '₹' + n;
};
const STRIPE_COLORS = ['#C8973A','#378ADD','#2E6E52','#C04828','#9333ea'];

// ── Sub-components ────────────────────────────────────────
const SbItem = ({ icon, label, pill, active, onClick }) => (
  <div onClick={onClick}
    className={`flex items-center gap-[9px] px-[18px] py-[9px] text-[17px] cursor-pointer border-l-[2.5px] transition-all
      ${active
        ? 'bg-[rgba(200,151,58,0.14)] text-[#E8C97A] border-[#C8973A]'
        : 'text-white/55 border-transparent hover:bg-white/5 hover:text-white/85'}`}>
    {icon}
    {label}
    {pill != null && (
      <span className="ml-auto bg-[#C8973A] text-white text-[9px] px-[6px] py-[1px] rounded-full font-medium">
        {pill}
      </span>
    )}
  </div>
);

const CourseCard = ({ course, index, onEdit }) => {
  const students = course.enrolledStudents?.length || 0;
  const progress = course.isPublished ? Math.min(40 + students / 20, 95) : 30;
  return (
    <div className="bg-[#F3EFE4] rounded-[10px] p-[13px] cursor-pointer border border-black/[0.08] hover:bg-[#EDE8DA] transition-colors">
      <div className="w-full h-14 bg-[#2E2D2A] rounded-[7px] mb-[10px] flex items-center justify-center relative overflow-hidden"
        style={{ backgroundImage: course.courseThumbnail ? `url(${course.courseThumbnail})` : undefined, backgroundSize:'cover', backgroundPosition:'center' }}>
        <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ background: STRIPE_COLORS[index % STRIPE_COLORS.length] }} />
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="2" y="2" width="16" height="12" rx="2" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2"/>
          <path d="M8 6l5 3-5 3V6z" fill="rgba(255,255,255,0.5)"/>
        </svg>
      </div>
      <span className={`text-[9px] px-[7px] py-[2px] rounded-full font-bold
        ${course.isPublished ? 'bg-[#E4F2EB] text-[#2E6E52]' : 'bg-[#FBF3E6] text-[#854F0B]'}`}>
        {course.isPublished ? 'Published' : 'Draft'}
      </span>
      <p className="text-[12px] font-medium text-[#1C1B18] mt-[5px] leading-snug line-clamp-2">{course.title}</p>
      <div className="h-[3px] bg-[#EDE8DA] rounded-full mt-[7px]">
        <div className="h-[3px] rounded-full bg-[#C8973A]" style={{ width: `${progress}%` }} />
      </div>
      <div className="flex items-center justify-between mt-[6px] text-[10px] text-[#7A7870]">
        <span>{students} students</span>
        <button onClick={(e) => { e.stopPropagation(); onEdit(course._id); }}
          className="text-[10px] text-[#C8973A] hover:underline font-medium">Edit →</button>
      </div>
    </div>
  );
};

// ── Main Dashboard ────────────────────────────────────────
const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const  [dropdownOpen,setDropdownOpen] = useState(false);


  const handleLogout = async () => {
        try {
            const res = await axios.get("http://localhost:8000/api/auth/log-out", {
                withCredentials: true 
            });

            if (res.data.success) {
                dispatch(logoutUser());
                localStorage.clear();
                toast.success(res.data.message || "Logged out successfully");
        
                navigate("/login");
            }
        } catch (error) {
            console.log(error);
            toast.error("Logout failed!");
        }
    };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/course/get-creator', { withCredentials: true });
        if (res.data) setCourses(res.data);
      } catch {
        toast.error('Database connection error!');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ── Derived stats ────────────────────────────────────────
  const totalStudents = courses.reduce((a, c) => a + (c.enrolledStudents?.length || 0), 0);
  const totalEarnings = courses.reduce((a, c) => a + (c.coursePrice * (c.enrolledStudents?.length || 0)), 0);
  const published     = courses.filter(c => c.isPublished);
  const drafts        = courses.filter(c => !c.isPublished);
  const name          = user?.name || 'Instructor';
  const initials      = getInitials(name);

  // Earnings bars: top 5 courses sorted by revenue
  const earningsData = [...courses]
    .map(c => ({ title: c.title, rev: c.coursePrice * (c.enrolledStudents?.length || 0) }))
    .sort((a, b) => b.rev - a.rev)
    .slice(0, 6);
  const maxRev = Math.max(...earningsData.map(c => c.rev), 1);
  const BAR_MONTHS = ['Nov','Dec','Jan','Feb','Mar','Apr'];

  return (
    
    <div className="flex h-screen bg-[#FAF8F2] overflow-hidden font-sans" style={{ fontFamily: 'system-ui, sans-serif' }}>

      {/* ── SIDEBAR ── */}
      <div className="w-[220px] flex-shrink-0 flex flex-col" style={{ background: '#2E2D2A' }}>
        {/* Logo + User */}
        <div className="px-[18px] pt-[22px] pb-[18px]" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-[9px] mb-[18px]">
            {/* <div className="w-8 h-8 bg-[#C8973A] rounded-lg flex items-center justify-center text-white text-sm font-medium">S</div> */}
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[24px] font-medium text-white">Skill<span className="text-[#E8C97A]">Link</span></span>
          </div>
          {/* <div className="flex items-center gap-[10px]">
            <div className="w-9 h-9 bg-[#C8973A] rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
              {initials}
            </div>
            <div>
              <div className="text-[13px] font-medium text-white">{name}</div>
              <div className="text-[10px] text-white/40 mt-[1px]">Instructor</div>
            </div>
          </div> */}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-[14px] overflow-y-auto">
          <div className="px-[18px] py-[10px] pb-[4px] text-[11px] font-medium text-white/30 uppercase tracking-widest">Workspace</div>
          <SbItem active icon={<GridIcon />} label="Dashboard" />
          <SbItem icon={<VideoIcon />} label="Manage Courses"  onClick={() => navigate('/educator/courses')} />
          <SbItem icon={<PlusCircleIcon />} label="Create Course" onClick={() => navigate('/educator/create-course')} />

          {/* <div className="px-[18px] py-[10px] pb-[4px] mt-[6px] text-[12px] font-medium text-white/30 uppercase tracking-widest">Students</div> */}
          <SbItem icon={<UserIcon /> } className="text-[12px]" label="Students" onClick={() => navigate('/educator/students')} />
          {/* <SbItem icon={<ClipboardIcon />} label="Assignments" />
          <SbItem icon={<ChatIcon />} label="Q&A" />

          <div className="px-[18px] py-[10px] pb-[4px] mt-[6px] text-[12px] font-medium text-white/30 uppercase tracking-widest">Grow</div>
          <SbItem icon={<ChartIcon />} label="Analytics" />
          <SbItem icon={<StarIcon />} label="Reviews" />
          <SbItem icon={<EarningsIcon />} label="Earnings" /> */}
        </nav>

        <div style={{ borderTop: '0.5px solid rgba(255,255,255,0.08)' }} className="py-2">
          <SbItem icon={<UserIcon />} label="Profile" onClick={() => navigate('/my-profile')}/>
          <SbItem icon={<LogoutIcon />} label="Logout" onClick={handleLogout} />
        </div>
      </div>

      {/* ── MAIN ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <div className="bg-white flex items-center justify-between px-7 h-[58px] flex-shrink-0"
            style={{ borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
            <div>
              <div className="text-[20px] font-medium text-[#1C1B18]">{getGreeting()}, {name.split(' ')[0]}</div>
              <div className="text-[14px] text-[#7A7870]">{formatDate()}</div>
            </div>

            {/* Topbar right section */}
            <div className="flex items-center gap-[10px]">
              
              {/* Bell
              <div className="w-[34px] h-[34px] rounded-lg border border-black/[0.08] bg-white flex items-center justify-center cursor-pointer relative">
                <BellIcon />
                <span className="absolute top-[7px] right-[7px] w-[6px] h-[6px] bg-[#E24B4A] rounded-full border-2 border-white" />
              </div> */}

              {/* New Course button */}
              <button onClick={() => navigate('/educator/create-course')}
                className="flex items-center gap-[5px] bg-[#2E2D2A] text-white px-4 py-2 rounded-lg text-[12px] font-medium cursor-pointer border-none">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <circle cx="6" cy="6" r="4.5" stroke="#fff" strokeWidth="1.5"/>
                  <path d="M6 3.5v5M3.5 6h5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                New Course
              </button>

              {/* Profile Avatar with Dropdown */}
              <div className="relative">
                {/* Avatar button */}
                <button
                  onClick={() => setDropdownOpen(prev => !prev)}
                  className="w-[34px] h-[34px] rounded-full bg-[#C8973A] flex items-center justify-center text-white text-[12px] font-medium cursor-pointer border-none hover:opacity-90 transition-opacity"
                >
                  {initials}
                </button>

                {/* Dropdown menu */}
                {dropdownOpen && (
                  <>
                    {/* Invisible overlay to close on outside click */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setDropdownOpen(false)}
                    />
                    <div className="absolute right-0 top-[42px] z-20 bg-white border border-black/[0.08] rounded-xl shadow-lg overflow-hidden w-[160px]">
                      
                      {/* User info header */}
                      <div className="px-4 py-3 border-b border-black/[0.06]">
                        <p className="text-[17px] font-medium text-[#1C1B18] truncate">{name}</p>
                        <p className="text-[12px] text-[#7A7870] mt-[1px]">Instructor</p>
                      </div>

                      {/* Profile option */}
                      <button
                        onClick={() => { setDropdownOpen(false); navigate('/my-profile'); }}
                        className="w-full flex items-center gap-[10px] px-4 py-[10px] text-[15px] text-[#1C1B18] hover:bg-[#F3EFE4] transition-colors cursor-pointer border-none bg-transparent"
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <circle cx="7" cy="4.5" r="2.5" stroke="#1C1B18" strokeWidth="1.2"/>
                          <path d="M2 12c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="#1C1B18" strokeWidth="1.2"/>
                        </svg>
                        Profile
                      </button>

                      {/* Logout option */}
                      <button
                        onClick={ handleLogout}
                          // setDropdownOpen(false);
                        //   try {
                        //     await axios.post('http://localhost:8000/api/user/log-out', {}, { withCredentials: true });
                        //   } catch (e) {}
                        //   dispatch(setUser(null));
                        //   dispatch(setIsAuthenticated(false));
                        //   navigate('/');
                        // }}
                        className="w-full flex items-center gap-[10px] px-4 py-[10px] text-[15px] text-red-500 hover:bg-red-50 transition-colors cursor-pointer border-none bg-transparent"
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M9.5 7H2M9.5 7L7 4.5M9.5 7L7 9.5" stroke="#ef4444" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M7 2h3.5A1.5 1.5 0 0112 3.5v7A1.5 1.5 0 0110.5 12H7" stroke="#ef4444" strokeWidth="1.2"/>
                        </svg>
                        Logout
                      </button>

                    </div>
                  </>
                )}
              </div>

            </div>
        </div>
          
          {/* <div className="flex items-center gap-[10px]">
            <div className="w-[34px] h-[34px] rounded-lg border border-black/[0.08] bg-white flex items-center justify-center cursor-pointer relative">
              <BellIcon />
              <span className="absolute top-[7px] right-[7px] w-[6px] h-[6px] bg-[#E24B4A] rounded-full border-2 border-white" />
            </div>
            <button onClick={() => navigate('/educator/create-course')}
              className="flex items-center gap-[5px] bg-[#2E2D2A] text-white px-4 py-2 rounded-lg text-[12px] font-medium cursor-pointer border-none">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="4.5" stroke="#fff" strokeWidth="1.5"/>
                <path d="M6 3.5v5M3.5 6h5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              New Course
            </button>
          <div className="w-9 h-9 bg-[#C8973A] rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
              {initials}
            </div>
          </div> */}
        

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-[22px_28px] flex flex-col gap-[18px]">

          {/* Hero */}
          <div className="relative overflow-hidden rounded-[14px] px-6 py-[75px] flex items-center justify-between" style={{ background: '#2E2D2A' }}>
            <div className="absolute right-[-30px] top-[-40px] w-[180px] h-[180px] rounded-full" style={{ background: 'rgba(200,151,58,0.12)' }} />
            <div className="absolute right-[60px] bottom-[-60px] w-[120px] h-[120px] rounded-full" style={{ background: 'rgba(200,151,58,0.07)' }} />
            <div className="z-10">
              <div className="text-[11px] text-[#E8C97A] font-medium uppercase tracking-wider mb-1">Instructor workspace</div>
              <div className="text-[22px] font-medium text-white leading-tight">Your teaching, at a glance.</div>
              <div className="text-[12px] text-white/45 mt-[5px]">
                {loading ? 'Loading your data...' :
                  drafts.length > 0 ? `${drafts.length} course${drafts.length > 1 ? 's' : ''} in draft — ready to publish?`
                  : 'All courses are live — great work!'}
              </div>
            </div>
            <div className="flex gap-[22px] z-10">
              {[
                { v: totalStudents.toLocaleString('en-IN'), l: 'Total students' },
                { v: published.length, l: 'Live courses' },
               // { v: formatINR(totalEarnings), l: 'Total earnings' },
              ].map((s, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <div className="w-[0.5px] h-10 self-center bg-white/10" />}
                  <div className="text-center">
                    <div className="text-[22px] font-medium text-white">{loading ? '—' : s.v}</div>
                    <div className="text-[10px] text-white/40 mt-[2px]">{s.l}</div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { accent: '#2E6E52', label: 'Total students', val: totalStudents.toLocaleString('en-IN'), note: 'from all courses', nc: '#2E6E52' },
              { accent: '#378ADD', label: 'Published courses', val: published.length, note: `${drafts.length} draft${drafts.length !== 1 ? 's' : ''}`, nc: '#7A7870' },
              { accent: '#C8973A', label: 'Total earnings', val: 0, note: 'from enrollments', nc: '#BA7517' },
              { accent: '#D85A30', label: 'Total courses', val: courses.length, note: 'all time', nc: '#7A7870' },
            ].map((s, i) => (
              <div key={i} className="bg-white border border-black/[0.08] rounded-xl p-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl" style={{ background: s.accent }} />
                <div className="text-[15px] text-[#7A7870] mt-[6px] mb-[10px]">{s.label}</div>
                <div className="text-[24px] font-medium text-[#1C1B18]">{loading ? '—' : s.val}</div>
                <div className="text-[10px] mt-1" style={{ color: s.nc }}>{s.note}</div>
              </div>
            ))}
          </div>

          {/* Mid row */}
          <div className="grid gap-[14px]" style={{ gridTemplateColumns: '1fr 300px' }}>
            {/* Course grid */}
            <div className="bg-white border border-black/[0.08] rounded-xl overflow-hidden">
              <div className="px-4 py-[13px] flex items-center justify-between" style={{ borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
                <span className="text-[17px] font-medium text-[#1C1B18]">My courses</span>
                <span className="text-[11px] text-[#C8973A] cursor-pointer" onClick={() => navigate('/educator/courses')}>Manage all →</span>
              </div>
              {loading ? (
                <div className="p-10 text-center text-[13px] text-[#7A7870]">Loading courses...</div>
              ) : (
                <div className="grid grid-cols-2 gap-[10px] p-[14px]">
                  {courses.slice(0, 3).map((c, i) => (
                    <CourseCard key={c._id} course={c} index={i} onEdit={(id) => navigate(`/educator/edit-course/${id}`)} />
                  ))}
                  {/* Add new course card */}
                  <div onClick={() => navigate('/educator/create-course')}
                    className="flex flex-col items-center justify-center gap-2 rounded-[10px] p-[13px] cursor-pointer"
                    style={{ border: '0.5px dashed rgba(200,151,58,0.5)', background: '#FBF6EC' }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#F5EDD8' }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <circle cx="7" cy="7" r="5.5" stroke="#C8973A" strokeWidth="1.2"/>
                        <path d="M7 4v6M4 7h6" stroke="#C8973A" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <span className="text-[11px] font-medium text-[#854F0B]">New course</span>
                  </div>
                </div>
              )}
            </div>

            {/* Activity feed */}
            <div className="bg-white border border-black/[0.08] rounded-xl overflow-hidden">
              <div className="px-4 py-[13px] flex items-center justify-between" style={{ borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
                <span className="text-[16px] font-medium text-[#1C1B18]">Activity</span>
                {/* <span className="text-[11px] text-[#C8973A] cursor-pointer">See all</span> */}
              </div>
              <div>
                {loading ? (
                  <div className="p-6 text-center text-[12px] text-[#7A7870]">...</div>
                ) : courses.length === 0 ? (
                  <div className="p-6 text-center text-[12px] text-[#7A7870]">No activity yet. Publish a course!</div>
                ) : (
                  courses.slice(0, 5).map((c, i) => {
                    const icons = [
                      { bg: '#E4F2EB', el: <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="3.5" r="2" stroke="#2E6E52" strokeWidth="1.1"/><path d="M1.5 11c0-2.49 2.01-4.5 4.5-4.5s4.5 2.01 4.5 4.5" stroke="#2E6E52" strokeWidth="1.1"/></svg> },
                      { bg: '#FBF3E6', el: <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1l1.2 2.5 2.8.4-2 2 .47 2.76L6 7.4 3.53 8.66 4 5.9 2 3.9l2.8-.4L6 1z" stroke="#BA7517" strokeWidth="1.1" strokeLinejoin="round"/></svg> },
                      { bg: '#E6F0FB', el: <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="1" y="1.5" width="10" height="7.5" rx="1.5" stroke="#1B5FA6" strokeWidth="1.1"/><path d="M5 4l3 1.75L5 7.5V4z" fill="#1B5FA6"/></svg> },
                    ];
                    const ic = icons[i % 3];
                    // const times = ['2 min ago','18 min ago','1 hr ago','Yesterday','2 days ago'];
                    return (
                      <div key={c._id} className="flex items-start gap-[10px] px-4 py-[10px]" style={{ borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
                        <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center" style={{ background: ic.bg }}>{ic.el}</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[11.5px] text-[#1C1B18] leading-snug">
                            <b className="font-medium">{c.enrolledStudents?.length || 0} students</b> enrolled in {c.title}
                          </div>
                          {/* <div className="text-[10px] text-[#7A7870] mt-[2px]">{times[i]}</div> */}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div className="grid grid-cols-2 gap-[14px]">
            {/* Quick actions */}
            <div className="bg-white border border-black/[0.08] rounded-xl overflow-hidden">
              <div className="px-4 py-[13px]" style={{ borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
                <span className="text-[17px] font-medium text-[#1C1B18]">Quick actions</span>
              </div>
              <div className="grid grid-cols-2 gap-2 p-[14px]">
                {[
                  { bg:'#2E2D2A', icon:<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="5" stroke="#fff" strokeWidth="1.2"/><path d="M6.5 4v5M4 6.5h5" stroke="#fff" strokeWidth="1.3" strokeLinecap="round"/></svg>, label:'Create course', desc:'Start a new lecture series', action: () => navigate('/educator/create-course') },
                  { bg:'#E4F2EB', icon:<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1" y="1.5" width="11" height="8" rx="1.5" stroke="#2E6E52" strokeWidth="1.2"/><path d="M5.5 4l3.5 2-3.5 2V4z" fill="#2E6E52"/></svg>, label:'Manage courses', desc:'View all your courses', action: () => navigate('/educator/courses') },
                  // { bg:'#FAF0EC', icon:<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 3c0-.55.45-1 1-1h7c.55 0 1 .45 1 1v4.5c0 .55-.45 1-1 1H7.5L6 10V8.5H3c-.55 0-1-.45-1-1V3z" stroke="#C04828" strokeWidth="1.2"/></svg>, label:'Answer Q&A', desc:'Engage with students', action: null },
                  { bg:'#E6F0FB', icon:<svg width="26" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="4" r="2.5" stroke="#1B5FA6" strokeWidth="1.2"/><path d="M1.5 12c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="#1B5FA6" strokeWidth="1.2"/></svg>, label:'View students', desc:'Enrollments & progress',  action: () => navigate('/educator/students') },
                ].map((q, i) => (
                  <div key={i} onClick={q.action}
                    className="flex flex-col gap-[5px] rounded-[10px] p-3 cursor-pointer transition-colors"
                    style={{ background: '#F3EFE4', border: '0.5px solid rgba(0,0,0,0.08)' }}
                    onMouseEnter={e => e.currentTarget.style.background='#EDE8DA'}
                    onMouseLeave={e => e.currentTarget.style.background='#F3EFE4'}>
                    <div className="w-7 h-7 rounded-[7px] flex items-center justify-center" style={{ background: q.bg }}>{q.icon}</div>
                    <div className="text-[11.5px] font-medium text-[#1C1B18]">{q.label}</div>
                    <div className="text-[10px] text-[#7A7870] leading-snug">{q.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Earnings overview */}
            <div className="bg-white border border-black/[0.08] rounded-xl overflow-hidden">
              <div className="px-4 py-[13px] flex items-center justify-between" style={{ borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
                <span className="text-[13px] font-medium text-[#1C1B18]">Earnings overview</span>
                <span className="text-[11px] text-[#C8973A] cursor-pointer">Full report →</span>
              </div>
              <div className="p-4">
                <div className="text-[11px] text-[#7A7870] mb-1">Total from enrollments</div>
                <div className="text-[26px] font-medium text-[#1C1B18]">{loading ? '—' : formatINR(totalEarnings)}</div>
                <div className="text-[11px] text-[#2E6E52] mt-[2px] mb-[14px]">{published.length} published course{published.length !== 1 ? 's' : ''}</div>
                <div className="text-[11px] text-[#7A7870] mb-2">Top courses by revenue</div>
                <div className="flex items-end gap-[6px] h-[70px]">
                  {loading ? (
                    <span className="text-[11px] text-[#7A7870]">Loading...</span>
                  ) : earningsData.length === 0 ? (
                    <span className="text-[11px] text-[#7A7870]">No earnings yet</span>
                  ) : (
                    earningsData.map((c, i) => {
                     // const h = Math.max(Math.round((c.rev / maxRev) * 64), 4);
                      const isTop = i === 0;
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-[3px]" title={`${c.title}: ${formatINR(c.rev)}`}>
                          <div className="w-full rounded-t-[4px]" style={{ background: isTop ? '#C8973A' : '#E8C97A', minHeight: 4 }} />
                          <span className="text-[9px]" style={{ color: isTop ? '#C8973A' : '#7A7870', fontWeight: isTop ? 500 : 400 }}>{BAR_MONTHS[i]}</span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// ── Sidebar Icons ─────────────────────────────────────────
const GridIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="5" height="5" rx="1.5" fill="currentColor"/><rect x="8" y="1" width="5" height="5" rx="1.5" fill="currentColor" opacity=".5"/><rect x="1" y="8" width="5" height="5" rx="1.5" fill="currentColor" opacity=".5"/><rect x="8" y="8" width="5" height="5" rx="1.5" fill="currentColor" opacity=".5"/></svg>;
const VideoIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.2"/><path d="M5.5 6.5L8.5 5 5.5 3.5V6.5z" fill="currentColor"/><path d="M2 12h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;
const PlusCircleIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/><path d="M7 4.5v5M4.5 7h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
const UserIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.2"/><path d="M2 12c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="currentColor" strokeWidth="1.2"/></svg>;
const ClipboardIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="2" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.2"/><path d="M5 7h4M5 9.5h2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;
const ChatIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 3.5c0-.83.67-1.5 1.5-1.5h7c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5H8.5L6 12V10H3.5C2.67 10 2 9.33 2 8.5v-5z" stroke="currentColor" strokeWidth="1.2"/></svg>;
const ChartIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 11L5.5 6.5 8 9l2-3.5L12.5 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const StarIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1.5l1.5 3.1 3.4.5-2.45 2.4.58 3.4L7 9.35 3.97 10.9l.58-3.4L2.1 5.1l3.4-.5L7 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>;
const EarningsIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="3" width="11" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M4 6h6M4 8.5h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;
const LogoutIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9.5 7H2M9.5 7L7 4.5M9.5 7L7 9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 2h3.5A1.5 1.5 0 0112 3.5v7A1.5 1.5 0 0110.5 12H7" stroke="currentColor" strokeWidth="1.2"/></svg>;
//const BellIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1.5A4.5 4.5 0 0 0 3.5 6v3l-1 1.5h11L12.5 9V6A4.5 4.5 0 0 0 8 1.5z" stroke="#1C1B18" strokeWidth="1.2"/><path d="M6.5 13a1.5 1.5 0 0 0 3 0" stroke="#1C1B18" strokeWidth="1.2"/></svg>;

export default Dashboard;



// import React, { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { FaPlus, FaEdit, FaBook, FaUsers, FaChartBar } from 'react-icons/fa';
// import toast from 'react-hot-toast';

// const Dashboard = () => {
//     const navigate = useNavigate();
//     const { user } = useSelector((state) => state.auth);
//     const [courses, setCourses] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchEducatorData = async () => {
//             try {
//                 const res = await axios.get("http://localhost:8000/api/course/get-creator", { withCredentials: true });
//                 if (res.data) { setCourses(res.data); }
//             } catch (error) {
//                 toast.error("Database connection error!");
//             } finally { setLoading(false); }
//         };
//         fetchEducatorData();
//     }, []);

//     // Stats Logic
//     const totalStudents = courses.reduce((acc, c) => acc + (c.enrolledStudents?.length || 0), 0);
//     const totalEarnings = courses.reduce((acc, c) => acc + (c.coursePrice * (c.enrolledStudents?.length || 0)), 0);

//     return (
//         <div className="min-h-screen bg-[#FDFBF7] pt-[110px] pb-10 px-5 md:px-12 font-jakarta">
//             <div className="max-w-7xl mx-auto">
//                 <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-5">
//                     <div>
//                         <h1 className="text-4xl font-bold text-[#1A1A1A]">Instructor <span className="text-[#D4A373]">Console</span></h1>
//                         <p className="text-gray-500 mt-1">Quick overview of your academy performance.</p>
//                     </div>
//                     <button 
//                         onClick={() => navigate('/educator/create-course')}
//                         className="bg-[#1A1A1A] text-white px-6 py-3 rounded-2xl font-bold hover:bg-black shadow-lg flex items-center gap-2"
//                     >
//                         <FaPlus className="text-[#D4A373]" /> Create New Course
//                     </button>
//                 </div>

//                 {/* Stats Grid */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
//                     <StatCard icon={<FaBook />} label="Total Courses" value={courses.length} color="text-blue-500" bg="bg-blue-50" />
//                     <StatCard icon={<FaUsers />} label="Total Students" value={totalStudents} color="text-green-500" bg="bg-green-50" />
//                     <StatCard icon={<FaChartBar />} label="Total Earnings" value={`₹${totalEarnings}`} color="text-orange-500" bg="bg-orange-50" />
//                 </div>

//                 {/* Simplified List */}
//                 <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
//                     <div className="p-8 border-b border-gray-50 flex justify-between items-center">
//                         <h2 className="text-2xl font-bold text-[#1A1A1A]">Recent Activity</h2>
//                         <button onClick={() => navigate('/educator/courses')} className="text-[#D4A373] font-bold hover:underline">View All Courses</button>
//                     </div>
//                     <div className="overflow-x-auto">
//                         <table className="w-full text-left">
//                             <tbody className="divide-y divide-gray-50">
//                                 {courses.slice(0, 5).map((course) => (
//                                     <tr key={course._id} className="hover:bg-gray-50/50 transition-colors">
//                                         <td className="px-8 py-6">
//                                             <div className="flex items-center gap-4">
//                                                 <img src={course.courseThumbnail} className="w-12 h-12 rounded-lg object-cover" alt="" />
//                                                 <span className="font-bold text-[#1A1A1A]">{course.title}</span>
//                                             </div>
//                                         </td>
//                                         <td className="px-8 py-6">
//                                             <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${course.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
//                                                 {course.isPublished ? 'Live' : 'Draft'}
//                                             </span>
//                                         </td>
//                                         <td className="px-8 py-6 text-right">
//                                             <button onClick={() => navigate(`/educator/edit-course/${course._id}`)} className="p-3 bg-gray-100 rounded-xl hover:bg-[#1A1A1A] hover:text-white transition-all">
//                                                 <FaEdit size={14} />
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// const StatCard = ({ icon, label, value, color, bg }) => (
//     <div className="bg-white p-6 rounded-[30px] shadow-sm border border-gray-100 flex items-center gap-5">
//         <div className={`${bg} ${color} p-4 rounded-2xl text-xl`}>{icon}</div>
//         <div>
//             <p className="text-gray-400 text-xs font-bold uppercase">{label}</p>
//             <h3 className="text-2xl font-bold">{value}</h3>
//         </div>
//     </div>
// );

// export default Dashboard;