import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';

// ── Sidebar Icons (same as Dashboard) ────────────────────
const GridIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="5" height="5" rx="1.5" fill="currentColor"/><rect x="8" y="1" width="5" height="5" rx="1.5" fill="currentColor" opacity=".5"/><rect x="1" y="8" width="5" height="5" rx="1.5" fill="currentColor" opacity=".5"/><rect x="8" y="8" width="5" height="5" rx="1.5" fill="currentColor" opacity=".5"/></svg>;
const ClipboardIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="2" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.2"/><path d="M5 7h4M5 9.5h2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;
const VideoIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.2"/><path d="M5.5 6.5L8.5 5 5.5 3.5V6.5z" fill="currentColor"/><path d="M2 12h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;
const PlusCircleIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/><path d="M7 4.5v5M4.5 7h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
const UserIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.2"/><path d="M2 12c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="currentColor" strokeWidth="1.2"/></svg>;
const LogoutIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9.5 7H2M9.5 7L7 4.5M9.5 7L7 9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 2h3.5A1.5 1.5 0 0112 3.5v7A1.5 1.5 0 0110.5 12H7" stroke="currentColor" strokeWidth="1.2"/></svg>;

// ── Sidebar Item ──────────────────────────────────────────
const SbItem = ({ icon, label, active, onClick }) => (
  <div onClick={onClick}
    className={`flex items-center gap-[9px] px-[18px] py-[9px] text-[13px] cursor-pointer border-l-[2.5px] transition-all
      ${active
        ? 'bg-[rgba(200,151,58,0.14)] text-[#E8C97A] border-[#C8973A]'
        : 'text-white/55 border-transparent hover:bg-white/5 hover:text-white/85'}`}>
    {icon}
    {label}
  </div>
);

