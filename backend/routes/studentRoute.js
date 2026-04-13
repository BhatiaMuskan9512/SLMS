import express from "express";
import {
    getAllStudents,
    getStudentsByCourse,
    markLectureComplete,
    getMyProgress
} from "../controllers/studentController.js";
import isAuth from "../middleware/isAuth.js";

const studentRouter = express.Router();

studentRouter.use(isAuth);

studentRouter.get("/all", getAllStudents);
studentRouter.get("/by-course", getStudentsByCourse);
studentRouter.post("/mark-complete", markLectureComplete);
studentRouter.get("/progress/:courseId", getMyProgress);

export default studentRouter;