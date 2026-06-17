import Usermodel from "../models/usermodel.js";

async function CreateUserService(uid,email){
const user=await Usermodel.create({
    uid,
    email
})

}
export default CreateUserService;