import { transcribeAudio } from "../services/assemblyService.js";

export const uploadAudio = async (req, res) => {
  try {
    console.log("Assembly Controller: Request received");
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Audio file is required under the key 'audio'"
      });
    }

    console.log(`Received file: ${req.file.originalname}, Size: ${req.file.size} bytes`);
    
    const transcription = await transcribeAudio(req.file.buffer);

    res.status(200).json({
      success: true,
      transcription: transcription,
    });
  } catch (error) {
    console.error("Error in uploadAudio controller:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Internal server error during transcription",
    });
  }
};
