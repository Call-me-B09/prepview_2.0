async function GenerateCodingQuestionService(role) {
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
                    content: "You are an expert technical interviewer. Your task is to generate exactly 1 coding/DSA or logic problem suitable for a candidate applying for the target job role. The problem should have a clear title, description (which includes constraints, input/output examples). Do NOT provide any starter code templates. Return the output strictly as a JSON object matching this schema:\n{\n  \"title\": \"string\",\n  \"description\": \"string\"\n}"
                },
                {
                    role: "user",
                    content: `Job Role: ${role}`
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
    return JSON.parse(content);
}

export default GenerateCodingQuestionService;
