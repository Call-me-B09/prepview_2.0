import Sessionmodel from "../models/sessionmodel.js";

async function GetSessionByIdService(sessionId) {
    const session = await Sessionmodel.findById(sessionId);
    return session;
}

export default GetSessionByIdService;
