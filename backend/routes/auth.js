const express = require("express");
const multer = require("multer");
const path = require("path");

const uploads = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "..", "uploads/user"));
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});

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

router.route("/register").post(uploads.single("avatar"), registerUser);
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
