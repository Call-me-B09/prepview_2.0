import Sessionmodel from "../models/sessionmodel.js";

async function CreateSessionService(uid, role) {
    const session = await Sessionmodel.create({
        uid,
        role
    });
    return session;
}

export default CreateSessionService;
