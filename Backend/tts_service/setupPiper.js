import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import { Readable } from "stream";
import { pipeline } from "stream/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BIN_DIR = path.resolve(__dirname, "bin");
const MODELS_DIR = path.resolve(__dirname, "models");

// Default to en_US-kristin-medium (a warm, clear, and sweeter tone)
const DEFAULT_MODEL = "en_US-kristin-medium";

// Piper binary download URL for Linux x86_64
const PIPER_URL = "https://github.com/rhasspy/piper/releases/download/2023.11.14-2/piper_linux_x86_64.tar.gz";

// Helper to construct Hugging Face download URLs for a given model name
function getModelUrls(modelName) {
    const parts = modelName.split("-");
    if (parts.length < 3) {
        throw new Error(`Invalid model name format: "${modelName}". Expected format like "en_US-kristin-medium".`);
    }
    const locale = parts[0];          // e.g. en_US
    const voiceName = parts[1];       // e.g. kristin
    const quality = parts[2];         // e.g. medium
    const lang = locale.split("_")[0]; // e.g. en

    const onnxUrl = `https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/${lang}/${locale}/${voiceName}/${quality}/${modelName}.onnx`;
    const jsonUrl = `https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/${lang}/${locale}/${voiceName}/${quality}/${modelName}.onnx.json`;

    return { onnxUrl, jsonUrl };
}

async function downloadFile(url, destPath) {
    console.log(`[setup-piper] Downloading ${url} to ${destPath}...`);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to download ${url}: ${response.status} ${response.statusText}`);
        }
        const fileStream = fs.createWriteStream(destPath);
        await pipeline(Readable.fromWeb(response.body), fileStream);
        console.log(`[setup-piper] Successfully downloaded to ${destPath}`);
    } catch (err) {
        console.error(`[setup-piper] Error downloading ${url}:`, err.message);
        throw err;
    }
}

export async function setupPiper() {
    const modelName = process.env.PIPER_MODEL || DEFAULT_MODEL;
    console.log(`[setup-piper] Starting local Piper TTS setup verification for voice: "${modelName}"...`);
    
    // Ensure directories exist
    if (!fs.existsSync(BIN_DIR)) {
        fs.mkdirSync(BIN_DIR, { recursive: true });
    }
    if (!fs.existsSync(MODELS_DIR)) {
        fs.mkdirSync(MODELS_DIR, { recursive: true });
    }

    const piperExecutable = path.join(BIN_DIR, "piper", "piper");

    // 1. Download & extract Piper if not exists
    if (!fs.existsSync(piperExecutable)) {
        console.log("[setup-piper] Piper executable not found. Starting download...");
        const tarPath = path.join(BIN_DIR, "piper.tar.gz");
        
        try {
            await downloadFile(PIPER_URL, tarPath);
            
            console.log("[setup-piper] Extracting Piper tarball...");
            execSync(`tar -xzf "${tarPath}" -C "${BIN_DIR}"`);
            console.log("[setup-piper] Extraction completed successfully.");
            
            // Cleanup tarball
            fs.unlinkSync(tarPath);
        } catch (err) {
            console.error("[setup-piper] Failed to download or extract Piper:", err.message);
            if (fs.existsSync(tarPath)) fs.unlinkSync(tarPath);
            throw err;
        }
    } else {
        console.log("[setup-piper] Piper executable verified.");
    }

    // Ensure piper has execute permissions
    if (fs.existsSync(piperExecutable)) {
        fs.chmodSync(piperExecutable, 0o755);
    }

    // 2. Resolve Hugging Face URLs for the chosen voice model
    const { onnxUrl, jsonUrl } = getModelUrls(modelName);
    const modelOnnxPath = path.join(MODELS_DIR, `${modelName}.onnx`);
    const modelJsonPath = path.join(MODELS_DIR, `${modelName}.onnx.json`);

    // Download voice files if they do not exist
    if (!fs.existsSync(modelOnnxPath)) {
        console.log(`[setup-piper] Voice model ONNX file not found for "${modelName}". Starting download...`);
        await downloadFile(onnxUrl, modelOnnxPath);
    } else {
        console.log(`[setup-piper] Voice model ONNX file verified for "${modelName}".`);
    }

    if (!fs.existsSync(modelJsonPath)) {
        console.log(`[setup-piper] Voice model JSON config not found for "${modelName}". Starting download...`);
        await downloadFile(jsonUrl, modelJsonPath);
    } else {
        console.log(`[setup-piper] Voice model JSON config verified for "${modelName}".`);
    }

    console.log(`[setup-piper] Piper TTS engine setup completed successfully for voice "${modelName}".`);
    return {
        piperExecutable,
        modelOnnxPath
    };
}

// Support running directly from CLI
const runDirectly = process.argv[1] && (
    process.argv[1] === fileURLToPath(import.meta.url) || 
    process.argv[1].endsWith("setupPiper.js")
);

if (runDirectly) {
    setupPiper()
        .then(() => process.exit(0))
        .catch((err) => {
            console.error("[setup-piper] Direct CLI execution failed:", err);
            process.exit(1);
        });
}
