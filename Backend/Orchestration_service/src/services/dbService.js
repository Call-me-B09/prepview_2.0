import { ensureServiceAwake } from "../utils/serviceHelper.js";

export async function createSession(uid, role) {
    console.log(`[Orchestration Service] [DB Service] Calling createSession for uid: "${uid}", role: "${role}"`);
    await ensureServiceAwake(process.env.DB_SERVICE_URL);
    const dbUrl = `${process.env.DB_SERVICE_URL}/db/createSession`;

    const response = await fetch(dbUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ uid, role })
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`[Orchestration Service] [DB Service] createSession failed with status ${response.status}: ${errorText}`);
        throw new Error(`DB service createSession failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    if (!data.sessionId) {
        console.error("[Orchestration Service] [DB Service] createSession response did not contain sessionId");
        throw new Error("DB service did not return a sessionId");
    }

    console.log(`[Orchestration Service] [DB Service] createSession successful. Session ID: ${data.sessionId}`);
    return data.sessionId;
}

export async function saveQuestion(sessionId, mainQuestion) {
    console.log(`[Orchestration Service] [DB Service] Calling saveQuestion for Session: ${sessionId}, Question: "${mainQuestion.substring(0, 50)}..."`);
    await ensureServiceAwake(process.env.DB_SERVICE_URL);
    const dbUrl = `${process.env.DB_SERVICE_URL}/db/createQuestion`;

    const response = await fetch(dbUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            sessionId,
            mainQuestion,
            followUpQuestion: "Pending..."
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`[Orchestration Service] [DB Service] saveQuestion failed with status ${response.status}: ${errorText}`);
        throw new Error(`DB service createQuestion failed with status ${response.status}: ${errorText}`);
    }

    const question = await response.json();
    console.log(`[Orchestration Service] [DB Service] saveQuestion successful. Saved Question ID: ${question._id}`);
    return question;
}

export async function getQuestion(questionId) {
    console.log(`[Orchestration Service] [DB Service] Calling getQuestion for ID: ${questionId}`);
    await ensureServiceAwake(process.env.DB_SERVICE_URL);
    const dbUrl = `${process.env.DB_SERVICE_URL}/db/getQuestion/${questionId}`;

    const response = await fetch(dbUrl, {
        method: "GET"
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`[Orchestration Service] [DB Service] getQuestion failed with status ${response.status}: ${errorText}`);
        throw new Error(`DB service getQuestion failed with status ${response.status}: ${errorText}`);
    }

    const question = await response.json();
    console.log(`[Orchestration Service] [DB Service] getQuestion successful for ID: ${questionId}`);
    return question;
}

export async function updateQuestion(questionId, updateData) {
    console.log(`[Orchestration Service] [DB Service] Calling updateQuestion for ID: ${questionId}`);
    await ensureServiceAwake(process.env.DB_SERVICE_URL);
    const dbUrl = `${process.env.DB_SERVICE_URL}/db/updateQuestion/${questionId}`;

    const response = await fetch(dbUrl, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updateData)
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`[Orchestration Service] [DB Service] updateQuestion failed with status ${response.status}: ${errorText}`);
        throw new Error(`DB service updateQuestion failed with status ${response.status}: ${errorText}`);
    }

    const updated = await response.json();
    console.log(`[Orchestration Service] [DB Service] updateQuestion successful for ID: ${questionId}`);
    return updated;
}

export async function getSession(sessionId) {
    console.log(`[Orchestration Service] [DB Service] Calling getSession for ID: ${sessionId}`);
    await ensureServiceAwake(process.env.DB_SERVICE_URL);
    const dbUrl = `${process.env.DB_SERVICE_URL}/db/getSession/${sessionId}`;

    const response = await fetch(dbUrl, {
        method: "GET"
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`[Orchestration Service] [DB Service] getSession failed with status ${response.status}: ${errorText}`);
        throw new Error(`DB service getSession failed with status ${response.status}: ${errorText}`);
    }

    const session = await response.json();
    console.log(`[Orchestration Service] [DB Service] getSession successful for ID: ${sessionId}`);
    return session;
}

export async function getQuestionsForSession(sessionId) {
    console.log(`[Orchestration Service] [DB Service] Calling getQuestionsForSession for Session: ${sessionId}`);
    await ensureServiceAwake(process.env.DB_SERVICE_URL);
    const dbUrl = `${process.env.DB_SERVICE_URL}/db/getQuestions/${sessionId}`;

    const response = await fetch(dbUrl, {
        method: "GET"
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`[Orchestration Service] [DB Service] getQuestionsForSession failed with status ${response.status}: ${errorText}`);
        throw new Error(`DB service getQuestions failed with status ${response.status}: ${errorText}`);
    }

    const questions = await response.json();
    console.log(`[Orchestration Service] [DB Service] getQuestionsForSession returned ${questions.length} questions`);
    return questions;
}

export async function updateSession(sessionId, overallScore, recommendations) {
    console.log(`[Orchestration Service] [DB Service] Calling updateSession for Session: ${sessionId}, Score: ${overallScore}`);
    await ensureServiceAwake(process.env.DB_SERVICE_URL);
    const dbUrl = `${process.env.DB_SERVICE_URL}/db/updateSession/${sessionId}`;

    const response = await fetch(dbUrl, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ overallScore, recommendations })
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`[Orchestration Service] [DB Service] updateSession failed with status ${response.status}: ${errorText}`);
        throw new Error(`DB service updateSession failed with status ${response.status}: ${errorText}`);
    }

    const session = await response.json();
    console.log(`[Orchestration Service] [DB Service] updateSession completed successfully for ID: ${sessionId}`);
    return session;
}

export async function updateQuestionEvaluation(questionId, evaluationData) {
    console.log(`[Orchestration Service] [DB Service] Calling updateQuestionEvaluation for Question: ${questionId}`);
    await ensureServiceAwake(process.env.DB_SERVICE_URL);
    const dbUrl = `${process.env.DB_SERVICE_URL}/db/updateQuestionEvaluation/${questionId}`;

    const response = await fetch(dbUrl, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(evaluationData)
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`[Orchestration Service] [DB Service] updateQuestionEvaluation failed with status ${response.status}: ${errorText}`);
        throw new Error(`DB service updateQuestionEvaluation failed with status ${response.status}: ${errorText}`);
    }

    const updated = await response.json();
    console.log(`[Orchestration Service] [DB Service] updateQuestionEvaluation completed successfully for ID: ${questionId}`);
    return updated;
}

export async function updateSessionFields(sessionId, fields) {
    console.log(`[Orchestration Service] [DB Service] Calling updateSessionFields for Session: ${sessionId}`);
    await ensureServiceAwake(process.env.DB_SERVICE_URL);
    const dbUrl = `${process.env.DB_SERVICE_URL}/db/updateSession/${sessionId}`;

    const response = await fetch(dbUrl, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(fields)
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`[Orchestration Service] [DB Service] updateSessionFields failed with status ${response.status}: ${errorText}`);
        throw new Error(`DB service updateSessionFields failed with status ${response.status}: ${errorText}`);
    }

    const updated = await response.json();
    console.log(`[Orchestration Service] [DB Service] updateSessionFields completed successfully for ID: ${sessionId}`);
    return updated;
}
