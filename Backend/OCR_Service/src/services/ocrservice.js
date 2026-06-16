import axios from "axios";
import FormData from "form-data";

export const extractTextFromPdf = async (pdfBuffer) => {
  try {
    const formData = new FormData();

    formData.append("apikey", process.env.OCR_api_key);

    formData.append("file", pdfBuffer, {
      filename: "document.pdf",
      contentType: "application/pdf",
    });

    formData.append("language", "eng");
    console.log("OCR Key:", process.env.OCR_api_key);
    const response = await axios.post(
      "https://api.ocr.space/parse/image",
      formData,
      {
        headers: formData.getHeaders(),
      }
    );

    const parsedResults = response.data.ParsedResults;

    if (!parsedResults || parsedResults.length === 0) {
      throw new Error("No text found in PDF");
    }

    return parsedResults.map((page) => page.ParsedText).join("\n");
  } catch (error) {
    console.error("OCR Service Error:", error.message);
    throw error;
  }
};