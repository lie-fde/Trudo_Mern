import Otp from "../models/Otp.js";

const create = async (data) => {

    return await Otp.create(data)
    
}

const findByEmailAndOtp = async (email,otp) =>{
    return await Otp.findOne({email , otp})
}


const deleteByEmail = async (email) =>{
    return await Otp.deleteMany({email});
}

export  default {create,findByEmailAndOtp , deleteByEmail} 