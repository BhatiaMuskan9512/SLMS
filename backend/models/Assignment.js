import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    deadline: { type: Date },
    totalMarks: { type: Number, default: 100 },
}, { timestamps: true });

export default mongoose.model('Assignment', assignmentSchema);