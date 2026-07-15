import { Asset } from "../models/Asset.js";
import { Issue } from "../models/Issue.js";
import { Maintenance } from "../models/Maintenance.js";
import successRes from "../responseHandler/successResponse.js";

export const getAdminSummary = async (req, res,next) => {
  try {
    const totalAssets = await Asset.countDocuments();
    const totalIssues = await Issue.countDocuments();
    const operationalAssets = await Asset.countDocuments({
      status: "Operational",
    });
    const underMaintenance = await Asset.countDocuments({
      status: "Under Maintenance",
    });

    const outOfService = await Asset.countDocuments({
      status: "Out of Service",
    });

    const resolvedIssues = await Issue.countDocuments({
      status: "Resolved",
    });

    const pendingIssues = await Issue.countDocuments({
      status: {
        $nin: ["Resolved", "Closed"],
      },
    });

    successRes(res,"Dashboard States Fetched Successfully",{
        totalAssets,
        totalIssues,
        operationalAssets,
        underMaintenance,
        outOfService,
        resolvedIssues,
        pendingIssues,
    });
  } catch (error) {
    next(error)
  }
};

export const getTechnicianSummary = async (req, res,next) => {
  try {
    const technicianId = req.user._id;

    const assigned = await Issue.countDocuments({
      assignedTechnician: technicianId,
    });

    const inProgress = await Issue.countDocuments({
      assignedTechnician: technicianId,
      status: "Maintenance In Progress",
    });

    const waitingForParts = await Issue.countDocuments({
      assignedTechnician: technicianId,
      status: "Waiting for Parts",
    });

    const resolved = await Issue.countDocuments({
      assignedTechnician: technicianId,
      status: "Resolved",
    });

    successRes(res,"Technician States Fetched Successfully",{
        assigned,
        inProgress,
        waitingForParts,
        resolved,
      })
  } catch (error) {
        next(error)

  }
};

export const getIssues = async (req, res) => {
  try {
    let issues;

    if (req.user.role === "admin") {
      issues = await Issue.find()
        .populate("asset", "name assetCode")
        .populate("assignedTechnician", "userName email")
        .sort({ createdAt: -1 });
    } else {
      issues = await Issue.find({
        assignedTechnician: req.user._id,
      })
        .populate("asset", "name assetCode")
        .populate("assignedTechnician", "userName email")
        .sort({ createdAt: -1 });
    }

    successRes(res,"Issues Fetched Successfully",issues,null,200,{count:issues.length})
  } catch (error) {
    next(error)
  }
};