import Sessionmodel from "../models/sessionmodel.js";

async function UpdateSessionService(sessionId, updates) {
    const updateObj = { ...updates };
    if (updates.overallScore !== undefined) {
        updateObj.status = "completed";
    }

    const session = await Sessionmodel.findByIdAndUpdate(
        sessionId,
        updateObj,
        { new: true }
    );
    return session;
}

export default UpdateSessionService;
