import UserService from "../services/UserService.js";
import dotenv from 'dotenv'

dotenv.config({path:"../.env"})


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
        const result = await UserService.verifyOtp(email,otp);

        res.status(200).json(result)
        
    } catch (error) {

        res.status(400).json({message:error.message})
        
    }
}


export const resendOtp = async(req,res)=>{
    try {

        const {email} = req.body;
        const result = await UserService.resendOtp(email)

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


export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const response = await UserService.forgotPassword(email);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const verifyPasswordOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const response = await UserService.verifyPasswordOtp(email, otp);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const response = await UserService.resetPassword(email, newPassword);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const googleCallbackController = async (req, res) => {
  try {
    const {token , user} = await UserService.googleLoginService(req.user);

    return res.redirect(
      `${process.env.FRONTEND_URL}/google-success?token=${token}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}`
    );
  } catch (err) {
    console.error("Google Auth Error:", err);
    return res.redirect("/login");
  }
};