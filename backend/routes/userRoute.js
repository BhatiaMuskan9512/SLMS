import express from "express";
import { 
    deleteStudent,
    getAllUsers,
    getCurrentUser, 
    getInstructorCount,  
    register, 
    updateProfile,
    changePassword, 
    getStudentById,
    getInstructorById,
    deleteInstructor,
    updateInstructor,
    sendInstructorOTP,
    verifyInstructorOTP
} from "../controllers/userController.js";
import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";

const userRouter = express.Router();

userRouter.delete("/delete-instructor/:id", isAuth, deleteInstructor);



userRouter.put("/update-instructor/:id", isAuth, upload.single("photoUrl"), updateInstructor);

userRouter.get('/student/:id',getStudentById);

userRouter.get("/all",getAllUsers);

userRouter.get("/instructors-count", getInstructorCount);

userRouter.get("/instructor/:id",getInstructorById);

userRouter.post("/register",register);

userRouter.delete("/delete-student/:id",deleteStudent);

userRouter.post("/send-instructor-otp", isAuth, upload.single("photoUrl"), sendInstructorOTP);
userRouter.post("/verify-instructor-otp", isAuth, verifyInstructorOTP);
/**
 * Route to Get Current Logged-in User Data
 * Protected: Uses isAuth to extract userId from the token
 */
userRouter.get("/get-current-user", isAuth, getCurrentUser);

/**
 * Route to Update User Profile
 * Protected: Requires authentication
 * Multer: upload.single("photoUrl") handles the profile picture file
 */
userRouter.post("/profile", isAuth, upload.single("photoUrl"), updateProfile);

userRouter.put("/change-password", isAuth, changePassword);

export default userRouter;