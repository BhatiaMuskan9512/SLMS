import Course from "../models/courseModel.js";
import Lecture from "../models/lectureModel.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../models/userModel.js";

// --- FOR COURSES ---

// 1. Create a basic course draft
export const createCourse = async (req, res) => {
    const { title, category } = req.body;

    try {
        if (!title || !category) {
            return res.status(400).json({ message: "Title and Category is Required" });
        }

        const course = await Course.create({
            title,
            category,
            creator: req.userId, // From isAuth middleware
        });

        return res.status(201).json(course);
    } catch (error) {
        return res.status(500).json({ message: `Create Course Error: ${error.message}` });
    }
};

// 2. Get all published courses for Home Page
export const getPublishedCourses = async (req, res) => {
    try {
        const courses = await Course.find({ isPublished: true }).populate("lectures").populate("reviews").populate("creator", "name");

        if (!courses) {
            return res.status(404).json({ message: "Courses not found" });
        }

        return res.status(200).json(courses);
    } catch (error) {
        return res.status(500).json({ message: `Failed to find published courses: ${error.message}` });
    }
};

// 3. Get courses created by a specific Educator
export const getCreatorCourses = async (req, res) => {
    try {
        const courses = await Course.find({ creator: req.userId });

        if (!courses) {
            return res.status(404).json({ message: "Courses not found" });
        }

        return res.status(200).json(courses);
    } catch (error) {
        return res.status(500).json({ message: `Failed to get creator courses: ${error.message}` });
    }
};

// 4. Edit/Update course details including Thumbnail
export const editCourse = async (req, res) => {
    const { courseId } = req.params;
    const { title, subTitle, description, category, level, isPublished, price } = req.body;

    try {
        let course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        let thumbnail;
        if (req.file) {
            const uploadResult = await uploadOnCloudinary(req.file.path);
            thumbnail = uploadResult?.secure_url;
        }

        const updateData = {
            title,
            subTitle,
            description,
            category,
            level,
            isPublished,
            price,
            thumbnail: thumbnail || course.thumbnail
        };

        const updatedCourse = await Course.findByIdAndUpdate(courseId, updateData, { new: true });

        return res.status(200).json(updatedCourse);
    } catch (error) {
        return res.status(500).json({ message: `Failed to edit course: ${error.message}` });
    }
};

// 5. Get a single course by ID
export const getCourseById = async (req, res) => {
    const { courseId } = req.params;

    try {
        const course = await Course.findById(courseId).populate("lectures").populate("reviews").populate("creator", "name");
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        return res.status(200).json(course);
    } catch (error) {
        return res.status(500).json({ message: `Failed to get course by ID: ${error.message}` });
    }
};

