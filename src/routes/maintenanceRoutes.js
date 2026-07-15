import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { createMaintenance, getMaintenanceByIssue, updateMaintenance } from "../controllers/maintenanceController.js";
import upload from "../middlewares/multer.js";

const maintenanceRoutes = express.Router();

maintenanceRoutes.post("/", authMiddleware, upload.array("evidence", 5), createMaintenance);
maintenanceRoutes.get("/:issueId",authMiddleware,getMaintenanceByIssue);
maintenanceRoutes.patch("/:id",authMiddleware, upload.array("evidence", 5), updateMaintenance);

export default maintenanceRoutes;