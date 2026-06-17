import express from "express";
import saveuser from "../controllers/saveuser.js";
import getuser from "../controllers/getuser.js";
import createsession from "../controllers/createsession.js";
import getusersessions from "../controllers/getusersessions.js";
import getsessionbyid from "../controllers/getsessionbyid.js";
import updatesession from "../controllers/updatesession.js";
import createquestion from "../controllers/createquestion.js";
import getquestionsbysession from "../controllers/getquestionsbysession.js";
import getquestionbyid from "../controllers/getquestionbyid.js";
import updatequestionanswer from "../controllers/updatequestionanswer.js";
import updatequestionfollowupanswer from "../controllers/updatequestionfollowupanswer.js";
import updatequestionevaluation from "../controllers/updatequestionevaluation.js";



const router= express.Router();

router.post("/saveUser",saveuser);
router.get("/getUser/:uid",getuser);
router.get("/getUser",getuser);
router.post("/createSession",createsession);
router.get("/getSessions/:uid",getusersessions);
router.get("/getSessions",getusersessions);
router.get("/getSession/:sessionId",getsessionbyid);
router.get("/getSession",getsessionbyid);
router.patch("/updateSession/:sessionId",updatesession);
router.patch("/updateSession",updatesession);
router.post("/createQuestion",createquestion);
router.get("/getQuestions/:sessionId",getquestionsbysession);
router.get("/getQuestions",getquestionsbysession);
router.get("/getQuestion/:questionId",getquestionbyid);
router.get("/getQuestion",getquestionbyid);
router.patch("/updateQuestionAnswer/:questionId",updatequestionanswer);
router.patch("/updateQuestionAnswer",updatequestionanswer);
router.patch("/updateQuestionFollowUpAnswer/:questionId",updatequestionfollowupanswer);
router.patch("/updateQuestionFollowUpAnswer",updatequestionfollowupanswer);
router.patch("/updateQuestionEvaluation/:questionId",updatequestionevaluation);
router.patch("/updateQuestionEvaluation",updatequestionevaluation);

export default router;