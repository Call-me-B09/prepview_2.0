import Questionmodel from "../models/questionmodel.js";

async function QuestionGetByIdService(questionId) {
    const question = await Questionmodel.findById(questionId);
    return question;
}

export default QuestionGetByIdService;
