import { ensureServiceAwake } from "../utils/serviceHelper.js";

export async function transcribeAudio(file) {
    console.log(`[Orchestration Service] [Assembly Service] Calling transcribeAudio. File name: "${file.originalname}", Size: ${file.size} bytes, MIME type: "${file.mimetype}"`);
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
        console.error(`[Orchestration Service] [Assembly Service] Transcribe failed with status ${response.status}: ${errorText}`);
        throw new Error(`Assembly service failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    if (!data.success || !data.transcription) {
        console.error("[Orchestration Service] [Assembly Service] Response did not contain transcription");
        throw new Error("Assembly service response did not contain transcription");
    }

    console.log(`[Orchestration Service] [Assembly Service] Transcribe completed successfully. Result text: "${data.transcription.substring(0, 60)}..."`);
    return data.transcription;
}
