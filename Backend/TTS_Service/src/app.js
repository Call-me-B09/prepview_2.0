import express from "express";
import cors from "cors";
import ttsRoutes from "./routes/ttsRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/tts", ttsRoutes);

export default app;
