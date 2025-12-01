import UserService from "../../services/UserService.js";
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'


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

export const resendOtpPassword = async(req,res)=>{
    try {

        const {email} = req.body;
        const result = await UserService.resendPasswordOtp(email)

        res.status(200).json(result)

        
    } catch (error) {
        
        res.status(400).json({message:error.message})
    }
}






export const login = async(req,res)=>{
    try {

        const {userEmail , password} = req.body;

        const data = await UserService.login(userEmail,password);

        const {refreshToken,accessToken,user}= data

        res.cookie("refreshToken",refreshToken,{
          httpOnly : true,
          secure: true,
          sameSite : "strict",
          maxAge: 2*24*60*60*1000
        });



        res.status(200).json({
          message: 'Login Successful', accessToken , user
        });

        
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

export const fetchUsersforPagination = async(req,res) =>{
  try {

    const page = parseInt(req.query.page )  || 1
    const limit = parseInt(req.query.limit) || 10
    
    const data = await UserService.getAllUsersPaginated(page,limit)

    res.status(200).json({
      message:"success",
      data
    })
    
  } catch (error) {
    
    res.status(500).json({
      message:error.message
    })
  }
}


export const refreshTokenController = async (req, res) => {
  try {
    const response = await UserService.refreshAccessToken(req.cookies.refreshToken);
    return res.status(200).json(response);

  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
};

export const logoutController = (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false, 
    sameSite: "strict"
  });

  return res.status(200).json({ message: "Logged out successfully" });
};

export const getMe = async (req,res) =>{
       try {

        const response = await UserService.getMeUser(req.user.id)
        return res.status(200).json({   userName: response.userName,
            userEmail: response.userEmail}
        )
        
       } catch (error) {
         return res.status(400).json({ message : error.message})
       }
}

export const getUserProfileController = async (req, res) => {
  try {
    const  id  = (req.user?.id) || (req.admin?.id);

    const user = await UserService.getUserProfileService(id);

    return res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      data: user
    });

  } catch (err) {
    return res.status(404).json({
      success: false,
      message: err.message
    });
  }
};

export const sendOtpControllerProfile = async (req, res) => {
  try {
    const { email } = req.query;
     if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const result = await UserService.sendOtpServiceProfile(email);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
    console.log(err)
  }
};

export const verifyOtpControllerProfile = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("REQ.USER:", req.user);
   const { newEmail, otp } = req.body;
    const userId = req.user._id;
    const result = await UserService.verifyOtpServiceProfile(userId, newEmail, otp);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateUserProfileController = async (req, res) => {
  try {
    const userId = (req.user?._id) || (req.admin?._id); // From auth middleware
    const avatar = req.file?.path || null;
    const updatedUser = await UserService.updateUserProfileService(
      userId,
      req.body,
      avatar
    );

    return res.status(200).json({
      message: "Profile updated successfully",
      data: updatedUser
    });
  } catch (err) {
    console.log(err)
    return res.status(400).json({ message: err.message });
  }
};
