import express from "express";
import { upload } from "../middlewares/multersetup.js";
import { uploadAudio } from "../controllers/assemblyController.js";

const router = express.Router();

router.post("/transcribe", upload.single("audio"), uploadAudio);

export default router;
