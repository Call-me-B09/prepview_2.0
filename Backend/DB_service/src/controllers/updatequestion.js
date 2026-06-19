import QuestionUpdateService from "../services/questionupdateservice.js";

const updatequestion = async (req, res) => {
    try {
        const questionId = req.params.questionId || req.query.questionId || req.body.questionId;
        const updateData = req.body;

        if (!questionId) {
            return res.status(400).json({ error: "questionId is required" });
        }

        const question = await QuestionUpdateService(questionId, updateData);
        if (!question) {
            return res.status(404).json({ error: "Question not found" });
        }

        res.status(200).json(question);
    } catch (error) {
        console.error("Error in updatequestion controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export default updatequestion;
