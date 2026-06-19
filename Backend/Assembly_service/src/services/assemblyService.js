import { AssemblyAI } from "assemblyai";

const client = new AssemblyAI({
  apiKey: process.env.Assembly_api,
});

export const transcribeAudio = async (audioBuffer) => {
  try {
    console.log("Sending audio buffer to AssemblyAI...");
    
    const transcript = await client.transcripts.transcribe({
      audio: audioBuffer,
    });

    if (transcript.status === "error") {
      throw new Error(`AssemblyAI error: ${transcript.error}`);
    }

    return transcript.text;
  } catch (error) {
    console.error("Error in Assembly service transcribeAudio:", error.message);
    throw error;
  }
};
