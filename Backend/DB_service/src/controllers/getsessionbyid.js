import GetSessionByIdService from "../services/sessiongetbyidservice.js";

const getsessionbyid = async (req, res) => {
    try {
        const sessionId = req.params.sessionId || req.query.sessionId || req.body.sessionId;

        if (!sessionId) {
            return res.status(400).json({ error: "sessionId is required" });
        }

        const session = await GetSessionByIdService(sessionId);
        if (!session) {
            return res.status(404).json({ error: "Session not found" });
        }

        res.status(200).json(session);
    } catch (error) {
        console.error("Error in getsessionbyid controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export default getsessionbyid;
