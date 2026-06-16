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
    }
  }
);

const Session = mongoose.model("Session", sessionSchema);

export default Session;
