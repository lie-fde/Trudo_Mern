import AdminService from "../../services/AdminService.js"
import UserService from "../../services/UserService.js"

export const adminLogin = async (req,res)=>{
    try {

        const {adminEmail ,password} = req.body

        const result = await AdminService.adminLogin(adminEmail,password)

        res.status(200).json(result)
        
    } catch (error) {

        res.status(400).json({message:error.message})
        
    }
}


export const fetchAllUsers = async ( req,res) =>{
    try {

        const users = await AdminService.getAllUsers()

        return res.status(200).json({
            success:true,
            message:"Users fetched successfully",
            users
        })
        
    } catch (error) {

        return res.status(500).json({
            success:false,
            message:error.message
        })
        
    }
}


export const fetchUser = async (req,res) =>{
    try {

        const {id} = req.params
        const user = await AdminService.getUserById(id)

        return res.status(200).json({
            success:true,
            user
        })

        
    } catch (error) {

        return res.status(500).json({
            success:false,
            message:error.message
        })
        
    }
}


export const softDelete = async (req,res) =>{
    try {

        const {id} = req.params
        const result = await AdminService.softDeleteUser(id)
        
        return res.status(200).json({
            success:true,
            message: "User soft deleted successfully",
            data: result
        })
        
    } catch (error) {

         return res.status(400).json({
        success: false,
        message: error.message,
        
    });
}
}


export const block = async (req,res) =>{
    try {

        const {id} = req.params;
        const result = await AdminService.blockUser(id)

        return res.status(200).json({
            success: true,
            message: "User blocked successfully",
            data: result
        })
        
    } catch (error) {
        
        return res.status(400).json({
        success: false,
        message: error.message
      });
    }
}


export const unblock = async (req,res)=>{
    try {

        const {id} = req.params;
        const result = await AdminService.unblockUser(id)

        return res.status(200).json({
        success: true,
        message: "User unblocked successfully",
        data: result
      });
        
    } catch (error) {

        return res.status(400).json({
        success: false,
        message: error.message
      });
        
    }
}