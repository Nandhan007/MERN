const express = require("express");
const {
  getProducts,
  newProducts,
  getSingleProduct,
  UpdateProduct,
  deleteProduct,
  createReview,
  getReviews,
  deleteReview,
} = require("../controllers/productControllers.js");
const router = express.Router();
const {
  isAuthenticateUser,
  authorisedRoles,
} = require("../middlewares/authentication.js");

router.route("/products").get(getProducts);
router
  .route("/products/:id")
  .get(getSingleProduct)
  .put(UpdateProduct)
  .delete(deleteProduct);

// Admin Routes
router
  .route("/admin/products/new")
  .post(isAuthenticateUser, authorisedRoles("admin"), newProducts);

router.route("/review/new").put(isAuthenticateUser, createReview);
router.route("/getreviews").get(getReviews);
router.route("/review/delete").delete(deleteReview);

module.exports = router;
