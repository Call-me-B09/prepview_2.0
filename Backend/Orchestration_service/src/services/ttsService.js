import { ensureServiceAwake } from "../utils/serviceHelper.js";

export async function generateSpeech(text) {
    if (!text) return "";
    
    try {
        await ensureServiceAwake(process.env.TTS_SERVICE_URL);
        const ttsUrl = `${process.env.TTS_SERVICE_URL}/tts`;

        console.log(`[Orchestration Service] [TTS Service] Requesting speech generation for: "${text.substring(0, 50)}..."`);
        
        const response = await fetch(ttsUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[Orchestration Service] [TTS Service] Speech generation failed with status ${response.status}: ${errorText}`);
            return "";
        }

        const data = await response.json();
        if (!data.success || !data.audio) {
            console.error("[Orchestration Service] [TTS Service] Response did not contain base64 audio");
            return "";
        }

        console.log(`[Orchestration Service] [TTS Service] Speech generation completed successfully. Audio size: ${data.audio.length} characters.`);
        return data.audio;
    } catch (err) {
        console.error(`[Orchestration Service] [TTS Service] Graceful degradation: Speech generation failed: ${err.message}. Returning empty audio string to trigger frontend client-side speech synthesis fallback.`);
        return "";
    }
}
