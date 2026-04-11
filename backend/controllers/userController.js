import User from "../models/userModel.js";
import uploadOnCloudinary from "../config/cloudinary.js";

// --- 1. GET CURRENT LOGGED-IN USER ---
export const getCurrentUser = async (req, res) => {
    try {
        // Step A: Deep Populate courseId taaki course ke details mil sakein
        const user = await User.findById(req.userId)
            .select("-password")
            .populate({
                path: 'enrolledCourses.courseId', // 🌟 Naye structure ke hisaab se populate
                model: 'Course'
            });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Step B: Data ko "Flatten" karna taaki Frontend ko "toLowerCase" error na mile
        const formattedCourses = user.enrolledCourses.map(item => {
            if (!item.courseId) return null; // Safety check
            
            return {
                ...item.courseId._doc, // Course ke saare details (title, image, etc.)
                progress: item.courseProgress || 0, // 🌟 Dynamic Progress value
                completedLectures: item.completedLectures || []
            };
        }).filter(Boolean); // Invalid data ko remove karne ke liye

        return res.status(200).json({
            success: true,
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                photoUrl: user.photoUrl,
                totalMinutesLearned: user.totalMinutesLearned,
                streakCount: user.streakCount || 0,
                enrolledCourses: formattedCourses // 🌟 Ab ye Dashboard ke liye ready hai
            }
        });

    } catch (error) {
        return res.status(500).json({ 
            message: `Get Current User Error: ${error.message}` 
        });
    }
};

// --- 2. UPDATE USER PROFILE ---
export const updateProfile = async (req, res) => {
    const { name, description } = req.body;
    const userId = req.userId; // Provided by isAuth middleware

    try {
        // Step A: Find the user first
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Step B: Handle Profile Picture Upload if a file exists
        let photoUrl;
        if (req.file) {
            // Upload the local file path to Cloudinary
            const uploadResult = await uploadOnCloudinary(req.file.path);
            photoUrl = uploadResult?.secure_url;
        }

        // Step C: Prepare updated data
        const updateData = {
            name: name || user.name,
            description: description || user.description,
            photoUrl: photoUrl || user.photoUrl, // Keep old photo if new one isn't uploaded
        };

        // Step D: Update in Database
        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            updateData, 
            { new: true } // Return the updated document
        ).select("-password");

        return res.status(200).json(updatedUser);

    } catch (error) {
        return res.status(500).json({ 
            message: `Update Profile Error: ${error.message}` 
        });
    }
};