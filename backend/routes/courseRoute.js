import express from "express";
import {
    createCourse,
    getPublishedCourses,
    getCreatorCourses,
    editCourse,
    getCourseById,
    removeCourse,
    createLecture,
    getCourseLectures,
    editLecture,
    removeLecture,
    getCreatorById
} from "../controllers/courseController.js";
import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";

const courseRouter = express.Router();

// --- FOR COURSES ---

// Create a new course (Protected: Requires Login)
courseRouter.post("/create", isAuth, createCourse);

// Get all courses that are published (Public: for Home Page)
courseRouter.get("/get-published", getPublishedCourses);

// Get courses created by the logged-in educator (Protected)
courseRouter.get("/get-creator", isAuth, getCreatorCourses);

// Edit course details and upload thumbnail (Protected + Multer)
courseRouter.post("/edit-course/:courseId", isAuth, upload.single("thumbnail"), editCourse);

// Get single course details by ID (Protected)
courseRouter.get("/get-course/:courseId", isAuth, getCourseById);

// Delete a course (Protected)
courseRouter.delete("/remove/:courseId", isAuth, removeCourse);

// Get Creator info (Public/Internal)
courseRouter.post("/creator", isAuth, getCreatorById);


// --- FOR LECTURES ---

// Add a lecture title to a course (Protected)
courseRouter.post("/create-lecture/:courseId", isAuth, createLecture);

// Get all lectures of a specific course (Protected)
courseRouter.get("/course-lecture/:courseId", isAuth, getCourseLectures);

// Edit lecture and upload video file (Protected + Multer)
courseRouter.post("/edit-lecture/:lectureId", isAuth, upload.single("video"), editLecture);

// Delete a lecture (Protected)
courseRouter.delete("/remove-lecture/:lectureId", isAuth, removeLecture);

export default courseRouter;