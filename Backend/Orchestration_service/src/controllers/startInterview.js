import { extractResumeText } from "../services/ocrService.js";
import { createSession, saveQuestion } from "../services/dbService.js";
import { generateQuestions } from "../services/aiService.js";
import { generateSpeech } from "../services/ttsService.js";

const startInterview = async (req, res) => {
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

        const resumeText = await extractResumeText(file);
        const sessionId = await createSession(uid, role);
        const questions = await generateQuestions(role, resumeText);

        const savedQuestions = await Promise.all(
            questions.map(question => saveQuestion(sessionId, question))
        );

        // Generate TTS audio for each question
        const questionsWithAudio = await Promise.all(
            savedQuestions.map(async (savedQ) => {
                let audio = "";
                try {
                    const audioBuffer = await generateSpeech(savedQ.mainQuestion);
                    audio = audioBuffer.toString("base64");
                } catch (ttsErr) {
                    console.error(`Failed to generate TTS for question ${savedQ._id}:`, ttsErr);
                }
                return {
                    questionId: savedQ._id,
                    mainQuestion: savedQ.mainQuestion,
                    audio
                };
            })
        );

        console.log("Interview session setup successfully!");
        console.log("Generated Questions details:");
        questionsWithAudio.forEach((q, idx) => {
            console.log(`  Question ${idx + 1}: ID=${q.questionId}, Text="${q.mainQuestion.substring(0, 50)}...", Audio length=${q.audio ? q.audio.length : 0}`);
        });

        res.status(201).json({
            success: true,
            sessionId,
            questions: questionsWithAudio
        });

    } catch (error) {
        console.error("Error in startInterview orchestration controller:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Internal server error during interview orchestration"
        });
    }
};

export default startInterview;
