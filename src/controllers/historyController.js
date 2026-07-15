import { History } from "../models/History.js";
import successRes from "../responseHandler/successResponse.js";


export const getAssetHistory = async (req, res,next) => {
  try {
    const { assetId } = req.params;

    const history = await History.find({ asset: assetId })
      .populate("performedBy", "userName email role")
      .populate("issue", "issueNumber title status")
      .sort({ createdAt: -1 });

    if (history.length === 0) {
      const error =new Error("No history found for this asset.");
      error.statusCode= 404;
      throw error;
    }

    successRes(res,"Assets History Fetched Successfully",{...history,count:history.count})
  } catch (error) {
    next(error);
  }
};