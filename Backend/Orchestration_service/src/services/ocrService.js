import { ensureServiceAwake } from "../utils/serviceHelper.js";

export async function extractResumeText(file) {
    await ensureServiceAwake(process.env.OCR_SERVICE_URL);
    const ocrUrl = `${process.env.OCR_SERVICE_URL}/ocr/upload`;
    
    const formData = new FormData();
    const blob = new Blob([file.buffer], { type: file.mimetype });
    formData.append("pdf", blob, file.originalname);

    const response = await fetch(ocrUrl, {
        method: "POST",
        body: formData
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OCR service failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    if (!data.success || !data.text) {
        throw new Error("OCR service response did not contain extracted text");
    }

    return data.text;
}
