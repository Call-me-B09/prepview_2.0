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

        console.log(`[Orchestration] Processing main answer: Session: ${sessionId}, Question ID: ${questionId}`);
        if (file) {
            console.log(`[Orchestration] Received main answer audio file: ${file.originalname}, Size: ${file.size} bytes, MIME: ${file.mimetype}`);
        } else {
            console.log("[Orchestration] No audio file received");
        }

        let mainAnswer = "";
        try {
            console.log("[Orchestration] Requesting transcription from Assembly service...");
            mainAnswer = await transcribeAudio(file);
            console.log(`[Orchestration] Transcription completed. Text: "${mainAnswer}"`);
        } catch (transcribeErr) {
            console.warn("[Orchestration] Transcription failed or audio was blank, treating as empty response:", transcribeErr.message);
            mainAnswer = "";
        }

        console.log(`[Orchestration] Fetching question details for ID: ${questionId} from DB service...`);
        const questionData = await getQuestion(questionId);
        const mainQuestion = questionData.mainQuestion;
        console.log(`[Orchestration] Question details fetched successfully. Main question: "${mainQuestion}"`);

        if (!mainAnswer.trim()) {
            console.log("[Orchestration] Main answer is blank. Skipping follow-up question generation.");
            const followUpQuestion = "No response provided.";
            await updateQuestion(questionId, {
                mainAnswer: "",
                followUpQuestion
            });

            return res.status(200).json({
                followUpQuestion: "",
                followUpAudio: "",
                hasFollowUp: false,
                noAnswer: true
            });
        }

        console.log("[Orchestration] Requesting AI service to generate follow-up question...");
        const followUpQuestion = await generateFollowUp(mainQuestion, mainAnswer);
        console.log(`[Orchestration] AI follow-up generated successfully: "${followUpQuestion}"`);

        console.log("[Orchestration] Generating audio for follow-up question...");
        const followUpAudio = await generateSpeech(followUpQuestion);

        console.log("[Orchestration] Saving main answer and follow-up question to DB...");
        await updateQuestion(questionId, {
            mainAnswer,
            followUpQuestion
        });
        console.log("[Orchestration] DB updated successfully");

        res.status(200).json({
            followUpQuestion,
            followUpAudio,
            hasFollowUp: true,
            noAnswer: false
        });

    } catch (error) {
        console.error("[Orchestration] Error in submitMainAnswer orchestration controller:", error);
        res.status(500).json({
            error: error.message || "Internal server error during answer submission"
        });
    }
};

export default submitMainAnswer;
