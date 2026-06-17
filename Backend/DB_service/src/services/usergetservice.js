import Usermodel from "../models/usermodel.js";

async function GetUserService(uid) {
    const user = await Usermodel.findOne({ uid });
    return user;
}

export default GetUserService;
