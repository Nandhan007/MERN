const ProductModel = require("../models/productModels");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("../middlewares/catchAsynError");
const apiFeatures = require("../utils/apiFeatures");

exports.getProducts = async (req, res, next) => {
  const resPerPage = 2;
  const ApiFeatures = new apiFeatures(ProductModel.find(), req.query)
    .search()
    .filter()
    .pagination(resPerPage);
  const product = await ApiFeatures.query;
  console.log(product);
  res.status(200).json({
    success: true,
    count: product.length,
    product,
  });
};

exports.newProducts = catchAsyncError(async (req, res, next) => {
  req.body.user = req.user.id;
  const product = await ProductModel.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

exports.getSingleProduct = async (req, res, next) => {
  const product = await ProductModel.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 400));
    // return res.status(404).json({
    //   success: false,
    //   message: "Product not found",
    // });
  }
  res.status(200).json({
    success: true,
    product,
  });
};

exports.UpdateProduct = async (req, res, next) => {
  let product = await ProductModel.findById(req.params.id);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }
  product = await ProductModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    product,
  });
};

exports.deleteProduct = async (req, res, next) => {
  const product = await ProductModel.findById(req.params.id);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }
  await ProductModel.findByIdAndDelete(req.params.id, product);
  res.status(200).json({
    success: true,
    message: "Product Deleted successfully",
  });
};

// Review Created
exports.createReview = catchAsyncError(async (req, res, next) => {
  const { productId, rating, comments } = req.body;

  const Review = {
    user: req.user.id,
    rating,
    comments,
  };

  const product = await ProductModel.findById(productId);

  const isReviewed = product.reviews.find((review) => {
    return review.user.toString() == req.user.id.toString();
  });

  if (isReviewed) {
    product.reviews.forEach((review) => {
      if (review.user.toString() == req.user.id.toString()) {
        review.comments = comments;
        review.rating = rating;
      }
    });
  } else {
    product.reviews.push(Review);
    product.numofReviews = product.reviews.length;
  }

  product.ratings =
    product.reviews.reduce((acc, review) => {
      return review.rating + acc;
    }, 0) / product.reviews.length;

  product.ratings = isNaN(product.ratings) ? 0 : product.ratings;

  product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Review Created",
  });
});

exports.getReviews = catchAsyncError(async (req, res, next) => {
  const product = await ProductModel.findById(req.query.id);
  res.status(200).json({
    success: true,
    Reviews: product.reviews,
  });
});

exports.deleteReview = catchAsyncError(async (req, res, next) => {
  const product = await ProductModel.findById(req.query.productId);

  let reviews = product.reviews.filter((review) => {
    return review._id.toString() !== req.query.id.toString();
  });
  let numofReviews = reviews.length;
  let ratings =
    reviews.reduce((acc, review) => {
      return review.rating + acc;
    }, 0) / reviews.length;

  ratings = isNaN(ratings) ? 0 : ratings;

  await ProductModel.findByIdAndUpdate(req.query.productId, {
    ratings,
    numofReviews,
    reviews,
  });

  res.status(200).json({
    success: true,
  });
});
