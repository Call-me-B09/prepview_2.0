import express from "express";
import multer from "multer";
import { startInterview } from "../controllers/interviewController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/interview", upload.single("resume"), startInterview);

export default router;
