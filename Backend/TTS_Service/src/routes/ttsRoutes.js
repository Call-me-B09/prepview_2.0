import express from "express";
import { getSpeech, getVoices } from "../controllers/ttsController.js";

const router = express.Router();

router.post("/", getSpeech);
router.get("/voices", getVoices);

export default router;
