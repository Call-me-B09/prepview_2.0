import { updateQuestion } from "../services/dbService.js";
import { transcribeAudio } from "../services/assemblyService.js";

const submitFollowUpAnswer = async (req, res) => {
    try {
        const { sessionId, questionId } = req.body;
        const file = req.file;

        if (!sessionId) {
            return res.status(400).json({ error: "sessionId is required" });
        }
        if (!questionId) {
            return res.status(400).json({ error: "questionId is required" });
        }
        if (!file) {
            return res.status(400).json({ error: "audio file is required" });
        }

        console.log(`[Orchestration] Processing follow-up answer: Session: ${sessionId}, Question ID: ${questionId}`);
        if (file) {
            console.log(`[Orchestration] Received follow-up answer audio file: ${file.originalname}, Size: ${file.size} bytes, MIME: ${file.mimetype}`);
        } else {
            console.log("[Orchestration] No audio file received");
        }

        let followUpAnswer = "";
        try {
            console.log("[Orchestration] Requesting transcription from Assembly service...");
            followUpAnswer = await transcribeAudio(file);
            console.log(`[Orchestration] Transcription completed. Text: "${followUpAnswer}"`);
        } catch (transcribeErr) {
            console.warn("[Orchestration] Transcription failed or audio was blank, treating as empty response:", transcribeErr.message);
            followUpAnswer = "";
        }

        console.log(`[Orchestration] Saving follow-up answer to DB for Question ID: ${questionId}...`);
        await updateQuestion(questionId, {
            followUpAnswer
        });
        console.log("[Orchestration] DB updated successfully");

        res.status(200).json({
            success: true,
            followUpAnswer
        });

    } catch (error) {
        console.error("Error in submitFollowUpAnswer orchestration controller:", error);
        res.status(500).json({
            error: error.message || "Internal server error during follow-up answer submission"
        });
    }
};

export default submitFollowUpAnswer;
