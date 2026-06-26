import express from "express";  
import ocrroutes from "./routes/ocr_routes.js";  
const app = express();

app.use(express.json());

// Global Logging Middleware
app.use((req, res, next) => {
    const start = Date.now();
    console.log(`[OCR Service] [HTTP] Incoming Request: ${req.method} ${req.url}`);
    res.on("finish", () => {
        const duration = Date.now() - start;
        console.log(`[OCR Service] [HTTP] Response: ${req.method} ${req.url} - Status: ${res.statusCode} - Duration: ${duration}ms`);
    });
    next();
});

app.get("/health", (req, res) => {
    res.status(200).json({ status: "UP" });
});

app.get("/", (req, res) => {
    res.status(200).json({ status: "UP" });
});

app.use("/ocr",ocrroutes);

export default app;
