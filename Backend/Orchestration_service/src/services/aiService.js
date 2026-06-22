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

export async function generateFollowUp(mainQuestion, mainAnswer) {
    const aiUrl = `${process.env.AI_SERVICE_URL}/ai/generateFollowUp`;

    const response = await fetch(aiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ mainQuestion, mainAnswer })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`AI service generateFollowUp failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    if (!data.followUpQuestion) {
        throw new Error("AI service response did not contain followUpQuestion");
    }

    return data.followUpQuestion;
}

export async function evaluateQuestion(mainQuestion, mainAnswer, followUpQuestion, followUpAnswer) {
    const aiUrl = `${process.env.AI_SERVICE_URL}/ai/evaluateQuestion`;

    const response = await fetch(aiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ mainQuestion, mainAnswer, followUpQuestion, followUpAnswer })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`AI service evaluateQuestion failed with status ${response.status}: ${errorText}`);
    }

    return await response.json();
}

export async function evaluateSession(questions, role, codingData) {
    const aiUrl = `${process.env.AI_SERVICE_URL}/ai/evaluateSession`;

    const response = await fetch(aiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ questions, role, codingData })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`AI service evaluateSession failed with status ${response.status}: ${errorText}`);
    }

    return await response.json();
}

export async function generateCodingQuestion(role) {
    const aiUrl = `${process.env.AI_SERVICE_URL}/ai/generateCodingQuestion`;

    const response = await fetch(aiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ role })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`AI service generateCodingQuestion failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data.codingQuestion;
}

export async function evaluateCoding(codingProblem, codingLanguage, codingSolution) {
    const aiUrl = `${process.env.AI_SERVICE_URL}/ai/evaluateCoding`;

    const response = await fetch(aiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ codingProblem, codingLanguage, codingSolution })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`AI service evaluateCoding failed with status ${response.status}: ${errorText}`);
    }

    return await response.json();
}

