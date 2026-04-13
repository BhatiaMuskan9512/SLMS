import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

/**
 * Function to send an email with an OTP
 * @param {string} to - The recipient's email address
 * @param {string} otp - The 6-digit generated OTP
 */
const sendMail = async (to, otp) => {
    // 1. Create a transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.USER_EMAIL,    // Your Gmail address
            pass: process.env.USER_PASSWORD, // Your App Password
        },
    });

    // ADD THIS — verify connection before sending
    try {
        await transporter.verify();
        console.log("✅ Mail server connected successfully");
    } catch (verifyError) {
        console.log("❌ Mail server connection failed:", verifyError.message);
        return null;
    }
    
    try {
        // 2. Define email options
        const info = await transporter.sendMail({
            from: process.env.USER_EMAIL, // Sender address
            to: to,                      // Recipient address
            subject: "Verify Your SkillLink Account",
            
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2>SkillLink Verification Code</h2>
                    <p>Your OTP for Verification is:</p>
                    <h1 style="color: #000; letter-spacing: 5px;">${otp}</h1>
                    <p>This OTP is valid for <b>5 minutes</b>. Do not share it with anyone.</p>
                </div>
            `,
        });

        return info;

    } catch (error) {
        console.log("Nodemailer Error:", error);
        return null;
    }
};

export default sendMail;