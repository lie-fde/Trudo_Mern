import  bcrypt  from 'bcrypt'
import UserRepository from '../repositories/UserRepository.js'
import OtpRepository from '../repositories/OtpRepository.js';
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


    if(!otpRecord) throw new Error("Invalid or otp Expired");

    const user = await UserRepository.findByEmail(email)

    if(!user) throw new Error("User Not Found");

    user.isVerified = true

    await user.save()

    await OtpRepository.deleteByEmail(email)    

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

    const validPassword = await bcrypt.compare(password,user.password);

    if(!validPassword) throw new Error("Invalid Password");

    const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{
        expiresIn: '1d',
    })

    return {message : 'Login Successfull', token,
        user:{
            userName:user.userName,
            userEmail:user.userEmail
        }
    }
}

export default {signup , login , verifyOtp , resendOtp};

