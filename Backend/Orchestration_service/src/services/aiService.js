import { ensureServiceAwake } from "../utils/serviceHelper.js";

export async function generateQuestions(role, resumeText) {
    console.log(`[Orchestration Service] [AI Service] Calling generateQuestions for role: "${role}"`);
    await ensureServiceAwake(process.env.AI_SERVICE_URL);
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
        console.error(`[Orchestration Service] [AI Service] generateQuestions failed with status ${response.status}: ${errorText}`);
        throw new Error(`AI service generateQuestions failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    if (!data.questions || !Array.isArray(data.questions)) {
        console.error("[Orchestration Service] [AI Service] generateQuestions response did not contain questions array");
        throw new Error("AI service response did not contain questions array");
    }

    console.log(`[Orchestration Service] [AI Service] generateQuestions successfully generated ${data.questions.length} questions`);
    return data.questions;
}

export async function generateFollowUp(mainQuestion, mainAnswer) {
    console.log(`[Orchestration Service] [AI Service] Calling generateFollowUp for mainQuestion: "${mainQuestion.substring(0, 60)}..."`);
    await ensureServiceAwake(process.env.AI_SERVICE_URL);
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
        console.error(`[Orchestration Service] [AI Service] generateFollowUp failed with status ${response.status}: ${errorText}`);
        throw new Error(`AI service generateFollowUp failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    if (!data.followUpQuestion) {
        console.error("[Orchestration Service] [AI Service] generateFollowUp response did not contain followUpQuestion");
        throw new Error("AI service response did not contain followUpQuestion");
    }

    console.log(`[Orchestration Service] [AI Service] generateFollowUp successfully generated followUpQuestion: "${data.followUpQuestion.substring(0, 60)}..."`);
    return data.followUpQuestion;
}

export async function evaluateQuestion(mainQuestion, mainAnswer, followUpQuestion, followUpAnswer) {
    console.log(`[Orchestration Service] [AI Service] Calling evaluateQuestion for mainQuestion: "${mainQuestion.substring(0, 60)}..."`);
    await ensureServiceAwake(process.env.AI_SERVICE_URL);
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
        console.error(`[Orchestration Service] [AI Service] evaluateQuestion failed with status ${response.status}: ${errorText}`);
        throw new Error(`AI service evaluateQuestion failed with status ${response.status}: ${errorText}`);
    }

    const evaluation = await response.json();
    console.log(`[Orchestration Service] [AI Service] evaluateQuestion completed successfully. Main Score: ${evaluation.mainScore}, Follow-Up Score: ${evaluation.followUpScore}, Overall: ${evaluation.overallScore}`);
    return evaluation;
}

export async function evaluateSession(questions, role, codingData) {
    console.log(`[Orchestration Service] [AI Service] Calling evaluateSession for role: "${role}" and ${questions.length} questions`);
    await ensureServiceAwake(process.env.AI_SERVICE_URL);
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
        console.error(`[Orchestration Service] [AI Service] evaluateSession failed with status ${response.status}: ${errorText}`);
        throw new Error(`AI service evaluateSession failed with status ${response.status}: ${errorText}`);
    }

    const evaluation = await response.json();
    console.log(`[Orchestration Service] [AI Service] evaluateSession completed successfully. Overall Score: ${evaluation.overallScore}`);
    return evaluation;
}

export async function generateCodingQuestion(role) {
    console.log(`[Orchestration Service] [AI Service] Calling generateCodingQuestion for role: "${role}"`);
    await ensureServiceAwake(process.env.AI_SERVICE_URL);
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
        console.error(`[Orchestration Service] [AI Service] generateCodingQuestion failed with status ${response.status}: ${errorText}`);
        throw new Error(`AI service generateCodingQuestion failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log(`[Orchestration Service] [AI Service] generateCodingQuestion completed successfully. Title: "${data.codingQuestion ? data.codingQuestion.title : "None"}"`);
    return data.codingQuestion;
}

export async function evaluateCoding(codingProblem, codingLanguage, codingSolution) {
    console.log(`[Orchestration Service] [AI Service] Calling evaluateCoding for language: "${codingLanguage}"`);
    await ensureServiceAwake(process.env.AI_SERVICE_URL);
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
        console.error(`[Orchestration Service] [AI Service] evaluateCoding failed with status ${response.status}: ${errorText}`);
        throw new Error(`AI service evaluateCoding failed with status ${response.status}: ${errorText}`);
    }

    const evaluation = await response.json();
    console.log(`[Orchestration Service] [AI Service] evaluateCoding completed successfully. Score: ${evaluation.score}`);
    return evaluation;
}
