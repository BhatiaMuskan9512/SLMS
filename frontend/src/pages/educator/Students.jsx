import { useEffect, useState, useMemo } from "react";
import { fetchAllStudents, fetchStudentsByCourse } from "../../api/studentApi";
import toast from "react-hot-toast";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate} from "react-router-dom";

// ── colour helpers ──────────────────────────────────────────────────────────
const AVATAR_COLORS = [
    "#C8973A","#2E6E52","#1B5FA6","#854F0B","#A32D2D","#534AB7"
];
const avatarColor = (name) => AVATAR_COLORS[name?.charCodeAt(0) % AVATAR_COLORS.length];
const initials    = (name) => name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "?";
const progColor   = (p)    => p >= 80 ? "#2E6E52" : p >= 40 ? "#C8973A" : "#A32D2D";

const fmtDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

// ── sub-components ──────────────────────────────────────────────────────────
const Avatar = ({ name, size = 32 }) => (
    <div style={{
        width: size, height: size, borderRadius: "50%",
        background: avatarColor(name) + "22",
        color: avatarColor(name),
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.35, fontWeight: 500, flexShrink: 0
    }}>
        {initials(name)}
    </div>
);

const ProgressBar = ({ value }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ flex: 1, height: 5, background: "#EDE8DA", borderRadius: 99, minWidth: 50 }}>
            <div style={{
                width: `${value}%`, height: 5,
                background: progColor(value), borderRadius: 99,
                transition: "width .4s"
            }} />
        </div>
        <span style={{ fontSize: 11, color: "#7A7870", minWidth: 28 }}>{value}%</span>
    </div>
);

const StatusBadge = ({ completed }) => (
    <span style={{
        fontSize: 10, padding: "2px 8px", borderRadius: 99, fontWeight: 500,
        background: completed ? "#E4F2EB" : "#F3EFE4",
        color: completed ? "#2E6E52" : "#854F0B"
    }}>
        {completed ? "Completed" : "In Progress"}
    </span>
);

const StatCard = ({ label, value, accent, note }) => (
    <div style={{
        background: "#fff", border: "0.5px solid rgba(0,0,0,0.08)",
        borderRadius: 12, padding: "14px 16px", position: "relative", overflow: "hidden"
    }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: accent }} />
        <div style={{ fontSize: 11, color: "#7A7870", marginBottom: 8, marginTop: 5 }}>{label}</div>
        <div style={{ fontSize: 22, fontWeight: 500, color: "#1C1B18" }}>{value}</div>
        {note && <div style={{ fontSize: 10, color: accent, marginTop: 3 }}>{note}</div>}
    </div>
);

