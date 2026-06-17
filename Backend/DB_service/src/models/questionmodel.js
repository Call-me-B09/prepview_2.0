import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true
    },
    mainQuestion: {
      type: String,
      required: true
    },
    followUpQuestion: {
      type: String,
      required: true
    },
    mainAnswer: {
      type: String
    },
    followUpAnswer: {
      type: String
    },
    mainQuestionScore: {
      type: Number
    },
    mainQuestionFeedback: {
      type: String
    },
    followUpScore: {
      type: Number
    },
    followUpFeedback: {
      type: String
    },
    overallScore: {
      type: Number
    }
  }
);

const Question = mongoose.model("Question", questionSchema);

export default Question;
