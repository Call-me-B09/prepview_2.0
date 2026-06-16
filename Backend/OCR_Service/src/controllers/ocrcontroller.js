import { extractTextFromPdf } from "../services/ocrservice.js";

export const uploadPdf = async (req, res) => {
  try {
    console.log("req recived");
    console.log("req.file =", req.file);
console.log("req.body =", req.body);
    const extractedText = await extractTextFromPdf(
      req.file.buffer
    );

    res.status(200).json({
      success: true,
      text: extractedText,
    });
  } catch (error) {
  console.log("Status:", error.response?.status);
  console.log("Data:", error.response?.data);

  throw error;
}
};