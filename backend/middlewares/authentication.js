const ErrorHandler = require("../utils/ErrorHandler");
const catchAsynError = require("./catchAsynError");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModels");

exports.isAuthenticateUser = catchAsynError(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Login first to handle this resources", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);
  next();
});

exports.authorisedRoles = (...Roles) => {
  return (req, res, next) => {
    if (!Roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(`Role ${req.user.role} is not authorised`, 401)
      );
    }
    next();
  };
};
