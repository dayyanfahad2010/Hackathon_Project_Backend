import { Maintenance } from "../models/Maintenance.js";
import { Issue } from "../models/Issue.js";
import { Asset } from "../models/Asset.js";
import successRes from "../responseHandler/successResponse.js";
import { createHistory } from "../services/historyService.js";
import uploadImages from "../utils/uploadImages.js";

export const createMaintenance = async (req, res, next) => {
  try {
    const {
      issue,
      inspectionNotes,
      workPerformed,
      cost,
      evidence,
      finalCondition,
      nextServiceDate,
      aiSummary,
    } = req.body;

    let parts = req.body.parts;
    if (typeof parts === "string" && parts) {
      try {
        parts = JSON.parse(parts);
      } catch {
        parts = [];
      }
    }

    const issueExists = await Issue.findById(issue);

    if (!issueExists) {
      return res.status(404).json({
        success: false,
        message: "Issue not found.",
      });
    }

    // Evidence can arrive either as uploaded files (multipart, from the
    // technician's maintenance form) or as an already-hosted URL array.
    let evidenceUrls = [];
    if (req.files?.length) {
      const uploaded = await uploadImages(req.files);
      evidenceUrls = uploaded.map((f) => f.url);
    } else if (Array.isArray(evidence)) {
      evidenceUrls = evidence;
    } else if (typeof evidence === "string" && evidence) {
      try {
        evidenceUrls = JSON.parse(evidence);
      } catch {
        evidenceUrls = [evidence];
      }
    }

    if (nextServiceDate && new Date(nextServiceDate) < new Date()) {
      const error = new Error("Next service date cannot be before the maintenance completion date.");
      error.statusCode = 400;
      throw error;
    }

    const maintenance = await Maintenance.create({
      issue,
      asset: issueExists.asset,
      technician: req.user._id,
      inspectionNotes,
      workPerformed,
      parts,
      cost,
      evidence: evidenceUrls,
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
      .populate("technician", "userName email");

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

    const updates = { ...req.body };

    if (typeof updates.parts === "string" && updates.parts) {
      try {
        updates.parts = JSON.parse(updates.parts);
      } catch {
        delete updates.parts;
      }
    }

    if (req.files?.length) {
      const uploaded = await uploadImages(req.files);
      const newUrls = uploaded.map((f) => f.url);
      updates.evidence = [...(maintenance.evidence || []), ...newUrls];
    } else if (typeof updates.evidence === "string" && updates.evidence) {
      try {
        updates.evidence = JSON.parse(updates.evidence);
      } catch {
        delete updates.evidence;
      }
    }

    if (
      updates.nextServiceDate &&
      new Date(updates.nextServiceDate) < new Date(maintenance.completedAt || Date.now())
    ) {
      const error = new Error("Next service date cannot be before the maintenance completion date.");
      error.statusCode = 400;
      throw error;
    }

    const updatedMaintenance = await Maintenance.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("asset", "name assetCode")
      .populate("issue", "issueNumber title")
      .populate("technician", "userName email");

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