import Razorpay from "razorpay";
import Course from "../models/courseModel.js";
import User from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

// Creating a Razorpay instance using credentials from .env
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// --- 1. CREATE RAZORPAY ORDER ---
export const razorpayOrder = async (req, res) => {
    const { courseId } = req.body;

    try {
        // Find the course to get its price
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Setting options for Razorpay order creation
        const options = {
            amount: Number(course.price * 100), // Amount in paise (e.g., 500 INR = 50000 paise)
            currency: "INR",
            receipt: courseId.toString(),
        };

        // Create the order using the Razorpay instance
        const order = await razorpayInstance.orders.create(options);

        // Return the order details to the frontend
        return res.status(200).json(order);

    } catch (error) {
        return res.status(500).json({ message: `Failed to create Razorpay order: ${error.message}` });
    }
};

// --- 2. VERIFY PAYMENT & ENROLL USER ---
export const verifyPayment = async (req, res) => {
    const { courseId, userId, razorpay_order_id } = req.body;

    try {
        // Fetch order info from Razorpay using the order ID
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

        // Check if the order status is 'paid'
        if (orderInfo.status === "paid") {
            
            // Step A: Update User's Enrolled Courses
            const user = await User.findById(userId);
            if (user && !user.enrolledCourses.includes(courseId)) {
                user.enrolledCourses.push(courseId);
                await user.save();
            }

            // Step B: Update Course's Enrolled Students
            const course = await Course.findById(courseId).populate("lectures");
            if (course && !course.enrolledStudents.includes(userId)) {
                course.enrolledStudents.push(userId);
                await course.save();
            }

            return res.status(200).json({ 
                message: "Payment verified and enrollment successfully" 
            });

        } else {
            // If the status is not 'paid'
            return res.status(400).json({ message: "Payment failed" });
        }

    } catch (error) {
        return res.status(500).json({ 
            message: `Internal server error during payment verification: ${error.message}` 
        });
    }
};