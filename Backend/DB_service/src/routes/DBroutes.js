import express from "express";
import saveuser from "../controllers/saveuser.js";



const router= express.Router();

router.post("/saveUser",saveuser);

export default router;