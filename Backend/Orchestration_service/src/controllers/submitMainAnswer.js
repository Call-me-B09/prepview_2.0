import { getQuestion, updateQuestion } from "../services/dbService.js";
import { generateFollowUp } from "../services/aiService.js";
import { transcribeAudio } from "../services/assemblyService.js";
import { generateSpeech } from "../services/ttsService.js";

const submitMainAnswer = async (req, res) => {
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
            return res.status(400).json({ error: "audiol file is required" });
        }

        console.log(`Processing main answer for sessionId: ${sessionId}, questionId: ${questionId}`);

        const mainAnswer = await transcribeAudio(file);

        const questionData = await getQuestion(questionId);
        const mainQuestion = questionData.mainQuestion;

        const followUpQuestion = await generateFollowUp(mainQuestion, mainAnswer);

        await updateQuestion(questionId, {
            mainAnswer,
            followUpQuestion
        });

        let followUpAudio = "";
        try {
            const audioBuffer = await generateSpeech(followUpQuestion);
            followUpAudio = audioBuffer.toString("base64");
        } catch (ttsErr) {
            console.error("Failed to generate TTS for follow-up question:", ttsErr);
        }

        res.status(200).json({
            followUpQuestion,
            followUpAudio
        });

    } catch (error) {
        console.error("Error in submitMainAnswer orchestration controller:", error);
        res.status(500).json({
            error: error.message || "Internal server error during answer submission"
        });
    }
};

export default submitMainAnswer;
