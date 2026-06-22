import { getSession, updateSessionFields } from "../services/dbService.js";
import { evaluateCoding } from "../services/aiService.js";

const submitCodingAnswer = async (req, res) => {
    try {
        const { sessionId, codingLanguage, codingSolution } = req.body;

        if (!sessionId || !codingLanguage || codingSolution === undefined) {
            return res.status(400).json({ error: "sessionId, codingLanguage, and codingSolution are required" });
        }

        console.log(`Submitting coding answer for session: ${sessionId}, language: ${codingLanguage}`);

        // 1. Fetch the Session to retrieve the coding problem description
        const session = await getSession(sessionId);
        if (!session) {
            return res.status(404).json({ error: "Session not found" });
        }

        const codingProblem = session.codingProblemDescription || "Generate coding problem feedback.";

        // 2. Evaluate the coding solution using AI Service
        console.log(`Evaluating coding answer...`);
        const evaluation = await evaluateCoding(codingProblem, codingLanguage, codingSolution);

        // 3. Save coding details to the session in DB
        await updateSessionFields(sessionId, {
            codingLanguage,
            codingSolution,
            codingFeedback: evaluation.feedback,
            codingScore: evaluation.score
        });

        console.log(`Saved coding evaluation details: Score=${evaluation.score}`);

        res.status(200).json({
            success: true,
            score: evaluation.score,
            feedback: evaluation.feedback
        });

    } catch (error) {
        console.error("Error in submitCodingAnswer controller:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Internal server error during coding evaluation"
        });
    }
};

export default submitCodingAnswer;
