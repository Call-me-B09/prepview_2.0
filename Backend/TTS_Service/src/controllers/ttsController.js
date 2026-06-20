import { generateSpeech, listVoices } from "../services/ttsService.js";

export const getSpeech = async (req, res) => {
    try {
        const { text, voice } = req.body;

        if (!text) {
            return res.status(400).json({ error: "text is required" });
        }

        const selectedVoice = voice || "af_heart"; // default voice
        const audioBuffer = await generateSpeech(text, selectedVoice);

        // Send binary WAV audio data back
        res.set({
            "Content-Type": "audio/wav",
            "Content-Length": audioBuffer.length
        });
        res.status(200).send(audioBuffer);
    } catch (error) {
        console.error("Error in getSpeech controller:", error);
        res.status(500).json({ error: error.message || "Internal server error during speech generation" });
    }
};

export const getVoices = async (req, res) => {
    try {
        const voices = await listVoices();
        res.status(200).json({ voices });
    } catch (error) {
        console.error("Error in getVoices controller:", error);
        res.status(500).json({ error: error.message || "Internal server error retrieving voices" });
    }
};
