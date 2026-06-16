import Sessionmodel from "../models/sessionmodel.js";

async function GetSessionService(uid) {
    const sessions = await Sessionmodel.find({ uid });
    return sessions;
}

export default GetSessionService;
