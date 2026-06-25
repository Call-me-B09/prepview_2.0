import express from "express";
import aiRoutes from "./routes/aiRoutes.js";
const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
    res.status(200).json({ status: "UP" });
});

app.get("/", (req, res) => {
    res.status(200).json({ status: "UP" });
});

app.use("/ai",aiRoutes)


export default app;