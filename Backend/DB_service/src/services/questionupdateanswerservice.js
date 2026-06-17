import Questionmodel from "../models/questionmodel.js";

async function QuestionUpdateAnswerService(questionId, mainAnswer) {
    const question = await Questionmodel.findByIdAndUpdate(
        questionId,
        { mainAnswer },
        { new: true }
    );
    return question;
}

export default QuestionUpdateAnswerService;