// ── OVERVIEW TAB ────────────────────────────────────────────────────────────
const OverviewTab = ({ students, stats }) => {
    const [search, setSearch]     = useState("");
    const [filter, setFilter]     = useState("all");
    const [sort, setSort]         = useState("name");
    const [expandedId, setExpand] = useState(null);

    const filtered = useMemo(() => {
        let list = [...students];
        const q = search.toLowerCase();
        if (q) list = list.filter(s =>
            s.name.toLowerCase().includes(q) ||
            s.email.toLowerCase().includes(q) ||
            s.courseName.toLowerCase().includes(q)
        );
        if (filter === "completed") list = list.filter(s => s.isCompleted);
        if (filter === "inprogress") list = list.filter(s => !s.isCompleted);

        if (sort === "progress") list.sort((a, b) => b.progress - a.progress);
        else if (sort === "joined") list.sort((a, b) => new Date(b.joinedAt) - new Date(a.joinedAt));
        else list.sort((a, b) => a.name.localeCompare(b.name));

        return list;
    }, [students, search, filter, sort]);

    const filters = [
        { id: "all", label: "All" },
        { id: "completed", label: "Completed" },
        { id: "inprogress", label: "In Progress" }
    ];

    return (
        <div>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
                <StatCard label="Total students" value={stats.totalStudents} accent="#2E6E52" note="unique learners" />
                <StatCard label="Total enrollments" value={stats.totalEnrollments} accent="#1B5FA6" note="across all courses" />
                <StatCard label="Avg completion" value={`${stats.avgProgress}%`} accent="#C8973A" note="all enrollments" />
                <StatCard label="Fully completed" value={stats.completedEnrollments} accent="#D85A30" note="100% progress" />
            </div>

            {/* Toolbar */}
            <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
                    <svg style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}
                        width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <circle cx="6" cy="6" r="4" stroke="#7A7870" strokeWidth="1.2" />
                        <path d="M9.5 9.5L12 12" stroke="#7A7870" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search name, email or course..."
                        style={{
                            width: "100%", padding: "8px 12px 8px 32px",
                            border: "0.5px solid rgba(0,0,0,0.12)", borderRadius: 8,
                            fontSize: 13, background: "#fff", color: "#1C1B18", outline: "none"
                        }}
                    />
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                    {filters.map(f => (
                        <button key={f.id} onClick={() => setFilter(f.id)} style={{
                            padding: "7px 14px", borderRadius: 8, fontSize: 12, cursor: "pointer",
                            fontWeight: 500, border: "0.5px solid",
                            background: filter === f.id ? "#2E2D2A" : "#fff",
                            color: filter === f.id ? "#fff" : "#1C1B18",
                            borderColor: filter === f.id ? "#2E2D2A" : "rgba(0,0,0,0.1)"
                        }}>
                            {f.label}
                        </button>
                    ))}
                </div>
                <select
                    value={sort}
                    onChange={e => setSort(e.target.value)}
                    style={{
                        padding: "7px 12px", border: "0.5px solid rgba(0,0,0,0.12)",
                        borderRadius: 8, fontSize: 12, background: "#fff",
                        color: "#1C1B18", outline: "none", cursor: "pointer"
                    }}
                >
                    <option value="name">Sort: Name</option>
                    <option value="progress">Sort: Progress</option>
                    <option value="joined">Sort: Joined</option>
                </select>
            </div>

            {/* Table */}
            <div style={{
                background: "#fff", border: "0.5px solid rgba(0,0,0,0.08)",
                borderRadius: 12, overflow: "hidden"
            }}>
                {/* Table header */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1.8fr 1.4fr 1.2fr 100px",
                    padding: "10px 18px", gap: 12,
                    borderBottom: "0.5px solid rgba(0,0,0,0.08)"
                }}>
                    {["Student", "Course", "Progress", "Joined", "Status"].map(h => (
                        <span key={h} style={{
                            fontSize: 11, fontWeight: 500, color: "#7A7870",
                            textTransform: "uppercase", letterSpacing: "0.04em"
                        }}>{h}</span>
                    ))}
                </div>

                {filtered.length === 0 ? (
                    <div style={{ padding: "48px", textAlign: "center", color: "#7A7870", fontSize: 13 }}>
                        No students match your search
                    </div>
                ) : (
                    filtered.map((s, i) => {
                        const rowKey = `${s.studentId}-${s.courseId}`;
                        const isExpanded = expandedId === rowKey;
                        return (
                            <div key={rowKey}>
                                {/* Main row */}
                                <div
                                    onClick={() => setExpand(isExpanded ? null : rowKey)}
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "2fr 1.8fr 1.4fr 1.2fr 100px",
                                        padding: "13px 18px", gap: 12, alignItems: "center",
                                        borderBottom: i === filtered.length - 1 && !isExpanded
                                            ? "none" : "0.5px solid rgba(0,0,0,0.06)",
                                        cursor: "pointer",
                                        background: isExpanded ? "#FAF8F2" : "#fff",
                                        transition: "background .1s"
                                    }}
                                    onMouseEnter={e => { if (!isExpanded) e.currentTarget.style.background = "#FAF8F2" }}
                                    onMouseLeave={e => { if (!isExpanded) e.currentTarget.style.background = "#fff" }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <Avatar name={s.name} />
                                        <div>
                                            <div style={{ fontSize: 13, fontWeight: 500, color: "#1C1B18" }}>{s.name}</div>
                                            <div style={{ fontSize: 11, color: "#7A7870" }}>{s.email}</div>
                                        </div>
                                    </div>
                                    <div>
                                        <span style={{
                                            fontSize: 11, padding: "3px 9px", borderRadius: 99,
                                            background: "#E6F0FB", color: "#1B5FA6", fontWeight: 500
                                        }}>
                                            {s.courseName}
                                        </span>
                                    </div>
                                    <ProgressBar value={s.progress} />
                                    <div style={{ fontSize: 12, color: "#7A7870" }}>{fmtDate(s.joinedAt)}</div>
                                    <StatusBadge completed={s.isCompleted} />
                                </div>

                                {/* Expanded detail */}
                                {isExpanded && (
                                    <div style={{
                                        padding: "14px 18px 16px 60px",
                                        background: "#FAF8F2",
                                        borderBottom: "0.5px solid rgba(0,0,0,0.06)"
                                    }}>
                                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                                            {[
                                                { label: "Lectures completed", value: `${s.completedLectures} / ${s.totalLectures}` },
                                                { label: "Course category", value: s.courseCategory || "—" },
                                                { label: "Enrolled on", value: fmtDate(s.joinedAt) }
                                            ].map(item => (
                                                <div key={item.label} style={{
                                                    background: "#fff", border: "0.5px solid rgba(0,0,0,0.08)",
                                                    borderRadius: 8, padding: "12px 14px"
                                                }}>
                                                    <div style={{ fontSize: 10, color: "#7A7870", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                                                        {item.label}
                                                    </div>
                                                    <div style={{ fontSize: 15, fontWeight: 500, color: "#1C1B18" }}>
                                                        {item.value}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}

                {/* Footer */}
                <div style={{
                    padding: "12px 18px", borderTop: "0.5px solid rgba(0,0,0,0.06)",
                    fontSize: 12, color: "#7A7870"
                }}>
                    Showing {filtered.length} of {students.length} enrollments
                </div>
            </div>
        </div>
    );
};

// ── BY COURSE TAB ────────────────────────────────────────────────────────────
const ByCourseTab = ({ courses }) => {
    const [openCourseId, setOpenCourse] = useState(courses[0]?.courseId || null);

    if (courses.length === 0) {
        return (
            <div style={{
                background: "#fff", borderRadius: 12, padding: "64px",
                textAlign: "center", border: "0.5px solid rgba(0,0,0,0.08)"
            }}>
                <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.4 }}>📚</div>
                <p style={{ fontSize: 14, color: "#7A7870" }}>No courses found</p>
            </div>
        );
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {courses.map(course => {
                const isOpen = openCourseId === course.courseId;
                return (
                    <div key={course.courseId} style={{
                        background: "#fff", border: "0.5px solid rgba(0,0,0,0.08)",
                        borderRadius: 12, overflow: "hidden"
                    }}>
                        {/* Course header — click to expand */}
                        <div
                            onClick={() => setOpenCourse(isOpen ? null : course.courseId)}
                            style={{
                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                padding: "16px 20px", cursor: "pointer",
                                background: isOpen ? "#FAF8F2" : "#fff",
                                transition: "background .12s"
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                                <div style={{
                                    width: 42, height: 42, background: "#2E2D2A",
                                    borderRadius: 8, display: "flex", alignItems: "center",
                                    justifyContent: "center", flexShrink: 0
                                }}>
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                        <rect x="1" y="1" width="16" height="12" rx="2" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" />
                                        <path d="M7 5l5 3-5 3V5z" fill="rgba(255,255,255,0.7)" />
                                    </svg>
                                </div>
                                <div>
                                    <div style={{ fontSize: 14, fontWeight: 500, color: "#1C1B18" }}>
                                        {course.courseName}
                                    </div>
                                    <div style={{ fontSize: 11, color: "#7A7870", marginTop: 2 }}>
                                        {course.courseCategory} •
                                        <span style={{
                                            marginLeft: 6, fontSize: 10, padding: "1px 7px",
                                            borderRadius: 99, fontWeight: 500,
                                            background: course.isPublished ? "#E4F2EB" : "#FBF3E6",
                                            color: course.isPublished ? "#2E6E52" : "#854F0B"
                                        }}>
                                            {course.isPublished ? "Published" : "Draft"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                                <div style={{ textAlign: "center" }}>
                                    <div style={{ fontSize: 18, fontWeight: 500, color: "#1C1B18" }}>
                                        {course.totalStudents}
                                    </div>
                                    <div style={{ fontSize: 10, color: "#7A7870" }}>students</div>
                                </div>
                                <div style={{ textAlign: "center" }}>
                                    <div style={{ fontSize: 18, fontWeight: 500, color: progColor(course.avgProgress) }}>
                                        {course.avgProgress}%
                                    </div>
                                    <div style={{ fontSize: 10, color: "#7A7870" }}>avg progress</div>
                                </div>
                                <div style={{ fontSize: 18, color: "#7A7870", transition: "transform .2s", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
                                    ↓
                                </div>
                            </div>
                        </div>

                        {/* Students list for this course */}
                        {isOpen && (
                            <div style={{ borderTop: "0.5px solid rgba(0,0,0,0.06)" }}>
                                {course.students.length === 0 ? (
                                    <div style={{ padding: "32px", textAlign: "center", fontSize: 13, color: "#7A7870" }}>
                                        No students enrolled yet
                                    </div>
                                ) : (
                                    <>
                                        {/* Mini table header */}
                                        <div style={{
                                            display: "grid",
                                            gridTemplateColumns: "2.5fr 1.5fr 1.2fr 120px",
                                            padding: "9px 20px", gap: 12,
                                            background: "#FAF8F2",
                                            borderBottom: "0.5px solid rgba(0,0,0,0.06)"
                                        }}>
                                            {["Student", "Progress", "Joined", "Status"].map(h => (
                                                <span key={h} style={{
                                                    fontSize: 10, fontWeight: 500, color: "#7A7870",
                                                    textTransform: "uppercase", letterSpacing: "0.04em"
                                                }}>{h}</span>
                                            ))}
                                        </div>

                                        {course.students.map((s, i) => (
                                            <div key={s.studentId} style={{
                                                display: "grid",
                                                gridTemplateColumns: "2.5fr 1.5fr 1.2fr 120px",
                                                padding: "12px 20px", gap: 12, alignItems: "center",
                                                borderBottom: i < course.students.length - 1
                                                    ? "0.5px solid rgba(0,0,0,0.05)" : "none",
                                                transition: "background .1s"
                                            }}
                                                onMouseEnter={e => e.currentTarget.style.background = "#FAF8F2"}
                                                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                            >
                                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                    <Avatar name={s.name} size={28} />
                                                    <div>
                                                        <div style={{ fontSize: 13, fontWeight: 500, color: "#1C1B18" }}>{s.name}</div>
                                                        <div style={{ fontSize: 11, color: "#7A7870" }}>{s.email}</div>
                                                    </div>
                                                </div>
                                                <ProgressBar value={s.progress} />
                                                <div style={{ fontSize: 11, color: "#7A7870" }}>{fmtDate(s.joinedAt)}</div>
                                                <StatusBadge completed={s.isCompleted} />
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

// ── MAIN STUDENTS PAGE ───────────────────────────────────────────────────────
const Students = () => {
    const [tab, setTab]             = useState("overview");
    const [students, setStudents]   = useState([]);
    const [courses, setCourses]     = useState([]);
    const [stats, setStats]         = useState({
        totalStudents: 0, totalEnrollments: 0,
        completedEnrollments: 0, avgProgress: 0
    });
    const [loading, setLoading]     = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [overviewRes, byCourseRes] = await Promise.all([
                fetchAllStudents(),
                fetchStudentsByCourse()
            ]);
            if (overviewRes.data.success) {
                setStudents(overviewRes.data.students);
                setStats(overviewRes.data.stats);
            }
            if (byCourseRes.data.success) {
                setCourses(byCourseRes.data.courses);
            }
        } catch {
            toast.error("Failed to load students");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", gap: 12 }}>
                <div style={{
                    width: 32, height: 32, borderRadius: "50%",
                    border: "3px solid #EDE8DA", borderTopColor: "#C8973A",
                    animation: "spin .8s linear infinite"
                }} />
                <p style={{ fontSize: 13, color: "#7A7870" }}>Loading students...</p>
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </div>
        );
    }

    return (
        <div style={{ padding: "28px", maxWidth: "1100px", margin: "0 auto" }}>
           

            {/* Header */}
            <div style={{ marginBottom: 22 }}>
                <button onClick={() => navigate('/educator/dashboard')}
                    className=" text-size:20px mb-6 flex items-center gap-2 text-gray-500 hover:text-black transition-colors self-start max-w-[1200px] mx-auto w-full"
                            >
                        <BiArrowBack /> Back to Dashboard </button>

                <h1 className="text-4xl font-bold text-[#1A1A1A]">Stud<span className="text-[#D4A373]">ents</span></h1>
                <p style={{ fontSize: 12, color: "#7A7870" }}>
                    {stats.totalStudents} unique learner{stats.totalStudents !== 1 ? "s" : ""} across {courses.length} course{courses.length !== 1 ? "s" : ""}
                </p>
            </div>

            {/* Tabs */}
            <div style={{
                display: "flex", gap: 4,
                borderBottom: "0.5px solid rgba(0,0,0,0.08)",
                marginBottom: 22
            }}>
                {[
                    { id: "overview", label: "Overview" },
                    { id: "bycourse", label: `By Course (${courses.length})` }
                ].map(t => (
                    <button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        style={{
                            background: "none", border: "none",
                            padding: "10px 16px", fontSize: 13, fontWeight: 500,
                            cursor: "pointer",
                            color: tab === t.id ? "#C8973A" : "#7A7870",
                            borderBottom: `2px solid ${tab === t.id ? "#C8973A" : "transparent"}`,
                            transition: "all .15s"
                        }}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            {tab === "overview"
                ? <OverviewTab students={students} stats={stats} />
                : <ByCourseTab courses={courses} />
            }
        </div>
    );
};

export default Students;