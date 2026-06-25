import express from "express";
import cors from "cors";
import ttsRoutes from "./routes/ttsRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
    res.status(200).json({ status: "UP" });
});

app.get("/", (req, res) => {
    res.status(200).json({ status: "UP" });
});

app.use("/tts", ttsRoutes);

export default app;
