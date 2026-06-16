import express from "express";
import saveuser from "../controllers/saveuser.js";
import getuser from "../controllers/getuser.js";
import createsession from "../controllers/createsession.js";
import getusersessions from "../controllers/getusersessions.js";
import getsessionbyid from "../controllers/getsessionbyid.js";
import updatesession from "../controllers/updatesession.js";



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

export default router;