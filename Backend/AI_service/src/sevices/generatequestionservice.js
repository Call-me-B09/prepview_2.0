async function GenerateQuestionService(role, resumeText) {
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
                    content: "You are an expert interviewer. Your task is to generate exactly 5 main technical interview questions based on the candidate's target job role and resume content. Do not generate follow-up questions or extra explanations. Return the output strictly as a JSON object matching this schema:\n{\n  \"questions\": [\n    \"string\"\n  ]\n}"
                },
                {
                    role: "user",
                    content: `Job Role: ${role}\nResume Content:\n${resumeText}`
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
    
    if (!parsed || !Array.isArray(parsed.questions)) {
        throw new Error("Invalid response format received from Groq API.");
    }

    return parsed.questions;
}

export default GenerateQuestionService;
