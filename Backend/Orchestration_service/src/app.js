import express from "express";
import cors from "cors";
import interviewRoutes from "./routes/interviewRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api", interviewRoutes);

export default app;
