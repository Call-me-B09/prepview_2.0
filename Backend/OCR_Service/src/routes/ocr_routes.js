import express from "express";
import { upload } from "../middlewares/multersetup.js";
import { uploadPdf } from "../controllers/ocrcontroller.js";


const router =express.Router();



router.post("/upload",upload.single("pdf"),uploadPdf);

export default router;
