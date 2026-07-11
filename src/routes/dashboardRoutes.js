import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { role } from "../middlewares/roleMiddleware.js";
import {
  getAdminSummary,
  getTechnicianSummary,
  getIssues,
} from "../controllers/dashboardController.js";

const dashboardRoutes = express.Router();

dashboardRoutes.get(
  "/admin/summary",
  authMiddleware,
  role("Admin"),
  getAdminSummary
);

dashboardRoutes.get(
  "/technician/summary",
  authMiddleware,
  role("Technician"),
  getTechnicianSummary
);

dashboardRoutes.get(
  "/issues",
  authMiddleware,
  role("Admin", "Technician"),
  getIssues
);

export default dashboardRoutes;