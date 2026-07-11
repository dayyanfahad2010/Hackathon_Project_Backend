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
  role("admin"),
  getAdminSummary
);

dashboardRoutes.get(
  "/technician/summary",
  authMiddleware,
  role("technician"),
  getTechnicianSummary
);

dashboardRoutes.get(
  "/issues",
  authMiddleware,
  role("admin", "technician"),
  getIssues
);

export default dashboardRoutes;