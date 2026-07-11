import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { role } from "../middlewares/roleMiddleware.js";
import { createAsset, deleteAsset, getAssetById, getAssets, updateAsset } from "../controllers/assetController.js";

const assetRoutes = express.Router();

assetRoutes.post("/", authMiddleware, role("Admin"), createAsset);
assetRoutes.get("/", authMiddleware, getAssets);
assetRoutes.get("/:id", authMiddleware, getAssetById);
assetRoutes.patch("/:id", authMiddleware, role("Admin"), updateAsset);
assetRoutes.delete("/:id", authMiddleware, role("Admin"), deleteAsset);

export default assetRoutes;