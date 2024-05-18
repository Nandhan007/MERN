const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Enter Product name"],
    trim: true,
    maxLength: [100, "Product name cannot exceeds 100"],
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  description: {
    type: String,
    required: [true, "Enter Product description"],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  images: [
    {
      image: {
        type: String,
        required: [true, "Enter Product image details"],
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Please enter Product categories"],
    enum: {
      values: [
        "Electronics",
        "Headphones",
        "Accessories",
        "MobilePhones",
        "Laptops",
        "Foods",
        "Books",
        "Clothes/Shoes",
        "Beauty/Health",
        "Sports",
        "Outdoor",
        "Home",
      ],
      message: "Please select correct category",
    },
  },
  seller: {
    type: String,
    required: [true, "Enter Seller Details"],
  },
  stock: {
    type: Number,
    required: [true, "Please enter Product stock"],
    maxLength: [20, "Product stock cannot exceeds 20"],
  },
  numofReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: mongoose.Schema.Types.ObjectId,
      rating: {
        type: Number,
        required: true,
      },
      comments: {
        type: String,
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

let ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;
