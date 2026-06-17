import Sessionmodel from "../models/sessionmodel.js";

async function UpdateSessionService(sessionId, overallScore, recommendations) {
    const session = await Sessionmodel.findByIdAndUpdate(
        sessionId,
        {
            status: "completed",
            overallScore,
            recommendations
        },
        { new: true }
    );
    return session;
}

export default UpdateSessionService;
