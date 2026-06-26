import { getSession, getQuestionsForSession, updateSession, updateQuestionEvaluation } from "../services/dbService.js";
import { evaluateQuestion, evaluateSession } from "../services/aiService.js";

const finishSession = async (req, res) => {
    try {
        const { sessionId } = req.body;

        if (!sessionId) {
            return res.status(400).json({ error: "sessionId is required" });
        }

        console.log(`[Orchestration] [FinishSession] Finishing and evaluating session: ${sessionId}`);

        // 1. Fetch Session details
        console.log(`[Orchestration] [FinishSession] Fetching session details for Session ID: ${sessionId} from DB service...`);
        const session = await getSession(sessionId);
        if (!session) {
            console.warn(`[Orchestration] [FinishSession] Session not found: ${sessionId}`);
            return res.status(404).json({ error: "Session not found" });
        }
        console.log(`[Orchestration] [FinishSession] Session details fetched successfully. Role: "${session.role}"`);

        // 2. Fetch all questions for this session
        console.log(`[Orchestration] [FinishSession] Fetching questions list for session: ${sessionId} from DB service...`);
        const questions = await getQuestionsForSession(sessionId);
        if (!questions || questions.length === 0) {
            console.warn(`[Orchestration] [FinishSession] No questions found for session: ${sessionId}`);
            return res.status(400).json({ error: "No questions found for this session" });
        }
        console.log(`[Orchestration] [FinishSession] Found ${questions.length} questions to process.`);

        const evaluatedQuestions = [];

        // 3. For each question, perform evaluation if not already done
        console.log(`[Orchestration] [FinishSession] Starting evaluation loop for ${questions.length} questions...`);
        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];
            
            // Check if already evaluated (to prevent redundant AI calls)
            if (question.overallScore !== undefined && question.overallScore !== null) {
                console.log(`[Orchestration] [FinishSession] Question ${i + 1}/${questions.length} (ID: ${question._id}) already evaluated. Score: ${question.overallScore}. Skipping AI call.`);
                evaluatedQuestions.push(question);
                continue;
            }

            let evaluationData = {};

            const mainAnswer = question.mainAnswer ? question.mainAnswer.trim() : "";
            const followUpAnswer = question.followUpAnswer ? question.followUpAnswer.trim() : "";

            if (!mainAnswer) {
                console.log(`[Orchestration] [FinishSession] Question ${i + 1}/${questions.length} (ID: ${question._id}) was not answered. Automatically scoring 0.`);
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
                
                console.log(`[Orchestration] [FinishSession] Evaluating question ${i + 1}/${questions.length} (ID: ${question._id}) via AI service...`);
                const aiEval = await evaluateQuestion(
                    question.mainQuestion,
                    mainAnswer,
                    question.followUpQuestion || "Pending...",
                    actualFollowUpAnswer
                );
                console.log(`[Orchestration] [FinishSession] Question ${i + 1} AI evaluation received. Main Score: ${aiEval.mainScore}, Follow-Up Score: ${aiEval.followUpScore}, Overall: ${aiEval.overallScore}`);

                evaluationData = {
                    mainQuestionScore: aiEval.mainScore,
                    mainQuestionFeedback: aiEval.mainfeedback,
                    followUpScore: aiEval.followUpScore,
                    followUpFeedback: aiEval.followupfeedback,
                    overallScore: aiEval.overallScore
                };
            }

            // Save the evaluation in the DB
            console.log(`[Orchestration] [FinishSession] Saving evaluation for question ${question._id} in DB...`);
            const updatedQuestion = await updateQuestionEvaluation(question._id, evaluationData);
            console.log(`[Orchestration] [FinishSession] Evaluation saved successfully for question ${question._id}`);
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
        console.log(`[Orchestration] [FinishSession] Coding challenge data loaded. Language: "${codingData.codingLanguage}", Score: ${codingData.codingScore}`);

        // 5. Perform session-level evaluation incorporating coding data
        console.log(`[Orchestration] [FinishSession] Requesting overall session evaluation from AI service for role: "${session.role}"...`);
        const sessionEvaluation = await evaluateSession(evaluatedQuestions, session.role, codingData);
        console.log(`[Orchestration] [FinishSession] Overall session evaluation received. Score: ${sessionEvaluation.overallScore}`);

        // 6. Update session status, overall score, and recommendations in DB
        console.log(`[Orchestration] [FinishSession] Updating session ${sessionId} status and recommendations in DB...`);
        const updatedSession = await updateSession(
            sessionId,
            sessionEvaluation.overallScore,
            sessionEvaluation.recommendations
        );
        console.log(`[Orchestration] [FinishSession] Session updated successfully. Status: "${updatedSession.status}"`);

        // 6. Return the full structured session summary
        res.status(200).json({
            success: true,
            session: updatedSession,
            questions: evaluatedQuestions
        });

    } catch (error) {
        console.error("[Orchestration] [FinishSession] Error in finishSession controller:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Internal server error during session finalization"
        });
    }
};

export default finishSession;
