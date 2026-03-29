import User from "../models/userModel.js";
import uploadOnCloudinary from "../config/cloudinary.js";

// --- 1. GET CURRENT LOGGED-IN USER ---
export const getCurrentUser = async (req, res) => {
    try {
        // The userId is provided by the isAuth middleware
        const user = await User.findById(req.userId)
            .select("-password") // Exclude password for security
            .populate("enrolledCourses"); // Populate course details for the 'My Courses' section

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            success:true,
            user: {
                name : user.name,
                email : user.email,
                enrolledCourses: user.enrolledCourses || []

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