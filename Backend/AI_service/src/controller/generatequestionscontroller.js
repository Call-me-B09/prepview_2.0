import GenerateQuestionService from "../sevices/generatequestionservice.js";

const generatequestions = async (req, res) => {
    try {
        const { role, resumeText } = req.body;
        console.log(`[AI Controller] Generate Questions requested for role: "${role}"`);
        if (resumeText) {
            console.log(`[AI Controller] Resume text snippet: "${resumeText.substring(0, 80).replace(/\n/g, ' ')}..." (Total length: ${resumeText.length} characters)`);
        }

        if (!role || !resumeText) {
            console.warn("[AI Controller] Warning: Missing role or resumeText in request body");
            return res.status(400).json({ error: "role and resumeText are required" });
        }

        console.log("[AI Controller] Invoking Gemini LLM generation service...");
        const questions = await GenerateQuestionService(role, resumeText);
        console.log(`[AI Controller] Successfully generated ${questions ? questions.length : 0} conceptual questions`);
        
        res.status(200).json({ questions });
    } catch (error) {
        console.error("[AI Controller] Error in generatequestions controller:", error.message);
        res.status(500).json({ error: error.message || "Internal server error" });
    }
};

export default generatequestions;
