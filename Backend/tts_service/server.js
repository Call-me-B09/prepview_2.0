import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { spawn } from "child_process";
import { setupPiper } from "./setupPiper.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// HTTP Request logging middleware
app.use((req, res, next) => {
    const start = Date.now();
    console.log(`[TTS Service] [HTTP] Incoming Request: ${req.method} ${req.path}`);
    res.on("finish", () => {
        const duration = Date.now() - start;
        console.log(`[TTS Service] [HTTP] Response: ${req.method} ${req.path} - Status: ${res.statusCode} - Duration: ${duration}ms`);
    });
    next();
});

const PORT = process.env.PORT || 5003;

// Global config populated on startup
let piperConfig = null;

// Helper to run Piper process
const runPiper = (text, piperExe, modelPath) => {
    return new Promise((resolve, reject) => {
        const piper = spawn(piperExe, [
            "--model", modelPath,
            "--output_file", "-"
        ]);

        const chunks = [];
        piper.stdout.on("data", (chunk) => {
            chunks.push(chunk);
        });

        let stderrLogs = "";
        piper.stderr.on("data", (data) => {
            stderrLogs += data.toString();
        });

        piper.on("error", (err) => {
            reject(new Error(`Failed to start Piper process: ${err.message}`));
        });

        piper.on("close", (code) => {
            if (code !== 0) {
                reject(new Error(`Piper process exited with code ${code}. Stderr: ${stderrLogs}`));
            } else {
                resolve(Buffer.concat(chunks));
            }
        });

        piper.stdin.write(text);
        piper.stdin.end();
    });
};

// Health endpoints
app.get("/", (req, res) => {
    res.status(200).json({ 
        status: "UP",
        engine: "piper",
        initialized: !!piperConfig
    });
});

app.get("/health", (req, res) => {
    res.status(200).json({ 
        status: "UP",
        engine: "piper",
        initialized: !!piperConfig
    });
});

// Helper to fetch Google Translate TTS for long text
const getGoogleTtsAudio = async (text) => {
    // Split text into chunks of max 200 characters, trying to split on word boundaries
    const chunks = [];
    let currentChunk = "";
    
    // Split by words
    const words = text.split(/\s+/);
    for (const word of words) {
        if ((currentChunk + " " + word).trim().length <= 200) {
            currentChunk = (currentChunk + " " + word).trim();
        } else {
            if (currentChunk) chunks.push(currentChunk);
            currentChunk = word;
        }
    }
    if (currentChunk) chunks.push(currentChunk);

    const buffers = [];
    for (const chunk of chunks) {
        const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encodeURIComponent(chunk)}`;
        const response = await fetch(googleTtsUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
            }
        });
        if (!response.ok) {
            throw new Error(`Google Translate TTS fallback failed: ${response.status} ${response.statusText}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        buffers.push(Buffer.from(arrayBuffer));
    }
    return Buffer.concat(buffers);
};

// TTS Generation endpoint
app.post("/tts", async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            console.warn("[TTS Service] Warning: Missing text in request body.");
            return res.status(400).json({ error: "text is required" });
        }

        let audioBuffer;
        let mimeType = "audio/wav";

        if (!piperConfig) {
            console.warn("[TTS Service] Piper config is not initialized yet. Falling back to Google Translate TTS directly.");
            audioBuffer = await getGoogleTtsAudio(text);
            mimeType = "audio/mp3";
        } else {
            console.log(`[TTS Service] Generating local speech for text: "${text.substring(0, 50)}..."`);
            try {
                audioBuffer = await runPiper(text, piperConfig.piperExecutable, piperConfig.modelOnnxPath);
            } catch (piperError) {
                console.error("[TTS Service] Piper process execution failed, attempting Google Translate TTS fallback:", piperError.message);
                audioBuffer = await getGoogleTtsAudio(text);
                mimeType = "audio/mp3";
            }
        }

        const base64Audio = audioBuffer.toString("base64");
        
        // Wrap base64 in a correct Data URI
        const dataUriAudio = `data:${mimeType};base64,${base64Audio}`;

        console.log(`[TTS Service] Audio generated successfully. Size: ${dataUriAudio.length} characters.`);
        res.status(200).json({
            success: true,
            audio: dataUriAudio
        });

    } catch (error) {
        console.error("[TTS Service] Internal error during speech generation fallback:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Failed to generate speech audio"
        });
    }
});

app.listen(PORT, async () => {
    console.log(`TTS service is running on port ${PORT}`);
    try {
        piperConfig = await setupPiper();
    } catch (err) {
        console.error("[TTS Service] FATAL: Local Piper TTS initialization failed on startup:", err.message);
    }
});
