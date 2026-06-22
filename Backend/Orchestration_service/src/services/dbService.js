export async function createSession(uid, role) {
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
        throw new Error(`DB service createSession failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    if (!data.sessionId) {
        throw new Error("DB service did not return a sessionId");
    }

    return data.sessionId;
}

export async function saveQuestion(sessionId, mainQuestion) {
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
        throw new Error(`DB service createQuestion failed with status ${response.status}: ${errorText}`);
    }

    return await response.json();
}

export async function getQuestion(questionId) {
    const dbUrl = `${process.env.DB_SERVICE_URL}/db/getQuestion/${questionId}`;

    const response = await fetch(dbUrl, {
        method: "GET"
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`DB service getQuestion failed with status ${response.status}: ${errorText}`);
    }

    return await response.json();
}

export async function updateQuestion(questionId, updateData) {
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
        throw new Error(`DB service updateQuestion failed with status ${response.status}: ${errorText}`);
    }

    return await response.json();
}

export async function getSession(sessionId) {
    const dbUrl = `${process.env.DB_SERVICE_URL}/db/getSession/${sessionId}`;

    const response = await fetch(dbUrl, {
        method: "GET"
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`DB service getSession failed with status ${response.status}: ${errorText}`);
    }

    return await response.json();
}

export async function getQuestionsForSession(sessionId) {
    const dbUrl = `${process.env.DB_SERVICE_URL}/db/getQuestions/${sessionId}`;

    const response = await fetch(dbUrl, {
        method: "GET"
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`DB service getQuestions failed with status ${response.status}: ${errorText}`);
    }

    return await response.json();
}

export async function updateSession(sessionId, overallScore, recommendations) {
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
        throw new Error(`DB service updateSession failed with status ${response.status}: ${errorText}`);
    }

    return await response.json();
}

export async function updateQuestionEvaluation(questionId, evaluationData) {
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
        throw new Error(`DB service updateQuestionEvaluation failed with status ${response.status}: ${errorText}`);
    }

    return await response.json();
}

export async function updateSessionFields(sessionId, fields) {
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
        throw new Error(`DB service updateSessionFields failed with status ${response.status}: ${errorText}`);
    }

    return await response.json();
}

