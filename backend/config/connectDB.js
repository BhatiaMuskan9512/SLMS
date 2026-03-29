import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // Establishing connection using the URL stored in the environment variables
        await mongoose.connect(`${process.env.MONGODB_URL}`);
        
        // Success message displayed in the console upon connection
        console.log("DB Connected");
        
    } catch (error) {
        // Logging any connection errors
        console.log("Error connecting to database:", error);
    }
}

export default connectDB;