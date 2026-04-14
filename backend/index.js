import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/connectDB.js";

// Import Routes
import authRouter from "./routes/authRoute.js";
import userRouter from "./routes/userRoute.js";
import courseRouter from "./routes/courseRoute.js";
import paymentRouter from "./routes/paymentRoute.js";
import reviewRouter from "./routes/reviewRoute.js";
import studentRouter from "./routes/studentRoute.js";
import assignmentRoutes from "./routes/assignment.route.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Connect to Database
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS Configuration
// The creator updated this during deployment to point to the production frontend URL
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // Use your Render/Vercel URL here
    credentials: true
}));

// Basic test route
app.get("/", (req, res) => {
    res.send("Hello from Server");
});

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/course", courseRouter);
app.use("/api/order", paymentRouter);
app.use("/api/review", reviewRouter);
app.use("/api/student",studentRouter);
app.use("/api/assignment",assignmentRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`Server Started on Port ${PORT}`);
});