import { ensureServiceAwake } from "../utils/serviceHelper.js";

export async function transcribeAudio(file) {
    await ensureServiceAwake(process.env.ASSEMBLY_SERVICE_URL);
    const assemblyUrl = `${process.env.ASSEMBLY_SERVICE_URL}/api/transcribe`;
    
    const formData = new FormData();
    const blob = new Blob([file.buffer], { type: file.mimetype });
    formData.append("audio", blob, file.originalname);

    const response = await fetch(assemblyUrl, {
        method: "POST",
        body: formData
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Assembly service failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    if (!data.success || !data.transcription) {
        throw new Error("Assembly service response did not contain transcription");
    }

    return data.transcription;
}
