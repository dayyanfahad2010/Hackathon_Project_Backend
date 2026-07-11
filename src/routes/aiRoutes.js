import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { issueTriage, maintenanceSummary } from "../controllers/aiController.js";

const aiRoutes = express.Router();

aiRoutes.post("/triage", authMiddleware, issueTriage);

aiRoutes.post(
  "/maintenance-summary",
  authMiddleware,
  maintenanceSummary
);

export default aiRoutes;