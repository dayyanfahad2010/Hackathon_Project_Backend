export const role = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized. Please login.",
        });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden. You don't have permission to perform this action.",
        });
      }

      next();
    } catch (error) {
      console.error("Role Middleware Error:", error);

      next(error)
  };
};

};