import Course from "../models/courseModel.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// 1. Initialize Google Gemini AI with the API Key from .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const searchWithAi = async (req, res) => {
    const { input } = req.body;

    try {
        // --- STEP 1: VALIDATION ---
        if (!input) {
            return res.status(400).json({ message: "Search query is Required" });
        }

        // --- STEP 2: NORMAL SEARCH (REGEX) ---
        // We first try to find courses matching the input directly in Title, Subtitle, or Category
        let courses = await Course.find({
            isPublished: true,
            $or: [
                { title: { $regex: input, $options: "i" } },
                { subTitle: { $regex: input, $options: "i" } },
                { description: { $regex: input, $options: "i" } },
                { category: { $regex: input, $options: "i" } },
                { level: { $regex: input, $options: "i" } },
            ],
        }).populate("creator", "name");

        // --- STEP 3: AI INTEGRATION (GEMINI) ---
        // If normal search finds nothing, or to handle natural language queries like "I want to learn web design"
        if (courses.length > 0) {
            return res.status(200).json(courses);
        } else {
            // Define the AI Model (Gemini 1.5 Flash is recommended for speed)
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            // The Prompt: Telling the AI to behave as a keyword extractor for our LMS
            const prompt = `
                You are an intelligent agent for an LMS platform. 
                A user will type any query about what they want to learn. 
                Your task is to return exactly ONE most relevant keyword from the following list of course categories and levels based on user query: ${input}.
                Categories: Web Development, App Development, AI & ML, Data Science, Ethical Hacking, UI/UX Design, Data Analytics.
                Levels: Beginner, Intermediate, Advanced.
                Return only the keyword string, nothing else.
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const keyword = response.text().trim();

            // Perform search again using the Keyword extracted by AI
            courses = await Course.find({
                isPublished: true,
                $or: [
                    { title: { $regex: keyword, $options: "i" } },
                    { subTitle: { $regex: keyword, $options: "i" } },
                    { description: { $regex: keyword, $options: "i" } },
                    { category: { $regex: keyword, $options: "i" } },
                    { level: { $regex: keyword, $options: "i" } },
                ],
            }).populate("creator", "name");

            return res.status(200).json(courses);
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `Failed to Search: ${error.message}` });
    }
};