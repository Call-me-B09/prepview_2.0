import GetUserService from "../../services/usergetservice.js";

const getuser = async (req, res) => {
    try {
        const uid = req.params.uid || req.query.uid || req.body.uid;

        if (!uid) {
            return res.status(400).json({ error: "uid is required" });
        }

        const user = await GetUserService(uid);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error in getuser controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export default getuser;
