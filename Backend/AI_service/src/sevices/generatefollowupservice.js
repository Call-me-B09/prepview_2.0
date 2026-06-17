async function GenerateFollowUpService(mainQuestion, mainAnswer) {
    const groqKey = process.env.groq_api;
    if (!groqKey) {
        throw new Error("groq_api key is not configured in environment variables.");
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${groqKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: "You are an expert interviewer. Your task is to generate one single follow-up technical interview question based on the main question and the candidate's answer. To make the follow-up question feel highly personalized, conversational, and direct, you must actively reference their specific answer using natural conversational phrases (e.g., 'You mentioned that...', 'Since you noted that...', 'Based on your response...', etc.). The question should probe deeper into their answer, challenge any gaps, or explore relevant trade-offs. Return the output strictly as a JSON object matching this schema:\n{\n  \"followUpQuestion\": \"string\"\n}"
                },
                {
                    role: "user",
                    content: `Main Question: ${mainQuestion}\nCandidate's Answer: ${mainAnswer}`
                }
            ],
            response_format: { type: "json_object" }
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Groq API returned status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const parsed = JSON.parse(content);
    
    if (!parsed || typeof parsed.followUpQuestion !== "string") {
        throw new Error("Invalid response format received from Groq API.");
    }

    return parsed.followUpQuestion;
}

export default GenerateFollowUpService;
