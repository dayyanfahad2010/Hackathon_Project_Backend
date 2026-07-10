import emailConfiguration from "../config/nodemailer.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const sendEmail = async(email,otp)=>{
    const transporter = nodemailer.createTransport(emailConfiguration);
    const mailOptions ={
        from: process.env.PORTAL_EMAIL,
        to:email ,
        subject: "Reset Your Password - Verification Code",
        text: `Hello,

            We received a request to reset the password for your account.

            Use the verification code below to continue:

            Verification Code (OTP): ${otp}

            This code is valid for 10 minutes.

            If you did not request a password reset, you can safely ignore this email. No changes will be made to your account unless this code is used.
            For your security, please do not share this verification code with anyone.

            Thank you,
            The Website Team`
    }
    try {
        await transporter.sendMail(mailOptions);
        return `OTP sent to ${email} via email`;
    } catch (error) {
         throw `Error sending OTP to ${email} via email: ${error}`;
    }
}

export default sendEmail;