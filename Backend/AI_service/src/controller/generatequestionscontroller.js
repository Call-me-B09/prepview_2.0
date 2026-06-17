import GenerateQuestionService from "../sevices/generatequestionservice.js";

const generatequestions = async (req, res) => {
    try {
        console.log("req recived");
        
        const { role, resumeText } = req.body;

        if (!role || !resumeText) {
            return res.status(400).json({ error: "role and resumeText are required" });
        }

        const questions = await GenerateQuestionService(role, resumeText);
        res.status(200).json({ questions });
    } catch (error) {
        console.error("Error in generatequestions controller:", error);
        res.status(500).json({ error: error.message || "Internal server error" });
    }
};

export default generatequestions;
