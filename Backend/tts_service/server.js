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

// Health endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ 
        status: "UP",
        engine: "piper",
        initialized: !!piperConfig
    });
});

// TTS Generation endpoint
app.post("/tts", async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            console.warn("[TTS Service] Warning: Missing text in request body.");
            return res.status(400).json({ error: "text is required" });
        }

        if (!piperConfig) {
            console.warn("[TTS Service] Service not fully initialized yet.");
            return res.status(503).json({ error: "TTS service is initializing, please try again in a few seconds." });
        }

        console.log(`[TTS Service] Generating local speech for text: "${text.substring(0, 50)}..."`);

        const wavBuffer = await runPiper(text, piperConfig.piperExecutable, piperConfig.modelOnnxPath);
        const base64Audio = wavBuffer.toString("base64");
        
        // Wrap base64 in a correct WAV Data URI
        const dataUriAudio = `data:audio/wav;base64,${base64Audio}`;

        console.log(`[TTS Service] Audio generated successfully. Size: ${dataUriAudio.length} characters.`);
        res.status(200).json({
            success: true,
            audio: dataUriAudio
        });

    } catch (error) {
        console.error("[TTS Service] Internal error during local speech generation:", error);
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
