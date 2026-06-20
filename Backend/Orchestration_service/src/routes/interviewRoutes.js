import express from "express";
import multer from "multer";
import startInterview from "../controllers/startInterview.js";
import submitMainAnswer from "../controllers/submitMainAnswer.js";
import finishSession from "../controllers/finishSession.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/interview", upload.single("resume"), startInterview);
router.post("/submitMainAnswer", upload.single("audio"), submitMainAnswer);
router.post("/finishSession", finishSession);

export default router;
