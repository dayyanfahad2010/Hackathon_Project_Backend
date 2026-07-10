import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB =async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DB Connected");
    } catch (error) {
        console.log(error.message || error);
    }
}

export default connectDB;