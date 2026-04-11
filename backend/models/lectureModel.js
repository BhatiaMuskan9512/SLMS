import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
    lectureTitle: {
        type: String,
        required: true
    },
    videoUrl: {
        type: String
    },
    isPreviewFree: {
        type: Boolean,
        default: false
    },
    duration: { 
        type: Number, default: 0 
    }
}, { timestamps: true });

const Lecture = mongoose.model("Lecture", lectureSchema);

export default Lecture;