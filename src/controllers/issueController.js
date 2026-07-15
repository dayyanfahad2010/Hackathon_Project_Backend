import { Issue } from "../models/Issue.js";
import { Asset } from "../models/Asset.js";
import successRes from "../responseHandler/successResponse.js";
import { createHistory } from "../services/historyService.js";

export const getIssues = async (req, res, next) => {
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

    successRes(
      res,
      "Issues fetched successfully.",
      issues,
      null,
      200,
      { count: issues.length }
    );
  } catch (error) {
    next(error);
  }
};

export const getIssueById = async (req, res, next) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate("asset")
      .populate("assignedTechnician", "userName email");

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found.",
      });
    }

    successRes(res, "Issue fetched successfully.", issue);
  } catch (error) {
    next(error);
  }
};

export const assignTechnician = async (req, res, next) => {
  try {
    const { assignedTechnician } = req.body;

    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found.",
      });
    }

    issue.assignedTechnician = assignedTechnician;
    issue.status = "Assigned";

    await issue.save();
   
    await createHistory({
        asset: issue.asset,
        issue: issue._id,
        performedBy: req.user._id,
        action: "Issue Assigned",
        details: "Issue assigned to technician.",
    });
    successRes(res, "Technician assigned successfully.", issue);
  } catch (error) {
    next(error);
  }
};

export const updateIssueStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found.",
      });
    }

    issue.status = status;

    await issue.save();

    const asset = await Asset.findById(issue.asset);

    if (asset) {
      switch (status) {
        case "Inspection Started":
          asset.status = "Under Inspection";
          break;

        case "Maintenance In Progress":
          asset.status = "Under Maintenance";
          break;

        case "Resolved":
          asset.status = "Operational";
          break;

        default:
          break;
      }

      await asset.save();
    }
    await createHistory({
        asset: issue.asset,
        issue: issue._id,
        performedBy: req.user._id,
        action: `Issue status changed to ${status}`,
        details: `Issue status updated to "${status}".`,
    });
    successRes(res, "Issue status updated successfully.", issue);
  } catch (error) {
    next(error);
  }
};

export const getAssignedIssues = async (req, res, next) => {
  try {
    const issues = await Issue.find({
      assignedTechnician: req.user._id,
    })
      .populate("asset", "name assetCode location")
      .sort({ createdAt: -1 });

    successRes(
      res,
      "Assigned issues fetched successfully.",
      issues,
      null,
      200,
      {
        count: issues.length,
      }
    );
  } catch (error) {
    next(error);
  }
};