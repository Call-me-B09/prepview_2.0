import QuestionUpdateEvaluationService from "../services/questionupdateevaluationservice.js";

const updatequestionevaluation = async (req, res) => {
    try {
        const questionId = req.params.questionId || req.query.questionId || req.body.questionId;
        const { mainQuestionScore, mainQuestionFeedback, followUpScore, followUpFeedback, overallScore } = req.body;

        if (!questionId) {
            return res.status(400).json({ error: "questionId is required" });
        }

        if (
            mainQuestionScore === undefined ||
            mainQuestionFeedback === undefined ||
            followUpScore === undefined ||
            followUpFeedback === undefined ||
            overallScore === undefined
        ) {
            return res.status(400).json({ error: "All evaluation fields (mainQuestionScore, mainQuestionFeedback, followUpScore, followUpFeedback, overallScore) are required" });
        }

        const question = await QuestionUpdateEvaluationService(questionId, {
            mainQuestionScore,
            mainQuestionFeedback,
            followUpScore,
            followUpFeedback,
            overallScore
        });

        if (!question) {
            return res.status(404).json({ error: "Question not found" });
        }

        res.status(200).json(question);
    } catch (error) {
        console.error("Error in updatequestionevaluation controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export default updatequestionevaluation;
