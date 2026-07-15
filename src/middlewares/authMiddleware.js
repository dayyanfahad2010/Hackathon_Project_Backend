import jwt from "jsonwebtoken";
import dotenv from"dotenv";
dotenv.config();

const authMiddleware = async (req,res,next)=>{
    try {
        const token =req.cookies.token;

        if(!token ) {
            const error= new Error("Unauthorized");
            error.statusCode = 401;
            throw error;
        }
        const decoded =await jwt.verify(token,process.env.JWT_SCRET_KEY);
        req.user = decoded;
        // console.log(req.user);
        
        next();
    } catch (error) {
        next(error)
    }
}

export default authMiddleware;