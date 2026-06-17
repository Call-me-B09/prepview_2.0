import Questionmodel from "../models/questionmodel.js";

async function QuestionUpdateEvaluationService(questionId, evaluationData) {
    const question = await Questionmodel.findByIdAndUpdate(
        questionId,
        evaluationData,
        { new: true }
    );
    return question;
}

export default QuestionUpdateEvaluationService;
