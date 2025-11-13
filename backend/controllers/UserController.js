import UserService from "../services/UserService.js";


export const register = async(req,res) =>{
    
    try {

        const user = await UserService.signup(req.body);
        res.status(201).json(user)
        
    } catch (error) {

        res.status(400).json({message : error.message})
        
    };
}

export const otpVerify = async(req,res) =>{

    try {

        const {email , otp} = req.body
        console.log(email,otp)
        const result = await UserService.verifyOtp(email,otp);

        res.status(200).json(result)
        
    } catch (error) {

        res.status(400).json({message:error.message})
        
    }
}





export const login = async(req,res)=>{
    try {

        const {userEmail , password} = req.body;

        const data = await UserService.login(userEmail,password);

        res.status(200).json(data);

        
    } catch (error) {

         res.status(400).json({ message: error.message });
        
    }
}