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


export const getAllUsers = async (req, res) => {
    try {
        const students = await User.find({ role: "student" })
            .select("-password")
            .populate({
                path: "enrolledCourses.courseId", // ✅ Fix
                select: "title category thumbnail lectures"
            });

        // ✅ Har student ke courses flatten karo
        const formattedStudents = students.map(student => {
            const formattedCourses = student.enrolledCourses.map(item => {
                if (!item.courseId) return null;
                return {
                    ...item.courseId._doc,
                    progress: item.courseProgress || 0,
                };
            }).filter(Boolean);

            return {
                ...student._doc,
                enrolledCourses: formattedCourses
            };
        });

        return res.status(200).json({
            success: true,
            count: formattedStudents.length,
            users: formattedStudents
        });

    } catch(error) {
        return res.status(500).json({
            success: false, 
            message: error.message
        });
    }
};


export const getInstructorCount = async (req, res) => {
    try {
        const instructors = await User.find({ role: "educator" }).select("-password");

        // Har instructor ke courses aur lessons count karo
        const instructorsWithStats = await Promise.all(
            instructors.map(async (inst) => {
                const courses = await Course.find({ creator: inst._id })
                    .select("title lectures");

                const totalLectures = courses.reduce(
                    (acc, c) => acc + (c.lectures?.length || 0), 0
                );

                return {
                    ...inst._doc,
                    coursesCount: courses.length,        // ✅ Dynamic courses count
                    lessonsCount: totalLectures,          // ✅ Dynamic lessons count
                    courses: courses.map(c => ({          // ✅ Filter ke liye course list
                        _id: c._id, 
                        title: c.title 
                    }))
                };
            })
        );

        return res.status(200).json({
            success: true,
            count: instructorsWithStats.length,
            instructors: instructorsWithStats
        });

    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};


export const register = async (req, res) => {
  const { name, email, password, role, isOtpVerified } = req.body;

  try {
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // ✅ YAHI step missing tha
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,  // 🌟 Plain nahi, hashed
      role: role || 'student',
      isOtpVerified: isOtpVerified || true,
    });

    return res.status(201).json({ success: true, message: "Student added!" });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
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


export const getStudentById = async (req, res) => {
    try {
        const student = await User.findById(req.params.id)
            .select("-password")
            .populate({
                path: "enrolledCourses.courseId", // ✅ Yeh sahi hai
                select: "title thumbnail category lectures enrolledStudents"
            });

        if (!student) {
            return res.status(404).json({ 
                success: false, 
                message: "Student not found" 
            });
        }

        // ✅ Flatten karo jaise getCurrentUser mein kiya
        const formattedCourses = student.enrolledCourses.map(item => {
            if (!item.courseId) return null;
            return {
                ...item.courseId._doc,
                progress: item.courseProgress || 0,
                completedLectures: item.completedLectures || []
            };
        }).filter(Boolean);

        return res.status(200).json({ 
            success: true, 
            student: {
                ...student._doc,
                enrolledCourses: formattedCourses // ✅ Proper data
            }
        });

    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};


// Single Instructor detail with their courses
export const getInstructorById = async (req, res) => {
    try {
        const instructor = await User.findById(req.params.id)
            .select("-password");

        if (!instructor) {
            return res.status(404).json({ 
                success: false, 
                message: "Instructor not found" 
            });
        }

        // Instructor ke saare courses fetch karo
        const courses = await Course.find({ creator: req.params.id })
            .select("title thumbnail category enrolledStudents lectures");

        return res.status(200).json({
            success: true,
            instructor,
            courses  // Alag se courses bhej rahe hain
        });

    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};


export const deleteInstructor = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "Instructor not found!" 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: "Instructor deleted successfully!" 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const updateInstructor = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role } = req.body;

        let photoUrl;
        if (req.file) {
            const uploadResult = await uploadOnCloudinary(req.file.path);
            photoUrl = uploadResult?.secure_url;
        }

        const updatedInstructor = await User.findByIdAndUpdate(
            id,
            {
                name: name,
                email: email,
                role: role,
                ...(photoUrl && { photoUrl }) // ✅ Sirf tab update karo jab photo ho
            },
            { new: true }
        ).select("-password");

        if (!updatedInstructor) {
            return res.status(404).json({ 
                success: false, 
                message: "Instructor not found" 
            });
        }

        return res.status(200).json({
            success: true,
            message: "Instructor updated successfully!",
            instructor: updatedInstructor
        });

    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};



// export const sendInstructorOTP = async (req, res) => {
//     try {
//         const { name, email, password } = req.body;

        
//         // ✅ Validation add karo
//         if (!name || !email || !password) {
//             return res.status(400).json({ 
//                 success: false, 
//                 message: "Name, email and password are required!" 
//             });
//         }
        
//         // ✅ Email already exist check
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ 
//                 success: false, 
//                 message: "Email already registered!" 
//             });
//         }

//         // ✅ OTP generate karo
//         const otp = Math.floor(100000 + Math.random() * 900000).toString();

//         // ✅ Temporarily user banao (verified nahi hai abhi)
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Pehle check karo agar pending user hai toh update karo
//         let pendingUser = await User.findOne({ email, isOtpVerified: false });
        
//         if (pendingUser) {
//             pendingUser.resetOtp = otp;
//             pendingUser.otpExpires = Date.now() + 5 * 60 * 1000;
//             pendingUser.name = name;
//             pendingUser.password = hashedPassword;
//             await pendingUser.save();
//         } else {
//             await User.create({
//                 name,
//                 email,
//                 password: hashedPassword,
//                 role: "educator",
//                 resetOtp: otp,
//                 otpExpires: Date.now() + 5 * 60 * 1000,
//                 isOtpVerified: false
//             });
//         }

//         // ✅ Email bhejo
//         await sendMail(email, otp);

//         return res.status(200).json({
//             success: true,
//             message: "OTP sent to instructor's email!"
//         });

//     } catch (error) {
//         return res.status(500).json({ 
//             success: false, 
//             message: error.message 
//         });
//     }
// };




// export const verifyInstructorOTP = async (req, res) => {
//     try {
//         const { email, otp } = req.body;

//         const user = await User.findOne({ email });

//         if (!user) {
//             return res.status(404).json({ 
//                 success: false, 
//                 message: "Instructor not found!" 
//             });
//         }

//         // ✅ OTP check karo
//         if (user.resetOtp !== otp) {
//             return res.status(400).json({ 
//                 success: false, 
//                 message: "Invalid OTP!" 
//             });
//         }

//         // ✅ OTP expire check karo
//         if (user.otpExpires < Date.now()) {
//             return res.status(400).json({ 
//                 success: false, 
//                 message: "OTP expired! Please try again." 
//             });
//         }

//         // ✅ Verify karo
//         user.isOtpVerified = true;
//         user.resetOtp = undefined;
//         user.otpExpires = undefined;
//         await user.save();

//         return res.status(200).json({
//             success: true,
//             message: "Instructor verified successfully!",
//             instructor: {
//                 _id: user._id,
//                 name: user.name,
//                 email: user.email,
//                 role: user.role,
//                 photoUrl: user.photoUrl || "",
//                 coursesCount: 0,
//                 lessonsCount: 0,
//                 courses: []
//             }
//         });

//     } catch (error) {
//         return res.status(500).json({ 
//             success: false, 
//             message: error.message 
//         });
//     }
// };