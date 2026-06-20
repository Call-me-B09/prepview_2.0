async function EvaluateSessionService(role, questions) {
    const groqKey = process.env.groq_api;
    if (!groqKey) {
        throw new Error("groq_api key is not configured in environment variables.");
    }

    // Format the questions and evaluations context for the LLM prompt
    const formattedHistory = questions.map((q, idx) => {
        return `Question ${idx + 1}: ${q.mainQuestion}
Candidate's Answer: ${q.mainAnswer || "No answer provided"}
Main Question Score: ${q.mainQuestionScore !== undefined ? q.mainQuestionScore : "N/A"}
Main Question Feedback: ${q.mainQuestionFeedback || "N/A"}

Follow-up Question: ${q.followUpQuestion}
Candidate's Follow-up Answer: ${q.followUpAnswer || "No answer provided"}
Follow-up Score: ${q.followUpScore !== undefined ? q.followUpScore : "N/A"}
Follow-up Feedback: ${q.followUpFeedback || "N/A"}

Question Overall Score: ${q.overallScore !== undefined ? q.overallScore : "N/A"}
--------------------------------------------------`;
    }).join("\n\n");

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
                    content: `You are an expert technical recruiter and interviewer. Your task is to evaluate the candidate's overall performance across the entire interview session. 
You will be given the target Job Role and the detailed questions, candidate answers, scores, and feedbacks from the session.
Grade the session as a whole based on technical depth, overall accuracy, communication, and growth areas.
Generate a concise list of actionable recommendations for the candidate to improve.
Return the evaluation results strictly as a JSON object matching this schema:
{
  "overallScore": 7.8,
  "recommendations": [
    "string"
  ]
}`
                },
                {
                    role: "user",
                    content: `Job Role: ${role}\n\nInterview History:\n${formattedHistory}`
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
        overallScore: Number(parsed.overallScore !== undefined ? parsed.overallScore : parsed.overallscore),
        recommendations: parsed.recommendations || []
    };
}

export default EvaluateSessionService;
