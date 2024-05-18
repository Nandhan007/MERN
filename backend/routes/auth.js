const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getProfile,
  changePassword,
  updateProfile,
  getAllUsers,
  getSpecificUser,
  updateUser,
  deleteUser,
} = require("../controllers/authController");
const {
  isAuthenticateUser,
  authorisedRoles,
} = require("../middlewares/authentication");
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").post(resetPassword);
router.route("/myprofile").get(isAuthenticateUser, getProfile);
router.route("/password/change").put(isAuthenticateUser, changePassword);
router.route("/myprofile/update").put(isAuthenticateUser, updateProfile);

// Admin Routes
router
  .route("/admin/users")
  .get(isAuthenticateUser, authorisedRoles("admin"), getAllUsers);
router
  .route("/admin/user/:id")
  .get(isAuthenticateUser, authorisedRoles("admin"), getSpecificUser)
  .put(isAuthenticateUser, authorisedRoles("admin"), updateUser)
  .delete(isAuthenticateUser, authorisedRoles("admin"), deleteUser);
module.exports = router;
