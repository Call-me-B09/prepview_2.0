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
