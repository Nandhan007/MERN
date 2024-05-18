const express = require("express");
const {
  isAuthenticateUser,
  authorisedRoles,
} = require("../middlewares/authentication");
const {
  newOrder,
  getSingleOrder,
  myOrders,
  orders,
  UpdateOrder,
  DeleteOrder,
  createReview,
} = require("../controllers/orderController");
const router = express.Router();

router.route("/order/new").post(isAuthenticateUser, newOrder);
router.route("/order/:id").get(isAuthenticateUser, getSingleOrder);
router.route("/myorders").get(isAuthenticateUser, myOrders);

// Admin Routes
router
  .route("/orders")
  .get(isAuthenticateUser, authorisedRoles("admin"), orders);

router
  .route("/orders/:id")
  .post(isAuthenticateUser, authorisedRoles("admin"), UpdateOrder)
  .delete(isAuthenticateUser, authorisedRoles("admin"), DeleteOrder);
module.exports = router;
