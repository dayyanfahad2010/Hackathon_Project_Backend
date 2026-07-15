import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { issueTriage, maintenanceSummary } from "../controllers/aiController.js";

const aiRoutes = express.Router();

// Public: this runs during the QR-scan issue report flow, before any login.
aiRoutes.post("/triage", issueTriage);

aiRoutes.post(
  "/maintenance-summary",
  authMiddleware,
  maintenanceSummary
);

export default aiRoutes;