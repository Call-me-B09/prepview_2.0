import express from "express";
import multer from "multer";
import startInterview from "../controllers/startInterview.js";
import submitMainAnswer from "../controllers/submitMainAnswer.js";
import submitFollowUpAnswer from "../controllers/submitFollowUpAnswer.js";
import finishSession from "../controllers/finishSession.js";
import submitCodingAnswer from "../controllers/submitCodingAnswer.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/interview", upload.single("resume"), startInterview);
router.post("/submitMainAnswer", upload.single("audio"), submitMainAnswer);
router.post("/submitFollowUpAnswer", upload.single("audio"), submitFollowUpAnswer);
router.post("/finishSession", finishSession);
router.post("/submitCodingAnswer", submitCodingAnswer);

export default router;
