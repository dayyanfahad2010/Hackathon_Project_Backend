import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { getAssetHistory } from "../controllers/historyController.js";

const historyRoutes = express.Router();

historyRoutes.get( "/:assetId",authMiddleware,getAssetHistory);

export default historyRoutes;