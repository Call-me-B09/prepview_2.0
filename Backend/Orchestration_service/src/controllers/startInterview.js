import { extractResumeText } from "../services/ocrService.js";
import { createSession, saveQuestion, updateSessionFields } from "../services/dbService.js";
import { generateQuestions, generateCodingQuestion } from "../services/aiService.js";
import { generateSpeech } from "../services/ttsService.js";

const startInterview = async (req, res) => {
    try {
        const { role, uid, name } = req.body;
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

        console.log(`[Orchestration] Starting interview orchestration for uid: ${uid}, role: ${role}`);

        const resumeText = await extractResumeText(file);
        const sessionId = await createSession(uid, role);
        const questions = await generateQuestions(role, resumeText);

        const savedQuestions = await Promise.all(
            questions.map(question => saveQuestion(sessionId, question))
        );

        // Generate Coding Question dynamically
        let codingQuestion = null;
        try {
            console.log(`[Orchestration] Generating coding challenge for role: ${role}`);
            const rawCoding = await generateCodingQuestion(role);
            
            const codingIntroText = `Excellent work on the conceptual questions. For the final part of our session, I have prepared a practical coding problem matching the job role. Please review the description on the left and write your solution in the editor. You can write it in code or pseudo-code.`;

            codingQuestion = {
                title: rawCoding.title,
                description: rawCoding.description,
                starterCode: {
                    "javascript": "",
                    "python": "",
                    "cpp": "",
                    "java": "",
                    "pseudocode": ""
                },
                text: codingIntroText
            };
            await updateSessionFields(sessionId, {
                codingProblemTitle: codingQuestion.title,
                codingProblemDescription: codingQuestion.description,
                codingStarterCode: JSON.stringify(codingQuestion.starterCode)
            });
            console.log(`[Orchestration] Saved coding challenge to session: "${codingQuestion.title}"`);
        } catch (codingErr) {
            console.error("[Orchestration] Failed to generate coding question:", codingErr);
        }

        // Generate Liffy introduction text
        const nameVal = name || "Candidate";
        const introText = `Hello ${nameVal}! I am Liffy, your AI interviewer today. I have reviewed your resume and generated some personalized questions for the ${role} position. Let's get started!`;

        // Generate introduction audio
        console.log("[Orchestration] Generating introduction audio...");
        const introAudio = await generateSpeech(introText);

        // Format questions with audio (generated in parallel)
        console.log("[Orchestration] Generating audio for interview questions...");
        const questionsList = await Promise.all(
            savedQuestions.map(async (savedQ) => {
                const audio = await generateSpeech(savedQ.mainQuestion);
                return {
                    questionId: savedQ._id,
                    mainQuestion: savedQ.mainQuestion,
                    audio
                };
            })
        );

        console.log("[Orchestration] Interview session setup successfully!");
        console.log("[Orchestration] Generated Questions details:");
        questionsList.forEach((q, idx) => {
            console.log(`  Question ${idx + 1}: ID=${q.questionId}, Text="${q.mainQuestion.substring(0, 50)}...", Audio Size=${q.audio ? q.audio.length : 0} chars`);
        });

        res.status(201).json({
            success: true,
            sessionId,
            introduction: {
                text: introText,
                audio: introAudio
            },
            questions: questionsList,
            codingQuestion
        });

    } catch (error) {
        console.error("[Orchestration] Error in startInterview orchestration controller:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Internal server error during interview orchestration"
        });
    }
};

export default startInterview;
