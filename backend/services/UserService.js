import  bcrypt  from 'bcrypt'
import UserRepository from '../repositories/UserRepository.js'
import OtpRepository from '../repositories/OtpRepository.js';
import { verifyGenericOtp } from '../utils/otpHelper.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import {randomInt} from 'crypto'
import nodeMailer from  'nodemailer'

dotenv.config({path:"../.env"})


 const signup = async (userData)=>{

     const existingUser = await UserRepository.findByEmail(userData.userEmail) ;
     if (existingUser) throw new Error('Email already Exist');
    const hashedPassword = await bcrypt.hash(userData.password , 10)
    const newUser = await UserRepository.create({
        ...userData,
        password:hashedPassword,
        isVerified: false
    });

     const otpCode = randomInt(100000,999999).toString()

     await OtpRepository.create({
        email:userData.userEmail,
        otp : otpCode
     })

     const transporter = nodeMailer.createTransport({
        service: "gmail",
        auth:{
            user:process.env.EMAIL_USER,
            pass :process.env.EMAIL_PASS
        }
     })

     await transporter.sendMail({
        from:process.env.EMAIL_USER,
        to: userData.userEmail,
        subject: "Verify Your Email",
        text: `Your OTP is ${otpCode}. It expires in 5 minutes.`,
     })
    


    return {message: "OTP sent to email", userId: newUser._id}
}

const verifyOtp = async (email,otp) => {


    const otpRecord = await OtpRepository.findByEmailAndOtp(email,otp) 


   await verifyGenericOtp(email, otp);

  const user = await UserRepository.findByEmail(email);
  if (!user) throw new Error("User Not Found");

  user.isVerified = true;
  await user.save(); 

    return { message: "Account verified successfully" };
}

const resendOtp = async (email) => {
 
    const  user = await UserRepository.findByEmail(email)
    
    if(!user) throw new Error("User not found")

    if(user.isVerified) throw new Error("User already Verified");

    await OtpRepository.deleteByEmail(email)

    const otpCode = randomInt(100000,999999).toString()

    await OtpRepository.create({
        email,
        otp:otpCode
    })

    const transporter = nodeMailer.createTransport({
        service:"gmail",
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS
        }

    })

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to:email,
        subject: "Verify Your Email",
        text: `Your OTP is ${otpCode}. It expires in 5 minutes.`,
    })
    
     return { message: "New OTP sent successfully" };

    
}


const login = async (userEmail,password) =>{

    const user = await UserRepository.findByEmail(userEmail);
    if(!user || !user.isVerified) throw new Error("User don't exist!");

    if(user.isBlocked) throw new Error("Your account has been blocked");

    if(user.isDeleted) throw new Error("Your account has been deleted.");

    if(user.isAdmin) throw new Error("Admins cannot log in here.")

    const validPassword = await bcrypt.compare(password,user.password);

    if(!validPassword) throw new Error("Invalid Password");

    const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{
        expiresIn: '1d',
    })

    return {message : 'Login Successful', token,
        user:{
            userName:user.userName,
            userEmail:user.userEmail
        }
    }
}


const resetPassword = async (email, newPassword) => {
  const user = await UserRepository.findByEmail(email);
  if (!user) throw new Error('User not found');

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await UserRepository.updatePassword(email, hashedPassword);

  return { message: 'Password reset successfully' };
};


const forgotPassword = async (email) => {
  const user = await UserRepository.findByEmail(email);
  if (!user) throw new Error('User not found');

  const otpCode = randomInt(100000, 999999).toString();

  await OtpRepository.deleteByEmail(email);

  await OtpRepository.saveOtp(email, otpCode);

  const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset OTP',
    text: `Your OTP for password reset is ${otpCode}. It expires in 5 minutes.`,
  });

  return { message: 'OTP sent to email for password reset' };
};



const verifyPasswordOtp = async (email, otp) => {

    await verifyGenericOtp(email, otp);

  return { message: 'OTP verified successfully' };
};


 const googleLoginService = async (googleUser) => {
  // googleUser is provided by Passport's strategy callback

  let user = await UserRepository.findByEmail(googleUser.userEmail);

  // If user exists but not linked with Google, attach googleId
  if (user && !user.googleId) {
    user.googleId = googleUser.googleId;
    user.avatar = googleUser.avatar || user.avatar;
    await user.save();
  }

  // If no user exists, create one
  if (!user) {
    user = await UserRepository.create({
      googleId: googleUser.googleId,
      userName: googleUser.userName,
      userEmail: googleUser.userEmail,
      avatar: googleUser.avatar,
    });
  }

  // Create JWT token
  const token = jwt.sign(
    { id: user._id, email: user.userEmail },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {token,
    user: {
      id: user._id,
      name: user.userName,
      email: user.userEmail,
      avatar: user.avatar,
    },
  };
};

export default {signup , login , verifyOtp , resendOtp ,resetPassword ,forgotPassword , verifyPasswordOtp,googleLoginService};

