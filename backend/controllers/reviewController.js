import Review from "../models/reviewModel.js";
import Course from "../models/courseModel.js";

// --- 1. CREATE A NEW REVIEW ---
export const createReview = async (req, res) => {
    const { rating, comment, courseId } = req.body;
    const userId = req.userId; // Provided by isAuth middleware

    try {
        // Step A: Check if the course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(400).json({ message: "Course is not found" });
        }

        // Step B: Check if the user has already reviewed this course
        const alreadyReviewed = await Review.findOne({
            course: courseId,
            user: userId,
        });

        if (alreadyReviewed) {
            return res.status(400).json({ 
                message: "You have already reviewed this course" 
            });
        }

        // Step C: Create the review
        const review = new Review({
            course: courseId,
            user: userId,
            rating,
            comment,
        });

        await review.save();

        // Step D: Push the review ID into the Course model's reviews array
        course.reviews.push(review._id);
        await course.save();

        return res.status(201).json(review);

    } catch (error) {
        return res.status(500).json({ 
            message: `Failed to create review: ${error.message}` 
        });
    }
};

// --- 2. GET ALL REVIEWS (WITH POPULATION) ---
export const getReviews = async (req, res) => {
    try {
        // Fetching reviews and populating User details and Course title
        const reviews = await Review.find()
            .populate({
                path: "user",
                select: "name photoUrl description", // Only get these fields from User
            })
            .populate({
                path: "course",
                select: "title", // Only get title from Course
            })
            .sort({ revieedAt: -1 }); // Show latest reviews first (-1)

        return res.status(200).json(reviews);

    } catch (error) {
        return res.status(500).json({ 
            message: `Failed to get reviews: ${error.message}` 
        });
    }
};