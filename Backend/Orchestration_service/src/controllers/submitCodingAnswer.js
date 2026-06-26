import { getSession, updateSessionFields } from "../services/dbService.js";
import { evaluateCoding } from "../services/aiService.js";

const submitCodingAnswer = async (req, res) => {
    try {
        const { sessionId, codingLanguage, codingSolution } = req.body;

        if (!sessionId || !codingLanguage || codingSolution === undefined) {
            return res.status(400).json({ error: "sessionId, codingLanguage, and codingSolution are required" });
        }

        console.log(`[Orchestration] Processing coding answer submission for session: ${sessionId}, language: ${codingLanguage}`);

        // 1. Fetch the Session to retrieve the coding problem description
        console.log(`[Orchestration] Fetching session details for Session ID: ${sessionId} from DB service...`);
        const session = await getSession(sessionId);
        if (!session) {
            console.warn(`[Orchestration] Session not found for ID: ${sessionId}`);
            return res.status(404).json({ error: "Session not found" });
        }
        console.log(`[Orchestration] Session details fetched successfully. Coding problem: "${session.codingProblemTitle || "Untitled"}"`);

        const codingProblem = session.codingProblemDescription || "Generate coding problem feedback.";

        // 2. Evaluate the coding solution using AI Service
        console.log(`[Orchestration] Requesting AI service to evaluate coding solution...`);
        const evaluation = await evaluateCoding(codingProblem, codingLanguage, codingSolution);
        console.log(`[Orchestration] Coding evaluation received from AI service. Score: ${evaluation.score}`);

        // 3. Save coding details to the session in DB
        console.log(`[Orchestration] Saving coding feedback and score to DB for Session ID: ${sessionId}...`);
        await updateSessionFields(sessionId, {
            codingLanguage,
            codingSolution,
            codingFeedback: evaluation.feedback,
            codingScore: evaluation.score
        });

        console.log(`[Orchestration] Coding evaluation details saved to DB successfully.`);

        res.status(200).json({
            success: true,
            score: evaluation.score,
            feedback: evaluation.feedback
        });

    } catch (error) {
        console.error("[Orchestration] Error in submitCodingAnswer controller:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Internal server error during coding evaluation"
        });
    }
};

export default submitCodingAnswer;
