import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    // Reference to the Course being reviewed
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    // Reference to the User who wrote the review
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    // Star rating (usually 1 to 5)
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    // Text feedback
    comment: {
        type: String,
        required: true,
        trim: true // Removes extra spaces from start and end
    },
    // Manual date field (though timestamps also handle this)
    revieedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Review = mongoose.model("Review", reviewSchema);

export default Review;