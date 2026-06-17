import express from   "express";

import generatequestions from "../controller/generatequestionscontroller.js";
import generatefollowup from "../controller/generatefollowupcontroller.js";
const router=express.Router();


router.post("/generateQuestions",generatequestions);
router.post("/generateFollowUp",generatefollowup);
 

export default router;