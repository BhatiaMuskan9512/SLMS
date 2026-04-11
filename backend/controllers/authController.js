import User from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import genToken from "../config/token.js";
import sendMail from "../config/sendMail.js";
import jwt from "jsonwebtoken";

// --- SIGN UP ---
// --- UPDATED SIGN UP ---
export const signUp = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        let existUser = await User.findOne({ email });
        if (existUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Enter valid email" });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // 1. Generate OTP (6-digit as per your sendMail.js)
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // 2. Create user with OTP fields
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || "student",
            resetOtp: otp, // Temporarily using this for signup verification
            otpExpires: Date.now() + 5 * 60 * 1000,
            isOtpVerified: false
        });

        // 3. SEND THE EMAIL (This was missing!)
        await sendMail(email, otp);

        return res.status(200).json({ 
            success: true, 
            message: "Verified",
            email: user.email 
        });

    } catch (error) {
        return res.status(500).json({ message: `Sign up Error: ${error.message}` });
    }
};
// export const signUp = async (req, res) => {
//     const { name, email, password, role } = req.body;

//     try {
//         // Check if user already exists
//         let existUser = await User.findOne({ email });
//         if (existUser) {
//             return res.status(400).json({ message: "User is already exist" });
//         }

//         // Validate email format
//         if (!validator.isEmail(email)) {
//             return res.status(400).json({ message: "Enter valid email" });
//         }

//         // Validate password strength
//         if (password.length < 8) {
//             return res.status(400).json({ message: "Enter strong password" });
//         }

//         // Hash password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Create user
//         const user = await User.create({
//             name,
//             email,
//             password: hashedPassword,
//             role,
//         });

//         // Generate and Set Token in Cookie
//         const token = await genToken(user._id);

//         res.cookie("token", token, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === "production", // true in production
//             sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
//             maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//         });

//         return res.status(201).json(user);

//     } catch (error) {
//         return res.status(500).json({ message: `Sign up Error: ${error.message}` });
//     }
// };

// --- LOGIN ---
export const login = async (req, res) => {
        try {
            const { email, password } = req.body;

            // 1. Check karo ki email aur password aaye hain ya nahi
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Please provide both email and password."
                });
            }

            // 2. Database mein user ko dhundo
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password." 
                });
            }

            // 3. Sabse Important: Check karo ki user Verified hai ya nahi
            if (!user.isOtpVerified) {
                return res.status(403).json({
                    success: false,
                    message: "Your account is not verified. Please verify your OTP first."
                });
            }

            // 4. Password match karo (Bcrypt use karke)
            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (!isPasswordMatch) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password."
                });
            }

            // 5. JWT Token generate karo (Login session ke liye)
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

            // 6. Success Response
            return res.status(200).cookie("token", token, { httpOnly: true,
                                                             
                                                             secure : false,
                                                              maxAge: 24 * 60 * 60 * 1000 }).json({
                success: true,
                message: `Welcome back, ${user.name}`,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                token // Frontend mein localStorage mein save karne ke liye
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    };
    // try {
    //     const user = await User.findOne({ email });
    //     if (!user) {
    //         return res.status(404).json({ message: "User not found" });
    //     }

    //     const isMatch = await bcrypt.compare(password, user.password);
    //     if (!isMatch) {
    //         return res.status(400).json({ message: "Incorrect password" });
    //     }

    //     const token = await genToken(user._id);

    //     res.cookie("token", token, {
    //         httpOnly: true,
    //         secure: process.env.NODE_ENV === "production",
    //         sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    //         maxAge: 7 * 24 * 60 * 60 * 1000,
    //     });

    //     return res.status(200).json(user);

    // } catch (error) {
    //     return res.status(500).json({ message: `Login Error: ${error.message}` });
    // }


// --- LOGOUT ---
export const logout = async (req, res) => {
    try {
        // Cookie ko clear kar rahe hain
        return res.status(200).cookie("token", "", {
            httpOnly: true,
            sameSite:"lax",
            secure:false,
            maxAge: 0 
            
            }).json({
            success: true,
            message: "Logged out successfully."
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
// export const logout = async (req, res) => {
//     try {
//         res.clearCookie("token");
//         return res.status(200).json({ message: "Log out successfully" });
//     } catch (error) {
//         return res.status(500).json({ message: `Logout Error: ${error.message}` });
//     }
// };

// --- GOOGLE AUTH ---
export const googleAuth = async (req, res) => {
    const { name, email, role } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            // Create user if they don't exist (Google Sign Up)
            user = await User.create({
                name,
                email,
                role: role || "student",
            });
        }

        const token = await genToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json(user);

    } catch (error) {
        return res.status(500).json({ message: `Google Auth Error: ${error.message}` });
    }
};

// --- SEND OTP (FORGET PASSWORD STEP 1) ---
export const sendOTP = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate 4-digit random OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        user.resetOtp = otp;
        user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
        user.isOtpVerified = false;

        await user.save();
        await sendMail(email, otp);

        return res.status(200).json({ message: "OTP sent successfully" });

    } catch (error) {
        return res.status(500).json({ message: `Send OTP Error: ${error.message}` });
    }
};

// --- VERIFY OTP (FORGET PASSWORD STEP 2) ---
export const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || user.resetOtp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        user.isOtpVerified = true;
        user.resetOtp = undefined;
        user.otpExpires = undefined;

        await user.save();

        return res.status(200).json({ message: "OTP verified successfully" });

    } catch (error) {
        return res.status(500).json({ message: `Verify OTP Error: ${error.message}` });
    }
};

// --- RESET PASSWORD (FORGET PASSWORD STEP 3) ---
export const resetPassword = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || !user.isOtpVerified) {
            return res.status(400).json({ message: "OTP verification is required" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.isOtpVerified = false; // Reset verification status

        await user.save();

        return res.status(200).json({ message: "Reset password successfully" });

    } catch (error) {
        return res.status(500).json({ message: `Reset Password Error: ${error.message}` });
    }
};