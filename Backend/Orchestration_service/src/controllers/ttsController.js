import { generateSpeech } from "../services/ttsService.js";

const ttsController = async (req, res) => {
    try {
        const { text, voice } = req.body;

        if (!text) {
            return res.status(400).json({ error: "text is required" });
        }

        const audioBuffer = await generateSpeech(text, voice);

        res.set({
            "Content-Type": "audio/wav",
            "Content-Length": audioBuffer.length
        });
        res.status(200).send(audioBuffer);

    } catch (error) {
        console.error("Error in Orchestration TTS controller:", error);
        res.status(500).json({
            error: error.message || "Internal server error during Text-to-Speech proxying"
        });
    }
};

export default ttsController;
