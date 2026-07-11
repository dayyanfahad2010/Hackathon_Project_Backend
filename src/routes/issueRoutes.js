import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { getIssues } from "../controllers/dashboardController.js";
import { assignTechnician, getAssignedIssues, getIssueById, updateIssueStatus } from "../controllers/issueController.js";

const issueRoutes = express.Router();

issueRoutes.get("/", authMiddleware, getIssues);
issueRoutes.patch("/:id/assign", authMiddleware, assignTechnician);
issueRoutes.patch("/:id/status", authMiddleware, updateIssueStatus);
issueRoutes.get( "/technician/me",authMiddleware,getAssignedIssues);
issueRoutes.get("/:id", authMiddleware, getIssueById);

export default issueRoutes;