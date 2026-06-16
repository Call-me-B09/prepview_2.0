import express from "express";  
import ocrroutes from "./routes/ocr_routes.js";  
const app = express();

app.use(express.json());


app.use("/ocr",ocrroutes);

export default app;
