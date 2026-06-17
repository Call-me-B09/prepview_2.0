import EvaluateQuestionService from "../sevices/evaluatequestionservice.js";

const evaluatequestion = async (req, res) => {
    try {
        console.log("evaluation req received");
        const { mainQuestion, mainAnswer, followUpQuestion, followUpAnswer } = req.body;

        if (!mainQuestion || !mainAnswer || !followUpQuestion || !followUpAnswer) {
            return res.status(400).json({ error: "mainQuestion, mainAnswer, followUpQuestion, and followUpAnswer are required" });
        }

        const evaluation = await EvaluateQuestionService(mainQuestion, mainAnswer, followUpQuestion, followUpAnswer);
        res.status(200).json(evaluation);
    } catch (error) {
        console.error("Error in evaluatequestion controller:", error);
        res.status(500).json({ error: error.message || "Internal server error" });
    }
};

export default evaluatequestion;
