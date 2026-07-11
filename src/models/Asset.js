import mongoose from "mongoose";

const assetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    assetCode: {
      type: String,
      required: true,
      unique: true,
    },

    category: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    condition: {
      type: String,
      enum: ["Excellent", "Good", "Fair", "Poor"],
      default: "Good",
    },

    status: {
      type: String,
      enum: [
        "Operational",
        "Issue Reported",
        "Under Inspection",
        "Under Maintenance",
        "Out of Service",
        "Retired",
      ],
      default: "Operational",
    },

    assignedTechnician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    lastServiceDate: {
      type: Date,
      default: null,
    },

    nextServiceDate: {
      type: Date,
      default: null,
    },

    qrCode: {
      type: String,
      default: "",
    },

    publicUrl: {
      type: String,
      default: "",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Asset= mongoose.model("Asset", assetSchema);