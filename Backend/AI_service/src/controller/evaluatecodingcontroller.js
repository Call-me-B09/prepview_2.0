import EvaluateCodingService from "../sevices/evaluatecodingservice.js";

const evaluatecoding = async (req, res) => {
    try {
        const { codingProblem, codingLanguage, codingSolution } = req.body;

        if (!codingProblem || !codingLanguage || codingSolution === undefined) {
            return res.status(400).json({ error: "codingProblem, codingLanguage, and codingSolution are required" });
        }

        const evaluation = await EvaluateCodingService(codingProblem, codingLanguage, codingSolution);
        res.status(200).json(evaluation);
    } catch (error) {
        console.error("Error in evaluatecoding controller:", error);
        res.status(500).json({ error: error.message || "Internal server error" });
    }
};

export default evaluatecoding;
