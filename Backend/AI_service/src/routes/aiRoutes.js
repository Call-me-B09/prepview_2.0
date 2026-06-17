import express from   "express";

import generatequestions from "../controller/generatequestionscontroller.js";
import generatefollowup from "../controller/generatefollowupcontroller.js";
import evaluatequestion from "../controller/evaluatequestioncontroller.js";
const router=express.Router();


router.post("/generateQuestions",generatequestions);
router.post("/generateFollowUp",generatefollowup);
router.post("/evaluateQuestion",evaluatequestion);
 

export default router;