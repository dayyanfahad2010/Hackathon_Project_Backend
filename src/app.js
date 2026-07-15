import express from "express"
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import maintenanceRoutes from "./routes/maintenanceRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";
import assetRoutes from "./routes/assetRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import issueRoutes from "./routes/issueRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

// Needed so req.secure / x-forwarded-proto reflect the real client protocol
// when deployed behind a reverse proxy (Render, Railway, Vercel, etc.) —
// otherwise auth cookies would always fall back to the insecure/dev flags
// even in production.
app.set("trust proxy", 1);

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://hackathon-project-sigma-three.vercel.app",
  ], 
  credentials: true, 
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
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
app.use("/api/maintenance",maintenanceRoutes);
app.use("/api/history",historyRoutes);
app.use("/api/public",publicRoutes);
app.use("/api/assets",assetRoutes);
app.use("/api/dashboard",dashboardRoutes);
app.use("/api/ai",aiRoutes);
app.use("/api/issue",issueRoutes);
app.use("/api/users",userRoutes);
app.use(errorMiddleware);

export default app;