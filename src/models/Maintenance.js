import mongoose from "mongoose";

const maintenanceSchema = new mongoose.Schema(
  {
    issue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
      required: true,
    },

    asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
      required: true,
    },

    technician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    inspectionNotes: {
      type: String,
      required: true,
      trim: true,
    },

    workPerformed: {
      type: String,
      required: true,
      trim: true,
    },

    parts: [
      {
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],

    cost: {
      type: Number,
      default: 0,
      min: 0,
    },

    evidence: [
      {
        type: String, // Cloudinary URLs
      },
    ],

    finalCondition: {
      type: String,
      enum: ["Excellent", "Good", "Fair", "Poor"],
      default: "Good",
    },

    completedAt: {
      type: Date,
      default: Date.now,
    },

    nextServiceDate: {
      type: Date,
    },

    aiSummary: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export const Maintenance= mongoose.model("Maintenance", maintenanceSchema);