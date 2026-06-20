import { KokoroTTS } from "kokoro-js";

let ttsInstance = null;
let isLoading = false;

export async function getTTSInstance() {
    if (!ttsInstance) {
        if (isLoading) {
            // Wait for instance to finish loading if another request triggered it concurrently
            while (isLoading) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            if (ttsInstance) return ttsInstance;
        }

        isLoading = true;
        try {
            console.log("Initializing local Kokoro-82M TTS model...");
            const model_id = "onnx-community/Kokoro-82M-v1.0-ONNX";
            ttsInstance = await KokoroTTS.from_pretrained(model_id, {
                dtype: "q8",       // 8-bit quantized model for speed and low footprint (~86MB)
                device: "cpu"      // Run locally on CPU in Node environment
            });
            console.log("Kokoro-82M TTS model loaded successfully!");
        } catch (error) {
            console.error("Failed to load Kokoro TTS model:", error);
            throw error;
        } finally {
            isLoading = false;
        }
    }
    return ttsInstance;
}

export async function generateSpeech(text, voice = "af_heart") {
    const tts = await getTTSInstance();
    
    console.log(`Generating speech for text: "${text.substring(0, 40)}..." using voice: ${voice}`);
    const result = await tts.generate(text, {
        voice: voice
    });

    if (!result || !result.audio) {
        throw new Error("Failed to generate audio data from Kokoro TTS");
    }

    const sampleRate = result.sampling_rate || 24000;
    const pcmFloatArray = result.audio; // Float32Array of raw audio samples

    // Encode raw Float32 samples to a 16-bit PCM WAV ArrayBuffer
    const wavArrayBuffer = encodeWAV(pcmFloatArray, sampleRate);

    // Convert ArrayBuffer to Node.js Buffer
    return Buffer.from(wavArrayBuffer);
}

export async function listVoices() {
    const tts = await getTTSInstance();
    return tts.list_voices();
}

// WAV Encoder Helpers
function encodeWAV(samples, sampleRate) {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);

    /* RIFF identifier */
    writeString(view, 0, 'RIFF');
    /* file length */
    view.setUint32(4, 36 + samples.length * 2, true);
    /* RIFF type */
    writeString(view, 8, 'WAVE');
    /* format chunk identifier */
    writeString(view, 12, 'fmt ');
    /* format chunk length */
    view.setUint32(16, 16, true);
    /* sample format (raw PCM = 1) */
    view.setUint16(20, 1, true);
    /* channel count (Mono = 1) */
    view.setUint16(22, 1, true);
    /* sample rate */
    view.setUint32(24, sampleRate, true);
    /* byte rate (sample rate * block align) */
    view.setUint32(28, sampleRate * 2, true);
    /* block align (channel count * bytes per sample) */
    view.setUint16(32, 2, true);
    /* bits per sample */
    view.setUint16(34, 16, true);
    /* data chunk identifier */
    writeString(view, 36, 'data');
    /* data chunk length */
    view.setUint32(40, samples.length * 2, true);

    // Write Float32 samples converted to 16-bit PCM
    floatTo16BitPCM(view, 44, samples);

    return buffer;
}

function floatTo16BitPCM(output, offset, input) {
    for (let i = 0; i < input.length; i++, offset += 2) {
        let s = Math.max(-1, Math.min(1, input[i]));
        output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
}

function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}

