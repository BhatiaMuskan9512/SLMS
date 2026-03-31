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
        const courses = await Course.find({ isPublished: true }).populate("lectures").populate("reviews");

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
        const course = await Course.findById(courseId).populate("lectures").populate("reviews");
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

// 8. Get all lectures for a specific course
export const getCourseLectures = async (req, res) => {
    const { courseId } = req.params;

    try {
        const course = await Course.findById(courseId).populate("lectures");
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        return res.status(200).json({ course });
    } catch (error) {
        return res.status(500).json({ message: `Failed to get course lectures: ${error.message}` });
    }
};

// 9. Edit lecture and upload Video
// export const editLecture = async (req, res) => {
//     const { lectureId } = req.params;
//     const { lectureTitle, isPreviewFree } = req.body;

//     try {
//         let lecture = await Lecture.findById(lectureId);
//         if (!lecture) {
//             return res.status(404).json({ message: "Lecture not found" });
//         }

//         if (req.file) {
//             const uploadResult = await uploadOnCloudinary(req.file.path);
//             lecture.videoUrl = uploadResult?.secure_url;
//         }

//         if (lectureTitle) lecture.lectureTitle = lectureTitle;
//         if (isPreviewFree !== undefined) lecture.isPreviewFree = isPreviewFree;

//         await lecture.save();

//         return res.status(200).json(lecture);
//     } catch (error) {
//         return res.status(500).json({ message: `Failed to edit lecture: ${error.message}` });
//     }
// };
// backend/controllers/courseController.js mein editLecture function:

export const editLecture = async (req, res) => {
    const { lectureId } = req.params;
    // Hum body se lectureTitle aur videoUrl (link) dono le rahe hain
    const { lectureTitle, isPreviewFree, videoUrl } = req.body;

    try {
        let lecture = await Lecture.findById(lectureId);
        if (!lecture) {
            return res.status(404).json({ message: "Lecture not found" });
        }

        // 1. Agar koi file upload hui hai (Cloudinary), toh URL update karein
        if (req.file) {
            const uploadResult = await uploadOnCloudinary(req.file.path);
            lecture.videoUrl = uploadResult?.secure_url;
        } 
        // 2. Agar file nahi hai par direct LINK (videoUrl) bheja hai, toh usey save karein
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