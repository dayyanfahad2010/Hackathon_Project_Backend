import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { role } from "../middlewares/roleMiddleware.js";
import { createAsset, deleteAsset, getAssetById, getAssets, updateAsset } from "../controllers/assetController.js";

const assetRoutes = express.Router();

assetRoutes.post("/", authMiddleware, role("admin"), createAsset);
assetRoutes.get("/", authMiddleware, getAssets);
assetRoutes.get("/:id", authMiddleware, getAssetById);
assetRoutes.patch("/:id", authMiddleware, role("admin"), updateAsset);
assetRoutes.delete("/:id", authMiddleware, role("admin"), deleteAsset);

export default assetRoutes;