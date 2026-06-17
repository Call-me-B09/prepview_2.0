async function EvaluateQuestionService(mainQuestion, mainAnswer, followUpQuestion, followUpAnswer) {
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
                    content: "You are an expert technical interviewer and evaluator. Your task is to evaluate a candidate's response to a main question and a follow-up question. Grade the responses based on technical accuracy, clarity, and completeness. In the feedback fields ('mainfeedback' and 'followupfeedback'), you must address the candidate directly using second-person pronouns (e.g., 'you', 'your', 'your answer') instead of third-person references (do NOT use 'the candidate' or 'their response'). The tone should be constructive and feel personalized. Return the evaluation results strictly as a JSON object matching this schema:\n{\n  \"mainScore\": 8,\n  \"followUpScore\": 7,\n  \"overallScore\": 7.5,\n  \"mainfeedback\": \"string\",\n  \"followupfeedback\": \"string\"\n}"
                },
                {
                    role: "user",
                    content: `Main Question: ${mainQuestion}\nCandidate's Main Answer: ${mainAnswer}\n\nFollow-up Question: ${followUpQuestion}\nCandidate's Follow-up Answer: ${followUpAnswer}`
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

    return {
        mainScore: Number(parsed.mainScore !== undefined ? parsed.mainScore : parsed.mainscore),
        followUpScore: Number(parsed.followUpScore !== undefined ? parsed.followUpScore : parsed.followupscore),
        overallScore: Number(parsed.overallScore !== undefined ? parsed.overallScore : parsed.overallscore),
        mainfeedback: parsed.mainfeedback || parsed.mainFeedback,
        followupfeedback: parsed.followupfeedback || parsed.followUpFeedback
    };
}

export default EvaluateQuestionService;
