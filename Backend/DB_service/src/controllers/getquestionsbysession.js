import QuestionGetBySessionService from "../services/questiongetbysessionservice.js";

const getquestionsbysession = async (req, res) => {
    try {
        const sessionId = req.params.sessionId || req.query.sessionId || req.body.sessionId;

        if (!sessionId) {
            return res.status(400).json({ error: "sessionId is required" });
        }

        const questions = await QuestionGetBySessionService(sessionId);
        res.status(200).json(questions);
    } catch (error) {
        console.error("Error in getquestionsbysession controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export default getquestionsbysession;
