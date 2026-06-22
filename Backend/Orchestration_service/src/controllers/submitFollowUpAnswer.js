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

        console.log(`Processing follow-up answer for sessionId: ${sessionId}, questionId: ${questionId}`);

        let followUpAnswer = "";
        try {
            followUpAnswer = await transcribeAudio(file);
        } catch (transcribeErr) {
            console.warn("Transcription failed or audio was blank, treating as empty response:", transcribeErr.message);
            followUpAnswer = "";
        }

        await updateQuestion(questionId, {
            followUpAnswer
        });

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
