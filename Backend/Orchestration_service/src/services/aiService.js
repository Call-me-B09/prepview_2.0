export async function generateQuestions(role, resumeText) {
    const aiUrl = `${process.env.AI_SERVICE_URL}/ai/generateQuestions`;

    const response = await fetch(aiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ role, resumeText })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`AI service generateQuestions failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    if (!data.questions || !Array.isArray(data.questions)) {
        throw new Error("AI service response did not contain questions array");
    }

    return data.questions;
}
