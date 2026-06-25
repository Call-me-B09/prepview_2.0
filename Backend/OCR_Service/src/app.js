import express from "express";  
import ocrroutes from "./routes/ocr_routes.js";  
const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
    res.status(200).json({ status: "UP" });
});

app.get("/", (req, res) => {
    res.status(200).json({ status: "UP" });
});

app.use("/ocr",ocrroutes);

export default app;
