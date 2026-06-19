import Questionmodel from "../models/questionmodel.js";

async function QuestionUpdateService(questionId, updateData) {
    const question = await Questionmodel.findByIdAndUpdate(
        questionId,
        updateData,
        { new: true }
    );
    return question;
}

export default QuestionUpdateService;
