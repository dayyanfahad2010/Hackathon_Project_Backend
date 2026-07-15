import { User } from "../models/user.js";
import successRes from "../responseHandler/successResponse.js";

// GET /api/users?role=technician
// Lets admins populate a real dropdown when assigning work, instead of
// having to paste a raw MongoDB ObjectId.
export const getUsers = async (req, res, next) => {
  try {
    const { role } = req.query;

    const query = {};
    if (role) query.role = role;

    const users = await User.find(query)
      .select("userName email role")
      .sort({ userName: 1 });

    successRes(res, "Users fetched successfully.", users, null, 200, {
      count: users.length,
    });
  } catch (error) {
    next(error);
  }
};
