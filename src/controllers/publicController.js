import { Asset } from "../models/Asset.js";
import { History } from "../models/History.js";
import { Issue } from "../models/Issue.js";
import successRes from "../responseHandler/successResponse.js";

export const getPublicAsset = async (req, res,next) => {
  try {
    const { assetCode } = req.params;

    const asset = await Asset.findOne({ assetCode }).select(
      "name assetCode category location condition status lastServiceDate nextServiceDate publicUrl qrCode"
    );

    if (!asset) {
      const error =new Error("Asset not found");
      error.statusCode= 404;
      throw error;
    }

    successRes(res,"Asset Fetched Succesfully",asset)
  } catch (error) {
    next(error)
  }
};

export const reportIssue = async (req, res,next) => {
  try {
    const { assetCode } = req.params;

    const {
      title,
      description,
      category,
      priority,
      reporterName,
      reporterEmail,
      evidence,
      aiSuggestions,
    } = req.body;

    const asset = await Asset.findOne({ assetCode });

    if (!asset) {
        const error =new Error("Asset not found");
      error.statusCode= 404;
      throw error;
    }

    const issueNumber = `ISS-${Date.now()}`;

    const issue = await Issue.create({
      issueNumber,
      asset: asset._id,
      title,
      description,
      category,
      priority,
      reporterName,
      reporterEmail,
      evidence,
      aiSuggestions,
    });

  await createHistory({
    asset: asset._id,
    issue: issue._id,
    action: "Issue Reported",
    details: "A new issue has been reported.",
    });
    asset.status = "Issue Reported";
    await asset.save();

   successRes(res,"Issue reported successfully.",asset);
  } catch (error) {
    next(error);
  }
};