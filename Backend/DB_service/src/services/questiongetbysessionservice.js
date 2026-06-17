import Questionmodel from "../models/questionmodel.js";

async function QuestionGetBySessionService(sessionId) {
    const questions = await Questionmodel.find({ sessionId });
    return questions;
}

export default QuestionGetBySessionService;
