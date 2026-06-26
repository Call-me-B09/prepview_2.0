import "./config.js";
import app from "./src/app.js";
import { ensureServiceAwake } from "./src/utils/serviceHelper.js";

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Orchestration service is running on port ${PORT}`);

    // Pre-warm downstream services asynchronously on startup (fire-and-forget)
    const services = [
        process.env.OCR_SERVICE_URL,
        process.env.DB_SERVICE_URL,
        process.env.AI_SERVICE_URL,
        process.env.ASSEMBLY_SERVICE_URL,
        process.env.TTS_SERVICE_URL
    ];

    console.log("[Service Alerter] Starting background pre-warming for downstream services...");
    services.forEach(url => {
        if (url) {
            ensureServiceAwake(url).catch(err => {
                console.error(`[Service Alerter] Failed to pre-warm service at ${url}:`, err.message);
            });
        }
    });
});
