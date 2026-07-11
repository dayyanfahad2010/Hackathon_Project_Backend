import express from "express"
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";
import errorMiddleware from "./middlewares/errorMiddleware.js";

const app = express();

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://hackathon-project-sigma-three.vercel.app",
  ], 
  credentials: true, 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.options('/{*path}', cors(corsOptions)); 
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.get("/",(req,res)=>{
    res.send("Server is Listening")
})
app.use("/api/auth",authRoutes);
app.use(errorMiddleware);

export default app;