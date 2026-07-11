import { Maintenance } from "../models/Maintenance.js";
import { Issue } from "../models/Issue.js";
import { Asset } from "../models/Asset.js";
import successRes from "../responseHandler/successResponse.js";

export const createMaintenance = async (req, res, next) => {
  try {
    const {
      issue,
      inspectionNotes,
      workPerformed,
      parts,
      cost,
      evidence,
      finalCondition,
      nextServiceDate,
      aiSummary,
    } = req.body;

    const issueExists = await Issue.findById(issue);

    if (!issueExists) {
      return res.status(404).json({
        success: false,
        message: "Issue not found.",
      });
    }

    const maintenance = await Maintenance.create({
      issue,
      asset: issueExists.asset,
      technician: req.user._id,
      inspectionNotes,
      workPerformed,
      parts,
      cost,
      evidence,
      finalCondition,
      nextServiceDate,
      aiSummary,
    });

    issueExists.status = "Resolved";
    await issueExists.save();

    await Asset.findByIdAndUpdate(issueExists.asset, {
      status: "Operational",
      condition: finalCondition,
      lastServiceDate: new Date(),
      nextServiceDate,
    });
   
    await createHistory({
        asset: maintenance.asset,
        issue: maintenance.issue,
        performedBy: req.user._id,
        action: "Maintenance Completed",
        details: "Maintenance record created successfully.",
    });
    successRes(
      res,
      "Maintenance record created successfully.",
      maintenance,
      null,
      201
    );
  } catch (error) {
    next(error);
  }
};

export const getMaintenanceByIssue = async (req, res, next) => {
  try {
    const maintenance = await Maintenance.findOne({
      issue: req.params.issueId,
    })
      .populate("asset", "name assetCode")
      .populate("issue", "issueNumber title")
      .populate("technician", "name email");

    if (!maintenance) {
      return res.status(404).json({
        success: false,
        message: "Maintenance record not found.",
      });
    }

    successRes(
      res,
      "Maintenance record fetched successfully.",
      maintenance
    );
  } catch (error) {
    next(error);
  }
};

export const updateMaintenance = async (req, res, next) => {
  try {
    const maintenance = await Maintenance.findById(req.params.id);

    if (!maintenance) {
      return res.status(404).json({
        success: false,
        message: "Maintenance record not found.",
      });
    }

    const updatedMaintenance = await Maintenance.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("asset", "name assetCode")
      .populate("issue", "issueNumber title")
      .populate("technician", "name email");

      await createHistory({
        asset: maintenance.asset,
        issue: maintenance.issue,
        performedBy: req.user._id,
        action: "Maintenance Updated",
        details: "Maintenance record updated.",
    });
    successRes(
      res,
      "Maintenance record updated successfully.",
      updatedMaintenance
    );
  } catch (error) {
    next(error);
  }
};