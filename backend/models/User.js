import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        userName : {type: String , required: true , minlength:3},
        userEmail : {type: String , required : true , unique:true , lowercase:true},
        mobileNumber: {type: String , required : true },
        password : {type: String , required : true },
        isVerified : {type:Boolean , default:false}
    },
    {
        timestamps:true
    }
);

export default mongoose.model("User" , userSchema)