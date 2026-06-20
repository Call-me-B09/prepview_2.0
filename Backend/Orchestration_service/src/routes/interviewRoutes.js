import express from "express";
import multer from "multer";
import startInterview from "../controllers/startInterview.js";
import submitMainAnswer from "../controllers/submitMainAnswer.js";
import finishSession from "../controllers/finishSession.js";
import ttsController from "../controllers/ttsController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/interview", upload.single("resume"), startInterview);
router.post("/submitMainAnswer", upload.single("audio"), submitMainAnswer);
router.post("/finishSession", finishSession);
router.post("/tts", ttsController);

export default router;
