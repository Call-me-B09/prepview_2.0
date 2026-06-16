import GetSessionService from "../../services/sessiongetservice.js";

const getusersessions = async (req, res) => {
    try {
        const uid = req.params.uid || req.query.uid || req.body.uid;

        if (!uid) {
            return res.status(400).json({ error: "uid is required" });
        }

        const sessions = await GetSessionService(uid);
        res.status(200).json(sessions);
    } catch (error) {
        console.error("Error in getusersessions controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export default getusersessions;
