import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { role } from "../middlewares/roleMiddleware.js";
import { getUsers } from "../controllers/userController.js";

const userRoutes = express.Router();

userRoutes.get("/", authMiddleware, role("admin"), getUsers);

export default userRoutes;
