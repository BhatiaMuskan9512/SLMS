import Course from "../models/courseModel.js";
import Progress from "../models/progressModel.js";

export const getAllStudents = async (req, res) => {
    try {
        const courses = await Course.find({ creator: req.userId })
            .populate({
                path: "enrolledStudents",
                select: "name email photoUrl createdAt"
            })
            .populate("lectures", "_id");

        if (!courses.length) {
            return res.status(200).json({
                success: true,
                students: [],
                stats: {
                    totalStudents: 0,
                    totalEnrollments: 0,
                    completedEnrollments: 0,
                    avgProgress: 0
                }
            });
        }

        const rows = [];

        for (const course of courses) {
            for (const student of course.enrolledStudents) {
                const progress = await Progress.findOne({
                    student: student._id,
                    course: course._id
                });

                const totalLectures = course.lectures.length;
                const completedLectures = progress?.completedLectures?.length || 0;
                const progressPct = totalLectures > 0
                    ? Math.round((completedLectures / totalLectures) * 100)
                    : 0;

                rows.push({
                    studentId: student._id,
                    name: student.name,
                    email: student.email,
                    photoUrl: student.photoUrl || "",
                    courseId: course._id,
                    courseName: course.title,
                    courseCategory: course.category,
                    progress: progressPct,
                    completedLectures,
                    totalLectures,
                    isCompleted: progress?.isCompleted || false,
                    joinedAt: progress?.createdAt || student.createdAt
                });
            }
        }

        const uniqueStudentIds = new Set(rows.map(r => r.studentId.toString()));
        const completedCount = rows.filter(r => r.isCompleted).length;
        const avgProgress = rows.length > 0
            ? Math.round(rows.reduce((s, r) => s + r.progress, 0) / rows.length)
            : 0;

        return res.status(200).json({
            success: true,
            students: rows,
            stats: {
                totalStudents: uniqueStudentIds.size,
                totalEnrollments: rows.length,
                completedEnrollments: completedCount,
                avgProgress
            }
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getStudentsByCourse = async (req, res) => {
    try {
        const courses = await Course.find({ creator: req.userId })
            .populate({
                path: "enrolledStudents",
                select: "name email photoUrl createdAt"
            })
            .populate("lectures", "_id");

        const result = [];

        for (const course of courses) {
            const studentList = [];

            for (const student of course.enrolledStudents) {
                const progress = await Progress.findOne({
                    student: student._id,
                    course: course._id
                });

                const totalLectures = course.lectures.length;
                const completedLectures = progress?.completedLectures?.length || 0;
                const progressPct = totalLectures > 0
                    ? Math.round((completedLectures / totalLectures) * 100)
                    : 0;

                studentList.push({
                    studentId: student._id,
                    name: student.name,
                    email: student.email,
                    photoUrl: student.photoUrl || "",
                    progress: progressPct,
                    completedLectures,
                    totalLectures,
                    isCompleted: progress?.isCompleted || false,
                    joinedAt: progress?.createdAt || student.createdAt
                });
            }

            result.push({
                courseId: course._id,
                courseName: course.title,
                courseCategory: course.category,
                isPublished: course.isPublished,
                totalStudents: studentList.length,
                avgProgress: studentList.length > 0
                    ? Math.round(
                        studentList.reduce((s, r) => s + r.progress, 0) / studentList.length
                      )
                    : 0,
                students: studentList
            });
        }

        return res.status(200).json({ success: true, courses: result });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const markLectureComplete = async (req, res) => {
    try {
        const { courseId, lectureId } = req.body;
        const studentId = req.userId;

        const course = await Course.findById(courseId).populate("lectures");
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        let progress = await Progress.findOne({ student: studentId, course: courseId });

        if (!progress) {
            progress = await Progress.create({
                student: studentId,
                course: courseId,
                completedLectures: [lectureId]
            });
        } else {
            const alreadyDone = progress.completedLectures
                .map(id => id.toString())
                .includes(lectureId);

            if (!alreadyDone) {
                progress.completedLectures.push(lectureId);
            }
        }

        if (progress.completedLectures.length >= course.lectures.length) {
            progress.isCompleted = true;
        }

        await progress.save();

        const progressPct = course.lectures.length > 0
            ? Math.round((progress.completedLectures.length / course.lectures.length) * 100)
            : 0;

        return res.status(200).json({
            success: true,
            progress: progressPct,
            isCompleted: progress.isCompleted
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getMyProgress = async (req, res) => {
    try {
        const { courseId } = req.params;
        const studentId = req.userId;

        const course = await Course.findById(courseId).populate("lectures");
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        const progress = await Progress.findOne({
            student: studentId,
            course: courseId
        });

        const totalLectures = course.lectures.length;
        const completedLectures = progress?.completedLectures || [];
        const progressPct = totalLectures > 0
            ? Math.round((completedLectures.length / totalLectures) * 100)
            : 0;

        return res.status(200).json({
            success: true,
            progress: progressPct,
            completedLectures,
            isCompleted: progress?.isCompleted || false,
            totalLectures
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


// import Course from "../models/courseModel.js";
// import User from "../models/userModel.js";

// // ─── GET ALL STUDENTS (Overview) ───────────────────────────────────────────
// export const getAllStudents = async (req, res) => {
//     try {
//         // 1. Get all courses by this educator
//         const courses = await Course.find({ creator: req.userId })
//             .populate("lectures", "_id");

//         if (!courses.length) {
//             return res.status(200).json({
//                 success: true,
//                 students: [],
//                 stats: {
//                     totalStudents: 0,
//                     totalEnrollments: 0,
//                     completedEnrollments: 0,
//                     avgProgress: 0
//                 }
//             });
//         }

//         // 2. Get all course IDs by this educator
//         const courseIds = courses.map(c => c._id.toString());

//         // 3. Find all students who are enrolled in ANY of these courses
//         const students = await User.find({
//             "enrolledCourses.courseId": { $in: courseIds }
//         }).select("name email photoUrl enrolledCourses createdAt");

//         const rows = [];

//         // 4. Build flat list — one row per student per course
//         for (const student of students) {
//             for (const enrollment of student.enrolledCourses) {
//                 const courseIdStr = enrollment.courseId.toString();

//                 // Only show courses belonging to THIS educator
//                 if (!courseIds.includes(courseIdStr)) continue;

//                 // Find the matching course
//                 const course = courses.find(
//                     c => c._id.toString() === courseIdStr
//                 );
//                 if (!course) continue;

//                 const progress = enrollment.courseProgress || 0;
//                 const completedLectures = enrollment.completedLectures?.length || 0;
//                 const totalLectures = course.lectures?.length || 0;

//                 rows.push({
//                     studentId: student._id,
//                     name: student.name,
//                     email: student.email,
//                     photoUrl: student.photoUrl || "",
//                     courseId: course._id,
//                     courseName: course.title,
//                     courseCategory: course.category,
//                     progress: progress,
//                     completedLectures,
//                     totalLectures,
//                     isCompleted: progress >= 100,
//                     joinedAt: student.createdAt
//                 });
//             }
//         }

//         // 5. Compute stats
//         const uniqueStudentIds = new Set(rows.map(r => r.studentId.toString()));
//         const completedCount = rows.filter(r => r.isCompleted).length;
//         const avgProgress = rows.length > 0
//             ? Math.round(
//                 rows.reduce((s, r) => s + r.progress, 0) / rows.length
//               )
//             : 0;

//         return res.status(200).json({
//             success: true,
//             students: rows,
//             stats: {
//                 totalStudents: uniqueStudentIds.size,
//                 totalEnrollments: rows.length,
//                 completedEnrollments: completedCount,
//                 avgProgress
//             }
//         });

//     } catch (error) {
//         return res.status(500).json({ success: false, message: error.message });
//     }
// };

// // ─── GET STUDENTS GROUPED BY COURSE ────────────────────────────────────────
// export const getStudentsByCourse = async (req, res) => {
//     try {
//         const courses = await Course.find({ creator: req.userId })
//             .populate("lectures", "_id");

//         const courseIds = courses.map(c => c._id.toString());

//         // Find all students enrolled in educator's courses
//         const students = await User.find({
//             "enrolledCourses.courseId": { $in: courseIds }
//         }).select("name email photoUrl enrolledCourses createdAt");

//         const result = [];

//         for (const course of courses) {
//             const studentList = [];

//             for (const student of students) {
//                 // Find this student's enrollment for this specific course
//                 const enrollment = student.enrolledCourses.find(
//                     e => e.courseId.toString() === course._id.toString()
//                 );

//                 if (!enrollment) continue;

//                 const progress = enrollment.courseProgress || 0;
//                 const completedLectures = enrollment.completedLectures?.length || 0;
//                 const totalLectures = course.lectures?.length || 0;

//                 studentList.push({
//                     studentId: student._id,
//                     name: student.name,
//                     email: student.email,
//                     photoUrl: student.photoUrl || "",
//                     progress,
//                     completedLectures,
//                     totalLectures,
//                     isCompleted: progress >= 100,
//                     joinedAt: student.createdAt
//                 });
//             }

//             result.push({
//                 courseId: course._id,
//                 courseName: course.title,
//                 courseCategory: course.category,
//                 isPublished: course.isPublished,
//                 totalStudents: studentList.length,
//                 avgProgress: studentList.length > 0
//                     ? Math.round(
//                         studentList.reduce((s, r) => s + r.progress, 0) / studentList.length
//                       )
//                     : 0,
//                 students: studentList
//             });
//         }

//         return res.status(200).json({ success: true, courses: result });

//     } catch (error) {
//         return res.status(500).json({ success: false, message: error.message });
//     }
// };

// // ─── KEEP these two as-is from before ──────────────────────────────────────
// export const markLectureComplete = async (req, res) => {
//     return res.status(200).json({
//         success: true,
//         message: "Use /api/course/update-progress instead"
//     });
// };

// export const getMyProgress = async (req, res) => {
//     try {
//         const { courseId } = req.params;
//         const student = await User.findById(req.userId);

//         const enrollment = student?.enrolledCourses?.find(
//             e => e.courseId.toString() === courseId
//         );

//         return res.status(200).json({
//             success: true,
//             progress: enrollment?.courseProgress || 0,
//             completedLectures: enrollment?.completedLectures || [],
//             isCompleted: (enrollment?.courseProgress || 0) >= 100
//         });
//     } catch (error) {
//         return res.status(500).json({ success: false, message: error.message });
//     }
// };