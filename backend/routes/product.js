const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  getProducts,
  newProducts,
  getSingleProduct,
  UpdateProduct,
  deleteProduct,
  createReview,
  getReviews,
  deleteReview,
  getAdminProducts,
} = require("../controllers/productControllers.js");
const router = express.Router();
const {
  isAuthenticateUser,
  authorisedRoles,
} = require("../middlewares/authentication.js");

const uploads = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "..", "uploads/product"));
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});

router.route("/products").get(getProducts);
router.route("/products/:id").get(getSingleProduct);

// Admin Routes
router
  .route("/admin/products/new")
  .post(
    isAuthenticateUser,
    authorisedRoles("admin"),
    uploads.array("images"),
    newProducts
  );
router
  .route("/admin/product/:id")
  .delete(isAuthenticateUser, authorisedRoles("admin"), deleteProduct)
  .put(
    isAuthenticateUser,
    authorisedRoles("admin"),
    uploads.array("images"),
    UpdateProduct
  );
router
  .route("/admin/products")
  .get(isAuthenticateUser, authorisedRoles("admin"), getAdminProducts);

router.route("/review/new").put(isAuthenticateUser, createReview);
router
  .route("/admin/getreviews")
  .get(isAuthenticateUser, authorisedRoles("admin"), getReviews);
router
  .route("/admin/review/delete")
  .delete(isAuthenticateUser, authorisedRoles("admin"), deleteReview);

module.exports = router;
