import CreateQuestionService from "../services/questioncreateservice.js";

const createquestion = async (req, res) => {
    try {
        const { sessionId, mainQuestion, followUpQuestion } = req.body;

        if (!sessionId || !mainQuestion || !followUpQuestion) {
            return res.status(400).json({ error: "sessionId, mainQuestion, and followUpQuestion are required" });
        }

        const question = await CreateQuestionService(sessionId, mainQuestion, followUpQuestion);
        res.status(201).json(question);
    } catch (error) {
        console.error("Error in createquestion controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export default createquestion;
