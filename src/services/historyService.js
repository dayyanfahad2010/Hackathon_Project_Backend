import { History } from "../models/history.js";

export const createHistory = async ({
  asset,
  issue = null,
  performedBy = null,
  action,
  details = "",
}) => {
  try {
    await History.create({
      asset,
      issue,
      performedBy,
      action,
      details,
    });
  } catch (error) {
    console.error("History Error:", error.message);
  }
};