import express from "express";
import { getPublicAsset, reportIssue } from "../controllers/publicController.js";
import upload from "../middlewares/multer.js";

const publicRoutes = express.Router();

publicRoutes.get("/assets/:assetCode", getPublicAsset);
publicRoutes.post("/assets/:assetCode/report", upload.array("evidence", 5), reportIssue);

export default publicRoutes;