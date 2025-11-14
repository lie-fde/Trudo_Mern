import User from '../models/User.js'

const create = async(data) => await User.create(data);

const findByEmail = async(userEmail)=> await User.findOne({userEmail});

const findById = async(data) => await User.findById({id})

const updatePassword = async (email, hashedPassword) => {
  return await User.updateOne(
    { userEmail: email },
    { $set: { password: hashedPassword } }
  );
};


export default {create , findByEmail , findById ,updatePassword} ;