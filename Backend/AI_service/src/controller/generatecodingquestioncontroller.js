import GenerateCodingQuestionService from "../sevices/generatecodingquestionservice.js";

const generatecodingquestion = async (req, res) => {
    try {
        const { role } = req.body;

        if (!role) {
            return res.status(400).json({ error: "role is required" });
        }

        const codingQuestion = await GenerateCodingQuestionService(role);
        res.status(200).json({ codingQuestion });
    } catch (error) {
        console.error("Error in generatecodingquestion controller:", error);
        res.status(500).json({ error: error.message || "Internal server error" });
    }
};

export default generatecodingquestion;
