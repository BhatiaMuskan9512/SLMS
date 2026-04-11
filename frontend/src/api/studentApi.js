import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8000/api/student",
    withCredentials: true
});

export const fetchAllStudents   = () => API.get("/all");
export const fetchStudentsByCourse = () => API.get("/by-course");
export const markLectureComplete   = (data) => API.post("/mark-complete", data);
export const fetchMyProgress       = (courseId) => API.get(`/progress/${courseId}`);