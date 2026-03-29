import multer from "multer";

// 1. Set up the Disk Storage configuration
const storage = multer.diskStorage({
    // Define the folder where files will be temporarily stored
    destination: function (req, file, cb) {
        // 'cb' is the callback; first parameter is null (for no error)
        // second parameter is the path to the 'public' folder in backend
        cb(null, "./public"); 
    },
    // Define how the file should be named on the server
    filename: function (req, file, cb) {
        // In the video, the original name of the uploaded file is used
        cb(null, file.originalname);
    }
});

// 2. Initialize the upload middleware with the storage settings
const upload = multer({ 
    storage: storage 
});

// 3. Export the upload instance to use in routes
export default upload;