import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { createMaintenance, getMaintenanceByIssue, updateMaintenance } from "../controllers/maintenanceController.js";

const maintenanceRoutes = express.Router();

maintenanceRoutes.post("/", authMiddleware, createMaintenance);
maintenanceRoutes.get("/:issueId",authMiddleware,getMaintenanceByIssue);
maintenanceRoutes.patch("/:id",authMiddleware,updateMaintenance);

export default maintenanceRoutes;