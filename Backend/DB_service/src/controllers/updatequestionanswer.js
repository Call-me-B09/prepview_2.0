import QuestionUpdateAnswerService from "../services/questionupdateanswerservice.js";

const updatequestionanswer = async (req, res) => {
    try {
        const questionId = req.params.questionId || req.query.questionId || req.body.questionId;
        const { mainAnswer } = req.body;

        if (!questionId) {
            return res.status(400).json({ error: "questionId is required" });
        }

        if (mainAnswer === undefined) {
            return res.status(400).json({ error: "mainAnswer is required" });
        }

        const question = await QuestionUpdateAnswerService(questionId, mainAnswer);
        if (!question) {
            return res.status(404).json({ error: "Question not found" });
        }

        res.status(200).json(question);
    } catch (error) {
        console.error("Error in updatequestionanswer controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export default updatequestionanswer;
