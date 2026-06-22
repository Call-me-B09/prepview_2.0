import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true
    },
    status: {
      type: String,
      default: "pending"
    },
    overallScore: {
      type: Number
    },
    recommendations: {
      type: [String],
      default: []
    },
    codingProblemTitle: {
      type: String
    },
    codingProblemDescription: {
      type: String
    },
    codingStarterCode: {
      type: String // Stores JSON string of starter templates per language
    },
    codingLanguage: {
      type: String
    },
    codingSolution: {
      type: String
    },
    codingFeedback: {
      type: String
    },
    codingScore: {
      type: Number
    }
  }
);

const Session = mongoose.model("Session", sessionSchema);

export default Session;
