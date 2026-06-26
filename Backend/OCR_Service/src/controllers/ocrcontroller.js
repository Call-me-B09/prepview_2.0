import { extractTextFromPdf } from "../services/ocrservice.js";

export const uploadPdf = async (req, res) => {
  try {
    console.log("[OCR Controller] PDF upload request received");
    if (req.file) {
      console.log(`[OCR Controller] PDF file details: Name: "${req.file.originalname}", Size: ${req.file.size} bytes`);
    } else {
      console.warn("[OCR Controller] Warning: No file received in the request");
    }

    const extractedText = await extractTextFromPdf(req.file.buffer);
    console.log(`[OCR Controller] PDF text extraction successful. Extracted text length: ${extractedText ? extractedText.length : 0} characters`);

    res.status(200).json({
      success: true,
      text: extractedText,
    });
  } catch (error) {
    console.error("[OCR Controller] Error processing PDF text extraction:", error.message);
    if (error.response) {
      console.error(`[OCR Controller] OCR API error details: Status: ${error.response.status}, Data:`, error.response.data);
    }
    throw error;
  }
};