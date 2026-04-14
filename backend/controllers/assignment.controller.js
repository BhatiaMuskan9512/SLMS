import Assignment from '../models/Assignment.js';
import Submission from '../models/Submission.js';

// Teacher: Assignment banao
export const createAssignment = async (req, res) => {
    try {
        const { title, description, courseId, deadline, totalMarks } = req.body;
        const assignment = await Assignment.create({
            title, description, courseId,
            createdBy: req.userId,
            deadline, totalMarks
        });
        res.json({ success: true, assignment });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Student + Teacher: Course ke assignments lo
export const getCourseAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find({ courseId: req.params.courseId });
        res.json({ success: true, assignments });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Student: Submit karo
export const submitAssignment = async (req, res) => {
    try {
        const { assignmentId, textAnswer, fileUrl } = req.body;

        // Check: already submit kiya?
        const existing = await Submission.findOne({
            assignmentId, studentId: req.userId
        });
        if (existing) return res.status(400).json({ success: false, message: 'Already submitted!' });

        const submission = await Submission.create({
            assignmentId,
            studentId: req.userId,
            textAnswer, fileUrl
        });
        res.json({ success: true, submission });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

//Teacher: Submissions dekho
export const getSubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find({ assignmentId: req.params.assignmentId })
            .populate('studentId', 'name email');
        res.json({ success: true, submissions });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Student: Apni submissions lo (to check what's already submitted)
export const getMySubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find({ 
            studentId: req.userId 
        }).select('assignmentId grade feedback');
        res.json({ success: true, submissions });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Teacher: Grade do
export const gradeSubmission = async (req, res) => {
    try {
        const { grade, feedback } = req.body;
        const submission = await Submission.findByIdAndUpdate(
            req.params.submissionId,
            { grade, feedback },
            { new: true }
        );
        res.json({ success: true, submission });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};