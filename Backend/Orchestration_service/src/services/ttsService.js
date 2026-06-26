import { ensureServiceAwake } from "../utils/serviceHelper.js";

export async function generateSpeech(text, voice) {
    await ensureServiceAwake(process.env.TTS_SERVICE_URL);
    const ttsUrl = `${process.env.TTS_SERVICE_URL}/tts`;

    const response = await fetch(ttsUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ text, voice })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`TTS service failed with status ${response.status}: ${errorText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
}
