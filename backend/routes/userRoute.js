import express from "express";
import { 
    getCurrentUser, 
    updateProfile 
} from "../controllers/userController.js";
import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";

const userRouter = express.Router();

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

export default userRouter;