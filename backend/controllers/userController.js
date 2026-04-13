import mongoose from "mongoose";
import User from "../models/userModel.js";
import Course from "../models/courseModel.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import bcrypt from "bcrypt"; // Ensure bcrypt import hai upar

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


export const getAllUsers = async (req, res)=>{
    try{
        //Hum unhe count kar rahe hai jinka role student hai
        const students = await User.find({role: "student"}).populate("enrolledCourses");

        console.log("First student courses:", students[0]?.enrolledCourses, null, 2);
        return res.status(200).json(
            {
                success: true,
                count: students.length, //Frontend isi 'count' ko use karega
                users: students
            });
    } catch(error){
        return res.status(500).json({success: false, message: error.message});
    }
};


export const getInstructorCount = async (req,res) =>{
    try{
        //Apna role 'educator' 
        const instructors = await User.find({role: "educator"});
        return res.status(200).json({
            success: true,
            count: instructors.length,
            instructors: instructors
        });
    } catch(error){
        return res.status(500).json({success: false, message: error.message});
    }
};


// Naya Student Register karne ke liye
export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // 1. Check karein ki user pehle se toh nahi hai
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already registered!" });
        }

        // 2. Naya user create karein (Password hash middleware agar lagaya hai toh theek, warna direct save)
        const newUser = new User({
            name,
            email,
            password, // ideally ise hash karna chahiye bcrypt se
            role: role || 'student',
            enrolledCourses: [] // Shuruat mein khali rakhenge jaisa aapne kaha
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: "Student registered successfully!",
            user: newUser
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- 3. CHANGE PASSWORD (Logged-in User) ---


export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.userId; // isAuth middleware se aa raha hai

        // 1. User ko database mein dhoondein
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // 2. Check karein ki purana password sahi hai ya nahi
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Current password is incorrect! 🔐" });
        }

        // 3. Naye password ko hash karein aur save karein
        const salt = await bcrypt.genSalt(10);
        const hashedSecondary = await bcrypt.hash(newPassword, salt);
        
        user.password = hashedSecondary;
        await user.save();

        return res.status(200).json({ 
            success: true, 
            message: "Password updated successfully! 🎉" 
        });

    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: `Change Password Error: ${error.message}` 
        });
    }
};

export const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params; // 🌟 Frontend se ID params mein aayegi
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ success: false, message: "Student not found!" });
        }

        res.status(200).json({ success: true, message: "Student deleted successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// --- GET SINGLE STUDENT BY ID (Admin Preview) ---
export const getStudentById = async (req, res) => {
    try {
        const student = await User.findById(req.params.id)
            .select("-password")
            .populate({
                path: "enrolledCourses",
                select: "title thumbnail category lectures enrolledStudents"
            });

        if (!student) {
            return res.status(404).json({ 
                success: false, 
                message: "Student not found" 
            });
        }

        console.log("Courses count ", student.enrolledCourses.length);

        return res.status(200).json({ 
            success: true, 
            student 
        });

    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};
