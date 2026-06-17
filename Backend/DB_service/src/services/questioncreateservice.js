import Questionmodel from "../models/questionmodel.js";

async function CreateQuestionService(sessionId, mainQuestion, followUpQuestion) {
    const question = await Questionmodel.create({
        sessionId,
        mainQuestion,
        followUpQuestion
    });
    return question;
}

export default CreateQuestionService;
