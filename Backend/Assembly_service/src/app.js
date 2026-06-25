import express from "express";
import cors from "cors";
import assemblyRoutes from "./routes/assemblyRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
    res.status(200).json({ status: "UP" });
});

app.get("/", (req, res) => {
    res.status(200).json({ status: "UP" });
});

app.use("/api", assemblyRoutes);

export default app;