const EAssignments = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // ── State ─────────────────────────────────────────────
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [view, setView] = useState('list'); // list | create | submissions | grade
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: '', description: '', deadline: '', totalMarks: 100
  });

  const [gradeForm, setGradeForm] = useState({ grade: '', feedback: '' });

  // ── Fetch Courses ─────────────────────────────────────
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('/api/course/get-creator', { withCredentials: true });
        if (res.data) setCourses(res.data);
      } catch {
        toast.error('Courses load nahi hue!');
      }
    };
    fetchCourses();
  }, []);

  // ── Fetch Assignments jab course select ho ────────────
  useEffect(() => {
    if (!selectedCourse) return;
    const fetchAssignments = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/assignment/course/${selectedCourse}`, { withCredentials: true });
        if (res.data.success) setAssignments(res.data.assignments);
      } catch {
        toast.error('Assignments load nahi hue!');
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, [selectedCourse]);

  // ── Create Assignment ─────────────────────────────────
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!selectedCourse) return toast.error('Pehle course select karo!');
    try {
      const res = await axios.post('/api/assignment/create', {
        ...form, courseId: selectedCourse
      }, { withCredentials: true });
      if (res.data.success) {
        toast.success('Assignment create ho gaya!');
        setAssignments(prev => [res.data.assignment, ...prev]);
        setForm({ title: '', description: '', deadline: '', totalMarks: 100 });
        setView('list');
      }
    } catch {
      toast.error('Assignment create nahi hua!');
    }
  };

  // ── Fetch Submissions ─────────────────────────────────
  const fetchSubmissions = async (assignment) => {
    setSelectedAssignment(assignment);
    setLoading(true);
    try {
      const res = await axios.get(`/api/assignment/submissions/${assignment._id}`, { withCredentials: true });
      if (res.data.success) setSubmissions(res.data.submissions);
      setView('submissions');
    } catch {
      toast.error('Submissions load nahi hue!');
    } finally {
      setLoading(false);
    }
  };

  // ── Grade Submission ──────────────────────────────────
  const handleGrade = async (submissionId) => {
    try {
      const res = await axios.patch(`/api/assignment/grade/${submissionId}`, gradeForm, { withCredentials: true });
      if (res.data.success) {
        toast.success('Grade save ho gaya!');
        setSubmissions(prev =>
          prev.map(s => s._id === submissionId ? { ...s, ...res.data.submission } : s)
        );
        setGradeForm({ grade: '', feedback: '' });
      }
    } catch {
      toast.error('Grade save nahi hua!');
    }
  };

  const name = user?.name || 'Instructor';
  const getInitials = (n = '') => n.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  // ── RENDER ────────────────────────────────────────────
  return (
    <div className="flex h-screen bg-[#FAF8F2] overflow-hidden" style={{ fontFamily: 'system-ui, sans-serif' }}>

      {/* ── SIDEBAR ── */}
      <div className="w-[220px] flex-shrink-0 flex flex-col" style={{ background: '#2E2D2A' }}>
        <div className="px-[18px] pt-[22px] pb-[18px]" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.08)' }}>
          <span className="text-[24px] font-medium text-white ml-6">
            Skill<span className="text-[#E8C97A]">Link</span>
          </span>
        </div>
        <nav className="flex-1 py-[14px]">
          <div className="px-[18px] py-[10px] pb-[4px] text-[11px] font-medium text-white/30 uppercase tracking-widest">Workspace</div>
          <SbItem icon={<GridIcon />}      label="Dashboard"      onClick={() => navigate('/educator/dashboard')} />
          <SbItem icon={<VideoIcon />}     label="Manage Courses" onClick={() => navigate('/educator/courses')} />
          <SbItem icon={<PlusCircleIcon />} label="Create Course" onClick={() => navigate('/educator/create-course')} />
          <SbItem icon={<UserIcon />}      label="Students"       onClick={() => navigate('/educator/students')} />
          <SbItem icon={<ClipboardIcon />} label="Assignments"    active />
        </nav>
        <div style={{ borderTop: '0.5px solid rgba(255,255,255,0.08)' }} className="py-2">
          <SbItem icon={<UserIcon />}   label="Profile" onClick={() => navigate('/my-profile')} />
          <SbItem icon={<LogoutIcon />} label="Logout"  onClick={() => navigate('/login')} />
        </div>
      </div>

      {/* ── MAIN ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Topbar */}
        <div className="bg-white flex items-center justify-between px-7 h-[58px] flex-shrink-0"
          style={{ borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
          <div className="text-[20px] font-medium text-[#1C1B18]">Assignments</div>
          <div className="flex items-center gap-3">
            {view !== 'create' && (
              <button
                onClick={() => setView('create')}
                className="flex items-center gap-2 bg-[#2E2D2A] text-white px-4 py-2 rounded-lg text-[12px] font-medium">
                + New Assignment
              </button>
            )}
            <div className="w-[34px] h-[34px] rounded-full bg-[#C8973A] flex items-center justify-center text-white text-[12px] font-medium">
              {getInitials(name)}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-7">

          {/* Course Selector — har view mein dikhega */}
          <div className="mb-6">
            <label className="text-[12px] text-[#7A7870] mb-1 block">Course select karo</label>
            <select
              value={selectedCourse}
              onChange={e => { setSelectedCourse(e.target.value); setView('list'); setAssignments([]); }}
              className="border border-black/10 rounded-lg px-3 py-2 text-[13px] bg-white min-w-[280px]">
              <option value="">-- Course chunein --</option>
              {courses.map(c => (
                <option key={c._id} value={c._id}>{c.title}</option>
              ))}
            </select>
          </div>

          {/* ── VIEW: CREATE ── */}
          {view === 'create' && (
            <div className="bg-white border border-black/[0.08] rounded-xl p-6 max-w-[600px]">
              <h2 className="text-[16px] font-medium text-[#1C1B18] mb-5">Naya Assignment banao</h2>
              <form onSubmit={handleCreate} className="flex flex-col gap-4">

                <div>
                  <label className="text-[12px] text-[#7A7870] mb-1 block">Title *</label>
                  <input
                    required
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    placeholder="Assignment ka title"
                    className="w-full border border-black/10 rounded-lg px-3 py-2 text-[13px]" />
                </div>

                <div>
                  <label className="text-[12px] text-[#7A7870] mb-1 block">Description</label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="Assignment ki details..."
                    className="w-full border border-black/10 rounded-lg px-3 py-2 text-[13px] resize-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[12px] text-[#7A7870] mb-1 block">Deadline</label>
                    <input
                      type="datetime-local"
                      value={form.deadline}
                      onChange={e => setForm({ ...form, deadline: e.target.value })}
                      className="w-full border border-black/10 rounded-lg px-3 py-2 text-[13px]" />
                  </div>
                  <div>
                    <label className="text-[12px] text-[#7A7870] mb-1 block">Total Marks</label>
                    <input
                      type="number"
                      value={form.totalMarks}
                      onChange={e => setForm({ ...form, totalMarks: e.target.value })}
                      className="w-full border border-black/10 rounded-lg px-3 py-2 text-[13px]" />
                  </div>
                </div>

                <div className="flex gap-3 mt-2">
                  <button type="submit"
                    className="bg-[#2E2D2A] text-white px-5 py-2 rounded-lg text-[13px] font-medium">
                    Create Assignment
                  </button>
                  <button type="button" onClick={() => setView('list')}
                    className="border border-black/10 px-5 py-2 rounded-lg text-[13px] text-[#7A7870]">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── VIEW: LIST ── */}
          {view === 'list' && (
            <>
              {!selectedCourse ? (
                <div className="text-center py-20 text-[#7A7870] text-[13px]">
                  Upar se course select karo assignments dekhne ke liye
                </div>
              ) : loading ? (
                <div className="text-center py-20">
                  <div className="w-8 h-8 border-4 border-t-[#C8973A] border-gray-200 rounded-full animate-spin mx-auto"></div>
                </div>
              ) : assignments.length === 0 ? (
                <div className="text-center py-20 text-[#7A7870] text-[13px]">
                  Is course mein koi assignment nahi hai. <br />
                  <span className="text-[#C8973A] cursor-pointer" onClick={() => setView('create')}>
                    + Pehla assignment banao
                  </span>
                </div>
              ) : (
                <div className="grid gap-3">
                  {assignments.map(a => (
                    <div key={a._id}
                      className="bg-white border border-black/[0.08] rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <div className="text-[14px] font-medium text-[#1C1B18]">{a.title}</div>
                        <div className="text-[11px] text-[#7A7870] mt-1">
                          {a.deadline ? `Deadline: ${new Date(a.deadline).toLocaleString('en-IN')}` : 'No deadline'} &nbsp;·&nbsp; {a.totalMarks} marks
                        </div>
                        {a.description && (
                          <div className="text-[11px] text-[#7A7870] mt-1 line-clamp-1">{a.description}</div>
                        )}
                      </div>
                      <button
                        onClick={() => fetchSubmissions(a)}
                        className="bg-[#F3EFE4] text-[#854F0B] px-4 py-2 rounded-lg text-[12px] font-medium hover:bg-[#EDE8DA] transition-colors">
                        Submissions dekho
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ── VIEW: SUBMISSIONS ── */}
          {view === 'submissions' && selectedAssignment && (
            <div>
              <button onClick={() => setView('list')}
                className="text-[12px] text-[#C8973A] mb-4 flex items-center gap-1">
                ← Wapas assignments
              </button>
              <h2 className="text-[16px] font-medium text-[#1C1B18] mb-1">
                {selectedAssignment.title}
              </h2>
              <p className="text-[12px] text-[#7A7870] mb-5">
                {submissions.length} submission{submissions.length !== 1 ? 's' : ''}
              </p>

              {loading ? (
                <div className="text-center py-10">
                  <div className="w-8 h-8 border-4 border-t-[#C8973A] border-gray-200 rounded-full animate-spin mx-auto"></div>
                </div>
              ) : submissions.length === 0 ? (
                <div className="text-center py-16 text-[#7A7870] text-[13px]">
                  Abhi tak kisi ne submit nahi kiya
                </div>
              ) : (
                <div className="grid gap-3">
                  {submissions.map(s => (
                    <div key={s._id} className="bg-white border border-black/[0.08] rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="text-[13px] font-medium text-[#1C1B18]">
                            {s.studentId?.name || 'Student'}
                          </div>
                          <div className="text-[11px] text-[#7A7870]">
                            {s.studentId?.email} &nbsp;·&nbsp;
                            {new Date(s.submittedAt).toLocaleString('en-IN')}
                          </div>
                        </div>
                        {s.grade !== null && s.grade !== undefined ? (
                          <span className="bg-[#E4F2EB] text-[#2E6E52] text-[12px] px-3 py-1 rounded-full font-medium">
                            {s.grade}/{selectedAssignment.totalMarks}
                          </span>
                        ) : (
                          <span className="bg-[#FBF3E6] text-[#854F0B] text-[12px] px-3 py-1 rounded-full">
                            Graded nahi
                          </span>
                        )}
                      </div>

                      {/* Answer */}
                      {s.textAnswer && (
                        <div className="bg-[#F3EFE4] rounded-lg p-3 text-[12px] text-[#1C1B18] mb-3">
                          {s.textAnswer}
                        </div>
                      )}
                      {s.fileUrl && (
                        <a href={s.fileUrl} target="_blank" rel="noreferrer"
                          className="text-[12px] text-[#378ADD] underline mb-3 block">
                          File dekho / download karo
                        </a>
                      )}

                      {/* Grade Form */}
                      <div className="flex gap-2 mt-2 items-center">
                        <input
                          type="number"
                          placeholder={`Grade (0-${selectedAssignment.totalMarks})`}
                          defaultValue={s.grade || ''}
                          onChange={e => setGradeForm(prev => ({ ...prev, grade: e.target.value }))}
                          className="border border-black/10 rounded-lg px-3 py-1.5 text-[12px] w-[130px]" />
                        <input
                          placeholder="Feedback (optional)"
                          defaultValue={s.feedback || ''}
                          onChange={e => setGradeForm(prev => ({ ...prev, feedback: e.target.value }))}
                          className="border border-black/10 rounded-lg px-3 py-1.5 text-[12px] flex-1" />
                        <button
                          onClick={() => handleGrade(s._id)}
                          className="bg-[#2E2D2A] text-white px-4 py-1.5 rounded-lg text-[12px] font-medium whitespace-nowrap">
                          Grade save karo
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default EAssignments;