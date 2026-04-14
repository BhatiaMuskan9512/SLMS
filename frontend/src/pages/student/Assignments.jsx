import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Sidebar from '../../components/Sdashboard_components/Sidebar';

const SAssignments = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // ── State ─────────────────────────────────────────────
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [view, setView] = useState('list'); // list | submit
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [loading, setLoading] = useState(false);
  //const [submittedIds, setSubmittedIds] = useState([]); // already submitted assignments
  const [submissionsMap, setSubmissionsMap] = useState({}); 
  const [sidebarView, setSidebarView] = useState('assignments');

  const [form, setForm] = useState({ textAnswer: '', fileUrl: '' });

  // ── Auth check ────────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated]);

  // ── Fetch enrolled courses ────────────────────────────
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('/api/course/my-courses', { withCredentials: true });
        setEnrolledCourses(res.data);
      } catch {
        toast.error('Courses load nahi hue!');
      }
    };
    fetchCourses();
  }, []);

  // ── Fetch assignments jab course select ho ────────────
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

  useEffect(() => {
    const fetchMySubmissions = async () => {
    try {
        const res = await axios.get('/api/assignment/my-submissions', { withCredentials: true });
        if (res.data.success) {
            const map = {};
            res.data.submissions.forEach(s => {
                map[s.assignmentId.toString()] = {
                    grade: s.grade,
                    feedback: s.feedback
                };
            });
            setSubmissionsMap(map);
        }
    } catch {
        console.log('Submissions check failed');
    }
};
    fetchMySubmissions();
}, []);

  // ── Submit Assignment ─────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAssignment?._id) {  // ← ?. add karo
        return toast.error('Assignment select nahi hua!');
    }

    if (!form.textAnswer && !form.fileUrl) {
      return toast.error('Answer ya file URL dalo!');
    }
    try {
      const res = await axios.post('/api/assignment/submit', {
        assignmentId: selectedAssignment._id,
        textAnswer: form.textAnswer,
        fileUrl: form.fileUrl,
      }, { withCredentials: true });

      if (res.data.success) {
        toast.success('Assignment submit ho gaya! 🎉');
        setSubmissionsMap(prev => ({ 
        ...prev, 
        [selectedAssignment._id]: { grade: null, feedback: '' } 
    }));
    
    setForm({ textAnswer: '', fileUrl: '' });
    setView('list');
        // setSubmittedIds(prev => [...prev, selectedAssignment._id]);
        // setForm({ textAnswer: '', fileUrl: '' });
        // setView('list');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submit nahi hua!');
    }
  };

  // ── Deadline check ────────────────────────────────────
  const isExpired = (deadline) => deadline && new Date(deadline) < new Date();

  // ── RENDER ────────────────────────────────────────────
  return (
    <div className="flex w-full h-screen bg-[#F6F4EC] overflow-hidden">

      {/* Sidebar — same as student dashboard */}
      <div className="w-[280px] hidden lg:block flex-shrink-0">
        <Sidebar setView={setSidebarView} activeView={sidebarView} />
      </div>

      {/* Main Content */}
      <div className="flex-1 h-full overflow-y-auto overflow-x-hidden p-6 md:p-8">
        <div className="max-w-[900px] mx-auto">

          {/* Header */}
          <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">My Assignments 📋</h1>
              <p className="text-gray-500 text-sm mt-1">
                {user?.name || 'Student'} ke saare assignments yahan hain
              </p>
            </div>
            {view === 'submit' && (
              <button onClick={() => setView('list')}
                className="text-sm text-[#d4a843] font-medium">
                ← Wapas
              </button>
            )}
          </div>

          {/* Course Selector */}
          {view === 'list' && (
            <div className="mb-5">
              <label className="text-[12px] text-gray-500 mb-1 block">Course select karo</label>
              <select
                value={selectedCourse}
                onChange={e => { setSelectedCourse(e.target.value); setAssignments([]); }}
                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white min-w-[280px] shadow-sm">
                <option value="">-- Course chunein --</option>
                {enrolledCourses.map(c => (
                  <option key={c._id} value={c._id}>{c.title}</option>
                ))}
              </select>
            </div>
          )}

          {/* ── VIEW: LIST ── */}
          {view === 'list' && (
            <>
              {!selectedCourse ? (
                <div className="text-center py-24 text-gray-400 text-sm">
                  Upar se course select karo assignments dekhne ke liye 👆
                </div>
              ) : loading ? (
                <div className="flex justify-center py-20">
                  <div className="w-8 h-8 border-4 border-t-[#d4a843] border-gray-200 rounded-full animate-spin"></div>
                </div>
              ) : assignments.length === 0 ? (
                <div className="text-center py-24 text-gray-400 text-sm">
                  Is course mein abhi koi assignment nahi hai 🎉
                </div>
              ) : (
                <div className="grid gap-3">
                  {assignments.map(a => {
                    const expired = isExpired(a.deadline);
                     const submitted = !!submissionsMap[a._id];
                     const mySubmission = submissionsMap[a._id];
                    //const submitted = submittedIds.includes(a._id);

                    return (
                      <div key={a._id}
                        className="bg-white rounded-[20px] p-5 border border-gray-100 shadow-sm flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[14px] font-bold text-gray-800">{a.title}</span>
                            {submitted && (
                              <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-medium">
                                Submitted ✓
                              </span>
                            )}
                            {expired && !submitted && (
                              <span className="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-full font-medium">
                                Expired
                              </span>
                            )}
                          </div>

                          {a.description && (
                            <p className="text-[12px] text-gray-500 line-clamp-2 mb-2">{a.description}</p>
                          )}

                          {/* ✅ Yahan paste karo */}
                            {submitted && mySubmission && (
                                <div className="mt-2 text-[11px]">
                                    {mySubmission.grade !== null && mySubmission.grade !== undefined ? (
                                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                                            Grade: {mySubmission.grade}/{a.totalMarks}
                                        </span>
                                    ) : (
                                        <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                                            Grade pending ⏳
                                        </span>
                                    )}
                                    {mySubmission.feedback && (
                                        <span className="ml-2 text-gray-500">
                                            "{mySubmission.feedback}"
                                        </span>
                                    )}
                                </div>
                            )}

                          <div className="flex gap-4 text-[11px] text-gray-400">
                            <span>📅 {a.deadline ? new Date(a.deadline).toLocaleString('en-IN') : 'No deadline'}</span>
                            <span>📝 {a.totalMarks} marks</span>
                          </div>
                        </div>

                        {/* Action Button */}
                        {submitted ? (
                          <span className="text-[12px] text-green-600 font-medium whitespace-nowrap">
                            ✓ Done
                          </span>
                        ) : expired ? (
                          <span className="text-[12px] text-red-400 whitespace-nowrap">
                            Time khatam
                          </span>
                        ) : (
                          <button
                            onClick={() => { setSelectedAssignment(a); setView('submit'); }}
                            className="bg-[#d4a843] text-white px-4 py-2 rounded-xl text-[12px] font-bold shadow-md shadow-[#d4a843]/20 hover:bg-[#b88f32] transition-all whitespace-nowrap">
                            Attempt
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* ── VIEW: SUBMIT ── */}
          {view === 'submit' && selectedAssignment && (
            <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm max-w-[640px]">
              <h2 className="text-[16px] font-bold text-gray-800 mb-1">
                {selectedAssignment.title}
              </h2>
              {selectedAssignment.description && (
                <p className="text-[13px] text-gray-500 mb-4">{selectedAssignment.description}</p>
              )}
              <div className="flex gap-4 text-[11px] text-gray-400 mb-5">
                <span>📅 Deadline: {selectedAssignment.deadline ? new Date(selectedAssignment.deadline).toLocaleString('en-IN') : 'No deadline'}</span>
                <span>📝 {selectedAssignment.totalMarks} marks</span>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="text-[12px] text-gray-500 mb-1 block">
                    Apna answer likhо (text)
                  </label>
                  <textarea
                    rows={5}
                    value={form.textAnswer}
                    onChange={e => setForm({ ...form, textAnswer: e.target.value })}
                    placeholder="Yahan apna answer likhо..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[13px] resize-none focus:outline-none focus:border-[#d4a843]" />
                </div>

                <div>
                  <label className="text-[12px] text-gray-500 mb-1 block">
                    Ya file URL paste karo (Google Drive / Dropbox link)
                  </label>
                  <input
                    type="url"
                    value={form.fileUrl}
                    onChange={e => setForm({ ...form, fileUrl: e.target.value })}
                    placeholder="https://drive.google.com/..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#d4a843]" />
                </div>

                <div className="flex gap-3 mt-1">
                  <button type="submit"
                    className="bg-[#d4a843] text-white px-6 py-2.5 rounded-xl text-[13px] font-bold shadow-md shadow-[#d4a843]/20 hover:bg-[#b88f32] transition-all">
                    Submit Assignment 🚀
                  </button>
                  <button type="button" onClick={() => setView('list')}
                    className="border border-gray-200 px-5 py-2.5 rounded-xl text-[13px] text-gray-500 hover:bg-gray-50">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SAssignments;