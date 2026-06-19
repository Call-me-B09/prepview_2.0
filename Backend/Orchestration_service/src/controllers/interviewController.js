import { extractResumeText } from "../services/ocrService.js";
import { createSession, saveQuestion } from "../services/dbService.js";
import { generateQuestions } from "../services/aiService.js";

export const startInterview = async (req, res) => {
    try {
        const { role, uid } = req.body;
        const file = req.file;

        if (!role) {
            return res.status(400).json({ error: "role is required" });
        }
        if (!uid) {
            return res.status(400).json({ error: "uid is required" });
        }
        if (!file) {
            return res.status(400).json({ error: "resume file is required" });
        }

        console.log(`Starting interview orchestration for uid: ${uid}, role: ${role}`);

        // 1. Extract text from resume via OCR Service
        console.log("Calling OCR service to extract text...");
        const resumeText = await extractResumeText(file);
        
        // 2. Create session via DB Service
        console.log("Creating session in DB service...");
        const sessionId = await createSession(uid, role);

        // 3. Generate questions via AI Service
        console.log("Generating questions via AI service...");
        const questions = await generateQuestions(role, resumeText);

        // 4. Save generated questions via DB Service
        console.log(`Saving ${questions.length} questions in DB service...`);
        await Promise.all(
            questions.map(question => saveQuestion(sessionId, question))
        );

        console.log("Interview session setup successfully!");
        res.status(201).json({
            success: true,
            sessionId,
            questions
        });

    } catch (error) {
        console.error("Error in startInterview orchestration controller:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Internal server error during interview orchestration"
        });
    }
};
