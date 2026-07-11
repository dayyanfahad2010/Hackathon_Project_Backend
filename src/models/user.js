import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName :String,
    email :{
        required:true,
        unique: true,
        type: String
    },
    password:{
        required : true,
        type:String
    },
    role: {
        type:String,
        enum:[
            "technician",
            "admin"
        ],
    },
    otp:{
        type:String,
        default:null
    },
    otpExpiry:{
        type:Date,
        default:null
    }
},{
    timestamps:{createdAt:'created_at', updatedAt: false}
});


export const User = mongoose.model("users",userSchema);