// 6. Delete a course
export const removeCourse = async (req, res) => {
    const { courseId } = req.params;

    try {
        const course = await Course.findByIdAndDelete(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        return res.status(200).json({ message: "Course removed" });
    } catch (error) {
        return res.status(500).json({ message: `Failed to delete course: ${error.message}` });
    }
};


// --- FOR LECTURES ---

// 7. Create a lecture and push it to a course
export const createLecture = async (req, res) => {
    const { lectureTitle } = req.body;
    const { courseId } = req.params;

    try {
        if (!lectureTitle || !courseId) {
            return res.status(400).json({ message: "Lecture title is Required" });
        }

        const lecture = await Lecture.create({ lectureTitle });

        const course = await Course.findById(courseId);
        if (course) {
            course.lectures.push(lecture._id);
            await course.populate("lectures");
            await course.save();
        }

        return res.status(201).json({ lecture, course });
    } catch (error) {
        return res.status(500).json({ message: `Failed to create lecture: ${error.message}` });
    }
};

// 8. 🌟 UPDATED: Get all lectures with Enrollment Check
export const getCourseLectures = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.userId;

        const user = await User.findById(userId);
        const isEnrolled = user.enrolledCourses.some(
            (item) => item.courseId.toString() === courseId
        );

        if (!isEnrolled) {
            return res.status(403).json({ success: false, message: "Not Enrolled" });
        }

        // 🌟 Yahan change hai: lectures ko explicitly populate karein
        const course = await Course.findById(courseId).populate({
            path: 'lectures',
            model: 'Lecture' // Ensure karein ki model name sahi hai
        });
        
        console.log("Course with lectures:", course); // Terminal mein check karein lectures dikh rahe hain ya nahi

        return res.status(200).json({ 
            success: true, 
            course: course 
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const editLecture = async (req, res) => {
    const { lectureId } = req.params;
    const { lectureTitle, isPreviewFree, videoUrl } = req.body;

    try {
        let lecture = await Lecture.findById(lectureId);
        if (!lecture) {
            return res.status(404).json({ message: "Lecture not found" });
        }

        // 1. Agar koi file upload hui hai (Cloudinary)
        if (req.file) {
            const uploadResult = await uploadOnCloudinary(req.file.path);
            lecture.videoUrl = uploadResult?.secure_url;

            // 👇 NAYA LOGIC: Cloudinary se duration (seconds mein) milti hai
            // Hum use minutes mein convert karke save kar rahe hain
            if (uploadResult && uploadResult.duration) {
                lecture.duration = Math.round(uploadResult.duration / 60);
                console.log("Lecture duration saved:", lecture.duration, "mins");
            }
        } 
        // 2. Agar direct LINK bheja hai
        else if (videoUrl) {
            lecture.videoUrl = videoUrl;
        }

        if (lectureTitle) lecture.lectureTitle = lectureTitle;
        if (isPreviewFree !== undefined) lecture.isPreviewFree = isPreviewFree;

        await lecture.save();

        return res.status(200).json(lecture);
    } catch (error) {
        return res.status(500).json({ message: `Failed to edit lecture: ${error.message}` });
    }
};

// 10. Remove a lecture from a course and DB
export const removeLecture = async (req, res) => {
    const { lectureId } = req.params;

    try {
        const lecture = await Lecture.findByIdAndDelete(lectureId);
        if (!lecture) {
            return res.status(404).json({ message: "Lecture not found" });
        }

        // Pull the lecture ID out of the associated course
        await Course.updateOne(
            { lectures: lectureId },
            { $pull: { lectures: lectureId } }
        );

        return res.status(200).json({ message: "Lecture removed" });
    } catch (error) {
        return res.status(500).json({ message: `Failed to remove lecture: ${error.message}` });
    }
};

// 11. Get Creator Info (used for the view course page)
export const getCreatorById = async (req, res) => {
    const { userId } = req.body;

    try {
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: `Failed to get creator: ${error.message}` });
    }


};

// 12. 🌟 UPDATED ENROLL IN COURSE (Fixed Validation Error)
export const enrollInCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const userId = req.userId;

        const user = await User.findById(userId);
        const course = await Course.findById(courseId);

        if (!user || !course) {
            return res.status(404).json({ message: "User or Course not found" });
        }

        // 🌟 Check karein naye Object format ke mutabiq
        const isAlreadyEnrolled = user.enrolledCourses.some(
            (item) => item.courseId?.toString() === courseId
        );

        if (isAlreadyEnrolled) {
            return res.status(400).json({ message: "You are already enrolled in this course!" });
        }

        // ✅ Step A: NAYE SCHEMA KE MUTABIQ OBJECT PUSH KAREIN
        user.enrolledCourses.push({
            courseId: courseId, // 👈 Ye 'courseId' name schema se match hona chahiye
            completedLectures: [],
            courseProgress: 0
        });
        await user.save();

        // Step B: Course model update
        if (!course.enrolledStudents.includes(userId)) {
            course.enrolledStudents.push(userId);
            await course.save();
        }

        return res.status(200).json({ message: "🎉 Successfully Enrolled!" });

    } catch (error) {
        return res.status(500).json({ message: `Enrollment failed: ${error.message}` });
    }
};

