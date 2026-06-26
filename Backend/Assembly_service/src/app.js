import express from "express";
import cors from "cors";
import assemblyRoutes from "./routes/assemblyRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Global Logging Middleware
app.use((req, res, next) => {
    const start = Date.now();
    console.log(`[Assembly Service] [HTTP] Incoming Request: ${req.method} ${req.url}`);
    res.on("finish", () => {
        const duration = Date.now() - start;
        console.log(`[Assembly Service] [HTTP] Response: ${req.method} ${req.url} - Status: ${res.statusCode} - Duration: ${duration}ms`);
    });
    next();
});

app.get("/health", (req, res) => {
    res.status(200).json({ status: "UP" });
});

app.get("/", (req, res) => {
    res.status(200).json({ status: "UP" });
});

app.use("/api", assemblyRoutes);

export default app;
