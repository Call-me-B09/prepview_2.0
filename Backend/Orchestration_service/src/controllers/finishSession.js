import { getSession, getQuestionsForSession, updateSession, updateQuestionEvaluation } from "../services/dbService.js";
import { evaluateQuestion, evaluateSession } from "../services/aiService.js";

const finishSession = async (req, res) => {
    try {
        const { sessionId } = req.body;

        if (!sessionId) {
            return res.status(400).json({ error: "sessionId is required" });
        }

        console.log(`Finishing and evaluating session: ${sessionId}`);

        // 1. Fetch Session details
        const session = await getSession(sessionId);
        if (!session) {
            return res.status(404).json({ error: "Session not found" });
        }

        // 2. Fetch all questions for this session
        const questions = await getQuestionsForSession(sessionId);
        if (!questions || questions.length === 0) {
            return res.status(400).json({ error: "No questions found for this session" });
        }

        const evaluatedQuestions = [];

        // 3. For each question, perform evaluation if not already done
        for (let question of questions) {
            // Check if already evaluated (to prevent redundant AI calls)
            if (question.overallScore !== undefined && question.overallScore !== null) {
                evaluatedQuestions.push(question);
                continue;
            }

            let evaluationData = {};

            const mainAnswer = question.mainAnswer ? question.mainAnswer.trim() : "";
            const followUpAnswer = question.followUpAnswer ? question.followUpAnswer.trim() : "";

            if (!mainAnswer) {
                // If main question was not answered, automatically score 0
                evaluationData = {
                    mainQuestionScore: 0,
                    mainQuestionFeedback: "No response provided by the candidate.",
                    followUpScore: 0,
                    followUpFeedback: "No response provided by the candidate.",
                    overallScore: 0
                };
            } else {
                // Main answer is present, evaluate
                const actualFollowUpAnswer = followUpAnswer || "No follow-up answer was provided by the candidate.";
                
                console.log(`Evaluating question: ${question._id}`);
                const aiEval = await evaluateQuestion(
                    question.mainQuestion,
                    mainAnswer,
                    question.followUpQuestion || "Pending...",
                    actualFollowUpAnswer
                );

                evaluationData = {
                    mainQuestionScore: aiEval.mainScore,
                    mainQuestionFeedback: aiEval.mainfeedback,
                    followUpScore: aiEval.followUpScore,
                    followUpFeedback: aiEval.followupfeedback,
                    overallScore: aiEval.overallScore
                };
            }

            // Save the evaluation in the DB
            const updatedQuestion = await updateQuestionEvaluation(question._id, evaluationData);
            evaluatedQuestions.push(updatedQuestion);
        }

        // 4. Extract coding information from the session if available
        const codingData = {
            codingProblemTitle: session.codingProblemTitle || "",
            codingProblemDescription: session.codingProblemDescription || "",
            codingLanguage: session.codingLanguage || "",
            codingSolution: session.codingSolution || "",
            codingFeedback: session.codingFeedback || "",
            codingScore: session.codingScore !== undefined && session.codingScore !== null ? session.codingScore : null
        };

        // 5. Perform session-level evaluation incorporating coding data
        console.log(`Evaluating overall session: ${sessionId} for role: ${session.role}`);
        const sessionEvaluation = await evaluateSession(evaluatedQuestions, session.role, codingData);

        // 6. Update session status, overall score, and recommendations in DB
        const updatedSession = await updateSession(
            sessionId,
            sessionEvaluation.overallScore,
            sessionEvaluation.recommendations
        );

        // 6. Return the full structured session summary
        res.status(200).json({
            success: true,
            session: updatedSession,
            questions: evaluatedQuestions
        });

    } catch (error) {
        console.error("Error in finishSession controller:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Internal server error during session finalization"
        });
    }
};

export default finishSession;
