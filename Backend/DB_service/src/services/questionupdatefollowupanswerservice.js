import Questionmodel from "../models/questionmodel.js";

async function QuestionUpdateFollowUpAnswerService(questionId, followUpAnswer) {
    const question = await Questionmodel.findByIdAndUpdate(
        questionId,
        { followUpAnswer },
        { new: true }
    );
    return question;
}

export default QuestionUpdateFollowUpAnswerService;
