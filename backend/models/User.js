import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  street: { type: String, default: "123 Main Street" },
  city: { type: String, default: "Thrissur" },
  state: { type: String, default: "Kerala" },
  country: { type: String, default: "India" },
  pincode: { type: String, default: "680001" },
});

const userSchema = new mongoose.Schema(
    {
        userName : {type: String , required: function () {return !this.googleId;} , minlength:3},
        userEmail : {type: String , required : true , unique:true , lowercase:true},
        mobileNumber: {type: String , required : function () {return !this.googleId;} },
        password : {type: String , required : function () {return !this.googleId;}},
        googleId: {type: String,default: null,},
        avatar: {type: String,default: null,},
        isVerified : {type:Boolean , default:false},
        dateOfBirth: { type: Date, default: new Date("2000-01-01") },
        gender: { type: String, enum: ["Male", "Female", "Other"], default: "Male" },
        isAdmin: { type: Boolean, default: false },
        isBlocked: { type: Boolean, default: false },
        isDeleted: { type: Boolean, default: false },
        address: { type: addressSchema, default: () => ({}) },
    },
    {
        timestamps:true
    }
);

export default mongoose.model("User" , userSchema)