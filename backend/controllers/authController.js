const catchAsyncError = require("../middlewares/catchAsynError");
const User = require("../models/UserModels");
const ErrorHandler = require("../utils/ErrorHandler");
const sendEmail = require("../utils/email");
const sendToken = require("../utils/jwt");
const crypto = require("crypto");

exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  let avatar;
  if (req.file) {
    avatar = `${process.env.BACKEND_URL}/uploads/user/${req.file.originalname}`;
  }
  const user = await User.create({
    name,
    email,
    password,
    avatar,
  });

  sendToken(user, 201, res);
});

exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email & password", 400));
  }

  // finding the user database
  let user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  if (!(await user.isValidPassword(password))) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendToken(user, 201, res);
});

exports.logoutUser = (req, res, next) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .status(200)
    .json({
      success: true,
      messsage: "LoggedOut",
    });
};

exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User not found with this email", 404));
  }
  const resetToken = user.getResetToken();
  user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset url is as follows \n\n 
  ${resetUrl}\n\n If you have not request this email, then ignore it.`;

  try {
    sendEmail({
      email: user.email,
      subject: "Password Recovery",
      message: message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

exports.resetPassword = catchAsyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken: resetPasswordToken,
    resetPasswordTokenExpire: {
      $gt: Date.now(),
    },
  });
  if (!user) {
    next(new ErrorHandler("ResetToken is invalid", 404));
  }
  if (req.body.password !== req.body.confirmPassword) {
    next(new ErrorHandler("Password does not match", 404));
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpire = undefined;
  await user.save({ validateBeforeSave: false });

  sendToken(user, 201, res);
});

exports.getProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new ErrorHandler("Invalid User Details", 404));
  }
  res.status(200).json({
    success: true,
    user,
  });
});

exports.changePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid User Details", 404));
  }
  if (!(await user.isValidPassword(req.body.oldPassword))) {
    return next(new ErrorHandler("Password does not match", 404));
  }
  user.password = req.body.password;
  await user.save();
  res.status(200).json({
    success: true,
    message: "Password successfully changed",
  });
});

exports.updateProfile = catchAsyncError(async (req, res, next) => {
  const newDetails = {
    name: req.body.name,
    email: req.body.email,
  };
  await User.findByIdAndUpdate(req.user.id, newDetails, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    message: "Profile successfully updated",
  });
});

// Admin Routes
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find();
  if (!users) {
    return next(new ErrorHandler("Invalid User Details", 404));
  }
  res.status(200).json({
    success: true,
    users,
  });
});

exports.getSpecificUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler("Invalid User Details", 404));
  }
  res.status(200).json({
    success: true,
    user,
  });
});

exports.updateUser = catchAsyncError(async (req, res, next) => {
  const newDetails = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };
  await User.findByIdAndUpdate(req.params.id, newDetails, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    message: "Updated Successfully",
  });
});

exports.deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler("Invalid User Details", 404));
  }
  await User.findByIdAndDelete(req.params.id, user);
  res.status(200).json({
    success: true,
    message: "Deleted Successfully",
  });
});
