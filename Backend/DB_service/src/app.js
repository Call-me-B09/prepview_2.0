import express from "express";
import DBroutes from "./routes/DBroutes.js";
import connectDB from "../config/mongoconfig.js";



const app= express();

connectDB();


app.use(express.json());
app.use("/db",DBroutes);

export default app