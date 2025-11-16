import UserRepository from "../repositories/UserRepository.js";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config({path:"../.env"})

const adminLogin = async (adminEmail,password) =>{

    const admin = await UserRepository.findByEmail(adminEmail)

    if(!admin || !admin.isAdmin) throw new Error("Admin don't exist");

    const validPassword = await bcrypt.compare(password,admin.password)

    if(!validPassword) throw new Error("Invalid Password")

    const token = jwt.sign({id:admin._id},process.env.JWT_SECRET,{
        expiresIn:'1d'
    })

    return { message : "Login Successful", token ,
        admin:{
           adminName : admin.userName,
           adminEmail: admin.userEmail
        }
    }
}


const getAllUsers = async ()=>{
    const users = await UserRepository.findAllUsers();

    if(!users || users.length==0){
        return []
    }

    return users
}


const getUserById = async (id)=>{
    
     if (!id) throw new Error("User id is required")

    const user = await UserRepository.findById(id);

    if(!user) throw new Error("User not found");

    return user

}

const softDeleteUser = async (id) =>{
    const user = await UserRepository.findById(id)

    if(!user) throw new Error("User not found");
    if(user.isDeleted) throw new Error("User already deleted");

    return await UserRepository.deleteUser(id)
}


const blockUser = async (id) =>{
    const user = await UserRepository.findById(id)

    if(!user) throw new Error("User not found");
    if(user.isBlocked) throw new Error("User already blocked");

    return await UserRepository.blockUser(id)
}

const unblockUser = async (id) =>{
    const user = await UserRepository.findById(id)

    if(!user) throw new Error("User not found");
    if(!user.isBlocked) throw new Error("User is not blocked");

    return await UserRepository.unblockUser(id)
}


export default {adminLogin , getAllUsers , getUserById , softDeleteUser ,blockUser , unblockUser}