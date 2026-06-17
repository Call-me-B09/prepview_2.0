import QuestionUpdateFollowUpAnswerService from "../services/questionupdatefollowupanswerservice.js";

const updatequestionfollowupanswer = async (req, res) => {
    try {
        const questionId = req.params.questionId || req.query.questionId || req.body.questionId;
        const { followUpAnswer } = req.body;

        if (!questionId) {
            return res.status(400).json({ error: "questionId is required" });
        }

        if (followUpAnswer === undefined) {
            return res.status(400).json({ error: "followUpAnswer is required" });
        }

        const question = await QuestionUpdateFollowUpAnswerService(questionId, followUpAnswer);
        if (!question) {
            return res.status(404).json({ error: "Question not found" });
        }

        res.status(200).json(question);
    } catch (error) {
        console.error("Error in updatequestionfollowupanswer controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export default updatequestionfollowupanswer;
