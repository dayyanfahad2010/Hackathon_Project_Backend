import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
  {
    issueNumber: {
      type: String,
      required: true,
      unique: true,
    },

    asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },

    status: {
      type: String,
      enum: [
        "Reported",
        "Assigned",
        "Inspection Started",
        "Maintenance In Progress",
        "Waiting for Parts",
        "Resolved",
        "Closed",
        "Reopened",
      ],
      default: "Reported",
    },

    reporterName: {
      type: String,
      required: true,
    },

    reporterEmail: {
      type: String,
      default: "",
    },

    assignedTechnician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    evidence: [
      {
        type: String,
      },
    ],

    aiSuggestions: {
      suggestedTitle: String,
      suggestedCategory: String,
      suggestedPriority: String,

      possibleCauses: [String],

      initialChecks: [String],

      recurringWarning: String,

      aiGenerated: {
        type: Boolean,
        default: false,
      },

      userEdited: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

export const Issue= mongoose.model("Issue", issueSchema);