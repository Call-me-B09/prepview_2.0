async function EvaluateCodingService(codingProblem, codingLanguage, codingSolution) {
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
                    content: "You are an expert technical interviewer and code reviewer. Your task is to evaluate the candidate's coding solution (which may be written in programming languages or as pseudo-code). Analyze code correctness, logic accuracy, potential bugs, time complexity, and code quality. Do not compile the code; review it conceptually. Provide a score from 0 to 100, and a concise professional feedback review text. Return the output strictly as a JSON object matching this schema:\n{\n  \"score\": 0,\n  \"feedback\": \"string\"\n}"
                },
                {
                    role: "user",
                    content: `Problem: ${codingProblem}\nSelected Language: ${codingLanguage}\nCandidate's Solution:\n${codingSolution}`
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

export default EvaluateCodingService;
