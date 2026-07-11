export const role = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized. Please login.",
        });
      }
console.log(allowedRoles.includes(req.user.role));
console.log(req.user);

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: req.user,
          data:"jaaaniii"
        });
      }
console.log("role middleware mai request ayee...");
      next();
    } catch (error) {
      console.error("Role Middleware Error:", error);

      next(error)
  };
};

};