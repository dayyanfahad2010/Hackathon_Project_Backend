import express from "express";
import { getPublicAsset, reportIssue } from "../controllers/publicController.js";

const publicRoutes = express.Router();

publicRoutes.get("/assets/:assetCode", getPublicAsset);
publicRoutes.post("/assets/:assetCode/report", reportIssue);

export default publicRoutes;