import CreateUserService from "../services/usercreateservice.js";



const saveuser=async(req,res)=>{
    try {
        console.log("recived");
        const {uid,email}=req.body;
        
        
        await CreateUserService(uid,email);
        res.status(200).json({message:"User saved successfully"});
        
    } catch (error) {
        console.log(error);
    }


}




export default saveuser;