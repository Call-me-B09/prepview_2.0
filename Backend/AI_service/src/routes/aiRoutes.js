import express from   "express";

import generatequestions from "../controller/generatequestionscontroller.js";
const router=express.Router();


router.post("/generateQuestions",generatequestions);
 

export default router;