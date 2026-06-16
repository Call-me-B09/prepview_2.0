import CreateSessionService from "../../services/sessioncreateservice.js";

const createsession = async (req, res) => {
    try {
        const { uid, role } = req.body;

        if (!uid || !role) {
            return res.status(400).json({ error: "uid and role are required" });
        }

        const session = await CreateSessionService(uid, role);
        res.status(201).json({ sessionId: session._id });
    } catch (error) {
        console.error("Error in createsession controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export default createsession;
