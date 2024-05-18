const catchAsynError = require("../middlewares/catchAsynError");
const Order = require("../models/order");
const ProductModel = require("../models/productModels");
const ErrorHandler = require("../utils/ErrorHandler");

exports.newOrder = catchAsynError(async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    itemsprice,
    taxprice,
    shippingprice,
    totalprice,
    paymentInfo,
  } = req.body;

  const order = await Order.create({
    orderItems,
    shippingInfo,
    itemsprice,
    taxprice,
    shippingprice,
    totalprice,
    paymentInfo,
    paidAt: Date.now(),
    user: req.user.id,
  });

  res.status(200).json({
    success: true,
    order,
  });
});

exports.getSingleOrder = catchAsynError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) {
    return new ErrorHandler(
      `Order not found with this id ${req.params.id}`,
      404
    );
  }
  res.status(200).json({
    success: true,
    order,
  });
});

exports.myOrders = catchAsynError(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id });
  if (!orders) {
    return new ErrorHandler(
      `Orders not found with this id ${req.params.id}`,
      404
    );
  }
  res.status(200).json({
    success: true,
    orders,
  });
});

// Admin
// Get all ORders
exports.orders = catchAsynError(async (req, res, next) => {
  const orders = await Order.find();
  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalprice;
  });
  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

// Update / order status
exports.UpdateOrder = catchAsynError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (order.orderStatus == "Delivered") {
    return next(new ErrorHandler("Order has been already Delivered", 400));
  }
  order.orderItems.forEach(async (orderItem) => {
    await updateStock(orderItem.product, orderItem.quantity);
  });
  order.orderStatus = req.body.orderStatus;
  order.deliveredAt = Date.now();
  await order.save();
  res.status(200).json({
    sucess: true,
    message: "Order Details Updated",
  });
});

async function updateStock(productId, quantity) {
  const product = await ProductModel.findById(productId);
  product.stock = product.stock - quantity;
  product.save({ validateBeforeSave: false });
}

exports.DeleteOrder = catchAsynError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ErrorHandler("Order not found", 400));
  }
  await Order.findByIdAndDelete(req.params.id, order);
  res.status(200).json({
    success: true,
    Message: "Order successfully Deleted",
  });
});


