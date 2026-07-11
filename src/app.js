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
app.use("/api/maintenance",maintenanceRoutes);
app.use("/api/history",historyRoutes);
app.use("/api/public",publicRoutes);
app.use("/api/assets",assetRoutes);
app.use("/api/dashboard",dashboardRoutes);
app.use("/api/ai",aiRoutes);
app.use("/api/issue",issueRoutes);
app.use(errorMiddleware);

export default app;