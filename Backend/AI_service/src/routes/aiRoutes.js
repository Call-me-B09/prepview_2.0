import express from   "express";

import generatequestions from "../controller/generatequestionscontroller.js";
import generatefollowup from "../controller/generatefollowupcontroller.js";
import evaluatequestion from "../controller/evaluatequestioncontroller.js";
import evaluatesession from "../controller/evaluatesessioncontroller.js";
import generatecodingquestion from "../controller/generatecodingquestioncontroller.js";
import evaluatecoding from "../controller/evaluatecodingcontroller.js";
const router=express.Router();


router.post("/generateQuestions",generatequestions);
router.post("/generateFollowUp",generatefollowup);
router.post("/evaluateQuestion",evaluatequestion);
router.post("/evaluateSession",evaluatesession);
router.post("/generateCodingQuestion",generatecodingquestion);
router.post("/evaluateCoding",evaluatecoding);
 

export default router;