import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
    assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fileUrl: { type: String },
    textAnswer: { type: String },
    grade: { type: Number, default: null },
    feedback: { type: String, default: '' },
    submittedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('Submission', submissionSchema);