import EvaluateSessionService from "../sevices/evaluatesessionservice.js";

const evaluatesession = async (req, res) => {
    try {
        console.log("session evaluation req received");
        const { role, questions } = req.body;

        if (!role || !questions || !Array.isArray(questions)) {
            return res.status(400).json({ error: "role and questions (array) are required" });
        }

        const evaluation = await EvaluateSessionService(role, questions);
        res.status(200).json(evaluation);
    } catch (error) {
        console.error("Error in evaluatesession controller:", error);
        res.status(500).json({ error: error.message || "Internal server error" });
    }
};

export default evaluatesession;