// 13. 🌟 UPDATED GET ENROLLED COURSES (Fixed Dashboard View)
export const getEnrolledCourses = async (req, res) => {
    try {
        // Deep populate courseId taaki title/thumbnail mil sakein
        const user = await User.findById(req.userId).populate({
            path: 'enrolledCourses.courseId',
            model: 'Course',
            populate: {
                path: 'creator',
                select: 'name'
            }
        });
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Data ko "Flatten" karna taaki Frontend ko title/image purane tarike se mile
        const formattedCourses = user.enrolledCourses.map(item => {
            if (!item.courseId) return null;
            return {
                ...item.courseId._doc,
                progress: item.courseProgress || 0,
                completedLectures: item.completedLectures || []
            };
        }).filter(Boolean);

        return res.status(200).json(formattedCourses);
    } catch (error) {
        return res.status(500).json({ message: `Failed to fetch enrolled courses: ${error.message}` });
    }
};

// Progress Update karne ka Controller
export const updateLectureProgress = async (req, res) => {
    try {
        const { courseId, lectureId } = req.body;
        const userId = req.userId;

        const user = await User.findById(userId).populate('enrolledCourses.courseId');
        const enrolledCourse = user.enrolledCourses.find(c => c.courseId._id.toString() === courseId);

        // 1. Pehle minutes add karein (Har baar jab video khatam ho)
        const lecture = await Lecture.findById(lectureId);
        if (lecture && lecture.duration) {
            // Number() conversion zaroori hai
            user.totalMinutesLearned = (Number(user.totalMinutesLearned) || 0) + Number(lecture.duration);
            console.log("Added Minutes:", lecture.duration);
        }

        // 2. Phir completedLectures update karein (sirf ek baar add hoga array mein)
        if (!enrolledCourse.completedLectures.includes(lectureId)) {
            enrolledCourse.completedLectures.push(lectureId);
        }

        // 3. Progress calculate karein
        const totalLectures = enrolledCourse.courseId.lectures.length;
        enrolledCourse.courseProgress = Math.round((enrolledCourse.completedLectures.length / totalLectures) * 100);

        // updateLectureProgress function ke andar ye logic add karein:

// Date ko "YYYY-MM-DD" format mein lene ka sabse sahi tarika
const todayStr = new Date().toLocaleDateString('en-CA'); // Result: "2026-04-11"
const today = new Date(todayStr);

if (user.lastLectureDate) {
    const lastDateStr = new Date(user.lastLectureDate).toLocaleDateString('en-CA');
    const lastDate = new Date(lastDateStr);

    const diffInTime = today.getTime() - lastDate.getTime();
    const diffInDays = Math.round(diffInTime / (1000 * 3600 * 24));

    console.log("Date Check - Today:", todayStr, "Last:", lastDateStr, "Diff:", diffInDays);

    if (diffInDays === 1) {
        user.streakCount += 1;
    } else if (diffInDays > 1) {
        user.streakCount = 1;
    }
    // diffInDays 0 hai toh kuch nahi badhega
} else {
    user.streakCount = 1;
}

user.lastLectureDate = today; 
await user.save();

// 🚩 YE LINE SABSE IMPORTANT HAI:
// Ise IF-ELSE ke bahar rakhein taaki aaj ki date hamesha save ho jaye.
user.lastLectureDate = today;
        // 4. FINAL SAVE (Sirf ek baar)
        await user.save();
        
        res.status(200).json({ 
            success: true,
            progress: enrolledCourse.courseProgress,
            totalMinutes: user.totalMinutesLearned,
            streak: user.streakCount 
        });
    } catch (error) {
        console.error("Progress Error:", error.message);
        res.status(500).json({ message: error.message });
    }
};