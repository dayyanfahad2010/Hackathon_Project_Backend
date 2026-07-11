import express from "express"
import { forgotPassword, login, logout, profile, resetPassword, signUp } from "../controllers/authController.js";

const authRoutes = express.Router();
authRoutes.post("/login",login);
authRoutes.post("/signup",signUp);
authRoutes.post("/forgot-password",forgotPassword);
authRoutes.post("/reset-password",resetPassword);
authRoutes.post("/logout",logout);
authRoutes.get("/profile",profile);

export default authRoutes;