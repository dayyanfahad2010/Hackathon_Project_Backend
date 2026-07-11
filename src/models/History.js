import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
      required: true,
    },

    issue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
      default: null,
    },

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    action: {
      type: String,
      required: true,
    },

    details: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export const History =
  mongoose.models.History ||
  mongoose.model("History", historySchema);