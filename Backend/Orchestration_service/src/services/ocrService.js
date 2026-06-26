import { ensureServiceAwake } from "../utils/serviceHelper.js";

export async function extractResumeText(file) {
    console.log(`[Orchestration Service] [OCR Service] Calling extractResumeText. File: "${file.originalname}", Size: ${file.size} bytes, MIME: "${file.mimetype}"`);
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
        console.error(`[Orchestration Service] [OCR Service] OCR failed with status ${response.status}: ${errorText}`);
        throw new Error(`OCR service failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    if (!data.success || !data.text) {
        console.error("[Orchestration Service] [OCR Service] OCR response did not contain extracted text");
        throw new Error("OCR service response did not contain extracted text");
    }

    console.log(`[Orchestration Service] [OCR Service] OCR completed successfully. Extracted text length: ${data.text.length} characters`);
    return data.text;
}
