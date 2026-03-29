import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

// Configuring Cloudinary with credentials from .env
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUD_IN_API_KEY,
    api_secret: process.env.CLOUD_IN_API_SECRET,
});

/**
 * Helper function to upload files to Cloudinary
 * @param {string} filePath - Path of the file in the local 'public' folder
 */
const uploadOnCloudinary = async (filePath) => {
    try {
        if (!filePath) return null;

        // Uploading file to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto", // Automatically detect if it's an image or video
        });

        // File has been uploaded successfully, now remove it from local storage
        fs.unlinkSync(filePath);
        
        return uploadResult;

    } catch (error) {
        // If upload fails, still remove the locally saved temporary file
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        console.log("Cloudinary Upload Error:", error);
        return null;
    }
};

export default uploadOnCloudinary;