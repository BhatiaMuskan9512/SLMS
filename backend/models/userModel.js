import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        // Optional bio/description for the user profile
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        // Note: Password is not required for Google Auth users
    },
    role: {
        type: String,
        enum: ["student", "educator","admin"],
        required: true
    },
    photoUrl: {
        type: String,
        default: ""
    },
    enrolledCourses: [
        {
            courseId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course",
                required: true
            },
            completedLectures: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Lecture" // Agar aapka Lecture model alag hai toh
                }
            ],
            // 🌟 Aap yahan direct percentage bhi calculate karke rakh sakte hain
            courseProgress: {
                type: Number,
                default: 0
            }
        }
    ],
    // --- Forget Password Logic Fields ---
    resetOtp: {
        type: String
    },
    otpExpires: {
        type: Date
    },
    isOtpVerified: {
        type: Boolean,
        default: false
    },
    // userModel.js mein
   totalMinutesLearned: { 
    type: Number, 
    default: 0 
   },
  
lastLectureDate: { 
    type: Date, 
    default: null 
},
streakCount: { 
    type: Number, 
    default: 0 
}
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;