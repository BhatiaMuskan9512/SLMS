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
// --- 2. VERIFY PAYMENT & ENROLL USER ---
export const verifyPayment = async (req, res) => {
    const { courseId, userId, razorpay_order_id } = req.body;

    try {
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

        if (orderInfo.status === "paid") {
            
            // Step A: Update User's Enrolled Courses (Updated for Progress Tracking)
            const user = await User.findById(userId);
            
            if (user) {
                // 🌟 Naya format check: Kya user pehle se enroll hai?
                const isAlreadyEnrolled = user.enrolledCourses.some(
                    (item) => item.courseId.toString() === courseId
                );

                if (!isAlreadyEnrolled) {
                    // ✅ Naye schema ke mutabiq object push karein
                    user.enrolledCourses.push({
                        courseId: courseId,
                        completedLectures: [],
                        courseProgress: 0 // Default progress 0%
                    });
                    await user.save();
                }
            }

            // Step B: Update Course's Enrolled Students (Wahi rahega)
           // Step B: Update Course's Enrolled Students
                const course = await Course.findById(courseId);
                if (course) {
                    // 🌟 Check karein ki user ID pehle se list mein hai ya nahi
                    const studentExists = course.enrolledStudents.includes(userId);
                    
                    if (!studentExists) {
                        course.enrolledStudents.push(userId);
                        await course.save();
                    }
                }

            return res.status(200).json({ 
                message: "Payment verified and enrollment successful" 
            });

        } else {
            return res.status(400).json({ message: "Payment failed" });
        }

    } catch (error) {
        return res.status(500).json({ 
            message: `Internal server error during payment verification: ${error.message}` 
        });
    }
};