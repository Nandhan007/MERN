const express = require("express");
const { isAuthenticateUser } = require("../middlewares/authentication");
const {
  processPayment,
  sendStripeAPi,
} = require("../controllers/paymentController");
const router = express.Router();

router.route("/payment/process").post(isAuthenticateUser, processPayment);
router.route("/stripeapi").get(isAuthenticateUser, sendStripeAPi);
module.exports = router;
