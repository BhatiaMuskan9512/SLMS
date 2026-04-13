import express from "express";
import { 
    signUp, 
    login, 
    logout, 
    googleAuth, 
    sendOTP, 
    verifyOTP, 
    resetPassword,
    forgetPassword
} from "../controllers/authController.js";

const authRouter = express.Router();

// --- Standard Auth Routes ---

// Route for User Registration (Signup)
authRouter.post("/sign-up", signUp);

// Route for User Login
authRouter.post("/log-in", login);

// Route for User Logout (Clears Cookies)
// The tutorial uses .get for logout as it just needs to trigger a cookie clear
authRouter.get("/log-out", logout);

// --- Social Auth Routes ---

// Route for Google OAuth (Handles both Login and Signup)
authRouter.post("/google-auth", googleAuth);

// --- Forget Password / OTP Routes ---

// Step 1: Send OTP to email
authRouter.post("/send-otp", sendOTP);

// Step 2: Verify the OTP entered by user
authRouter.post("/verify-otp", verifyOTP);

// Step 3: Reset the password after OTP verification
authRouter.post("/reset-password", resetPassword);

authRouter.post('/forget-password', forgetPassword);



export default authRouter;