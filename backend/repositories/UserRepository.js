import User from '../models/User.js'

const create = async(data) => await User.create(data);

const findByEmail = async(userEmail)=> await User.findOne({userEmail});

const findById = async(id) => await User.findById(id)

const updatePassword = async (email, hashedPassword) => {
  return await User.updateOne(
    { userEmail: email },
    { $set: { password: hashedPassword } }
  );
};

const findAllUsers = async()=>{
  return await User.find({isDeleted : false , isAdmin:false})
}


const blockUser = async(id)=>{
  return await User.findByIdAndUpdate(id,{isBlocked:true},{new: true})
}

const unblockUser = async(id)=>{
  return await User.findByIdAndUpdate(id,{isBlocked:false},{new : true})
}

const deleteUser = async(id) => await User.findByIdAndUpdate(id,{isDeleted:true},{new : true})




export default {create , findByEmail , findById ,updatePassword , findAllUsers , blockUser , unblockUser ,deleteUser} ;