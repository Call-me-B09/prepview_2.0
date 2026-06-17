import UpdateSessionService from "../services/sessionupdateservice.js";

const updatesession = async (req, res) => {
    try {
        const sessionId = req.params.sessionId || req.query.sessionId || req.body.sessionId;
        const { overallScore, recommendations } = req.body;

        if (!sessionId) {
            return res.status(400).json({ error: "sessionId is required" });
        }

        if (overallScore === undefined || !recommendations) {
            return res.status(400).json({ error: "overallScore and recommendations are required" });
        }

        const session = await UpdateSessionService(sessionId, overallScore, recommendations);
        if (!session) {
            return res.status(404).json({ error: "Session not found" });
        }

        res.status(200).json(session);
    } catch (error) {
        console.error("Error in updatesession controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export default updatesession;
