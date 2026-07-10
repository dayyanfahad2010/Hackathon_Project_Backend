import { User } from "../models/user.js";
import bcrypt from "bcrypt"
import successRes from "../responseHandler/successResponse.js";
import sendEmail from "../services/sendEmail.js";
import jwt from "jsonwebtoken";

const signUp =async(req,res,next)=>{
    try {
        const {userName ,email,password}=req.body;
        if(!userName||!email||!password) throw new Error("All Fields Are Required");
        const userFound = await User.findOne({email});
        if(userFound){
            const error = new Error("This Email is already Registered");
            error.statusCode = 400;
            throw error;
        }
        if(password.length < 8 ) throw new Error("Password must be greater than 8 characters");
        const hashedPass = await bcrypt.hash(password,14);
        const user = await User.create({
            userName,
            email,
            password :hashedPass
        })
        const data = {_id:user._id,email:user.email,role:user.role}
        successRes(res,"User SignUp Successfully",data);
    } catch (error) {
        next(error);
    }
}
const login =async(req,res,next)=>{
    try {
        const {email,password} =req.body;
        if(!email||!password) throw new Error("Email or Password Are Required");
        const user = await User.findOne({email});
        if(!user){
            const error = new Error("User not Found");
            error.statusCode = 404;
            throw error;
        }
        const isPasswordMatched =await bcrypt.compare(password,user.password);
        if(!isPasswordMatched){
            const error = new Error("Invalid Credentails");
            error.statusCode = 401;
            throw error;
        }
        const {_id,role}=user;
        const token = jwt.sign({
            _id,email,role
        },
        process.env.JWT_SCRET_KEY,
        {expiresIn : '3h' }
    )
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      secure: true,   
      sameSite: "none", 
      maxAge: 3 * 60 * 60 * 1000,
    });
    successRes(res,"User Login Successfully",{_id,email,role},token);
    } catch (error) {
        next(error);
    }
}
const forgotPassword =async(req,res,next)=>{
    try {
        const {email} =req.body;
        if(!email) throw new Error("Email is Required");
        const user = await User.findOne({email});
        if(!user){
            const error = new Error("User not Found");
            error.statusCode = 404;
            throw error;
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await sendEmail(email ,otp);
        const hashedOTP = await bcrypt.hash(otp, 12);
        user.otp = hashedOTP;
        user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();
        successRes(res,"OTP Send Successfully");
    } catch (error) {
        next(error);
    }
}
const resetPassword =async(req,res,next)=>{
    try {
        const {email,otp,password} =req.body;
        if(!email || !otp || !password) throw new Error("All fields Are Required");
        const user = await User.findOne({email});
        if(!user){
            const error = new Error("User not Found");
            error.statusCode = 404;
            throw error;
        }
        const isOtpVerified = await bcrypt.compare(otp ,user.otp);
        if(Date.now() > user.otpExpires){
            const error = new Error("OTP Expired");
            error.statusCode=400;
            throw error;
        }
        if(!isOtpVerified){
            const error = new Error("Invalid OTP");
            error.statusCode=400;
            throw error;
        }
         if (password.length < 8){
            const error = new Error("Password must be at least 8 characters");
            error.statusCode=400;
            throw error;
        }
        const hashedPassword  =await bcrypt.hash(password,14);
        user.password =hashedPassword;
        user.otp = null;
        user.otpExpires = null;
        await user.save();
        successRes(res,"Password reset Successfully");
    } catch (error) {
        next(error);
    }
}

const logout = (req, res,next) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    successRes(res,"User Logged out successfully");
    
  } catch (error) {
    next(error);
  }
};

export { signUp, login, forgotPassword, resetPassword ,logout};
