import express from "express";
import DBroutes from "./routes/DBroutes.js";
import connectDB from "../config/mongoconfig.js";



const app= express();

connectDB();

// Custom CORS Middleware to handle cross-origin preflight requests without requiring external npm packages
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// Global Logging Middleware
app.use((req, res, next) => {
    const start = Date.now();
    console.log(`[DB Service] [HTTP] Incoming Request: ${req.method} ${req.url}`);
    res.on("finish", () => {
        const duration = Date.now() - start;
        console.log(`[DB Service] [HTTP] Response: ${req.method} ${req.url} - Status: ${res.statusCode} - Duration: ${duration}ms`);
    });
    next();
});

app.get("/health", (req, res) => {
    res.status(200).json({ status: "UP" });
});

app.get("/", (req, res) => {
    res.status(200).json({ status: "UP" });
});

app.use("/db",DBroutes);

export default app