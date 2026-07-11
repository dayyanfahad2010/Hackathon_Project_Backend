import { Asset } from "../models/Asset.js";
import { createHistory } from "../services/historyService.js";
import successRes from "../responseHandler/successResponse.js";

export const createAsset = async (req, res,next) => {
  try {
    const {
      name,
      assetCode,
      category,
      location,
      condition,
      assignedTechnician,
      lastServiceDate,
      nextServiceDate,
      qrCode,
      publicUrl,
    } = req.body;

    const assetExists = await Asset.findOne({ assetCode });

    if (assetExists) {
      const error =new Error("Asset code already exists.");
      error.statusCode= 401;
      throw error;
    }

    const asset = await Asset.create({
      name,
      assetCode,
      category,
      location,
      condition,
      assignedTechnician,
      lastServiceDate,
      nextServiceDate,
      qrCode,
      publicUrl,
      createdBy: req.user._id,
    });
    await createHistory({
        asset: asset._id,
        performedBy: req.user._id,
        action: "Asset Created",
        details: `${asset.name} has been registered.`,
    });
    successRes(res,"Asset created successfully.",asset)
  } catch (error) {
    next(error);
  }
};


export const getAssets = async (req, res,next) => {
  try {
    const { search, status, category, location } = req.query;

    let query = {};

    if (search) {
      query.name = {
        $regex: search,
        $options: "i",
      };
    }

    if (status) query.status = status;
    if (category) query.category = category;
    if (location) query.location = location;

    const assets = await Asset.find(query)
      .populate("assignedTechnician", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    successRes(res,"Assets fetched successfully",assets,null,200,{count:assets.length});
  } catch (error) {
    next(error);
  }
};

export const getAssetById = async (req, res,next) => {
  try {
    const asset = await Asset.findById(req.params.id)
      .populate("assignedTechnician", "name email")
      .populate("createdBy", "name email");

    if (!asset) {
      const error =new Error("Asset not found.")
      error.statusCode=400;
      throw error;
    }

    successRes(res,"Asset Fetched Successfully",asset)
  } catch (error) {
    next(error);
  }
};

export const updateAsset = async (req, res ,next) => {
  try {
    const asset = await Asset.findById(req.params.id);

    if (!asset) {
      const error =new Error("Asset not found");
      error.statusCode= 404;
      throw error;
    }

    const updatedAsset = await Asset.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
   await createHistory({
      asset: updatedAsset._id,
      performedBy: req.user._id,
      action: "Asset Updated",
      details: `${updatedAsset.name} details updated.`,
  });
    successRes(res,"Asset updated successfully.",updateAsset)
  } catch (error) {
    next(error);
  }
};

export const deleteAsset = async (req, res,next) => {
  try {
    const asset = await Asset.findById(req.params.id);

    if (!asset) {
      const error =new Error("Asset not found");
      error.statusCode= 404;
      throw error;
    }

    asset.status = "Retired";
    await asset.save();
   
    await createHistory({
      asset: asset._id,
      performedBy: req.user._id,
      action: "Asset Retired",
      details: `${asset.name} retired.`,
  });
    successRes(res,"Asset deleted successfully.")
  } catch (error) {
   next(error);
  }
};