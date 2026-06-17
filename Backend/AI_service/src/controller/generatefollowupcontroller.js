import GenerateFollowUpService from "../sevices/generatefollowupservice.js";

const generatefollowup = async (req, res) => {
    try {
        console.log("follow-up req received");
        const { mainQuestion, mainAnswer } = req.body;

        if (!mainQuestion || !mainAnswer) {
            return res.status(400).json({ error: "mainQuestion and mainAnswer are required" });
        }

        const followUpQuestion = await GenerateFollowUpService(mainQuestion, mainAnswer);
        res.status(200).json({ followUpQuestion });
    } catch (error) {
        console.error("Error in generatefollowup controller:", error);
        res.status(500).json({ error: error.message || "Internal server error" });
    }
};

export default generatefollowup;
