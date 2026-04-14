import express from 'express';
import {
    createAssignment,
    getCourseAssignments,
    submitAssignment,
    getSubmissions,
    gradeSubmission,
    getMySubmissions
} from '../controllers/assignment.controller.js';
import isAuth from '../middleware/isAuth.js';

const router = express.Router();

router.post('/create', isAuth, createAssignment);
router.get('/course/:courseId', isAuth, getCourseAssignments);
router.post('/submit', isAuth, submitAssignment);
router.get('/submissions/:assignmentId', isAuth, getSubmissions);
router.patch('/grade/:submissionId', isAuth, gradeSubmission);
router.get('/my-submissions', isAuth, getMySubmissions);

export default router;