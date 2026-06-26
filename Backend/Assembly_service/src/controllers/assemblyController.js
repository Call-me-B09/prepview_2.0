import { transcribeAudio } from "../services/assemblyService.js";

export const uploadAudio = async (req, res) => {
  try {
    console.log("[Assembly Controller] Request received for speech-to-text transcription");
    
    if (!req.file) {
      console.warn("[Assembly Controller] Warning: Request is missing audio file file");
      return res.status(400).json({
        success: false,
        error: "Audio file is required under the key 'audio'"
      });
    }

    console.log(`[Assembly Controller] Audio file details: Name: "${req.file.originalname}", Size: ${req.file.size} bytes, MIME: "${req.file.mimetype}"`);
    
    console.log("[Assembly Controller] Sending audio buffer to AssemblyAI API for transcription...");
    const transcription = await transcribeAudio(req.file.buffer);
    console.log(`[Assembly Controller] Transcription completed successfully. Length: ${transcription ? transcription.length : 0} characters. Text: "${transcription}"`);

    res.status(200).json({
      success: true,
      transcription: transcription,
    });
  } catch (error) {
    console.error("[Assembly Controller] Error during transcription process:", error.message);
    res.status(500).json({
      success: false,
      error: error.message || "Internal server error during transcription",
    });
  }
};
