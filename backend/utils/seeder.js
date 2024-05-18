const ProductModel = require("../models/productModels");
const Products = require("../data/product.json");
const dotenv = require("dotenv");
const connectDatabase = require("../config/database");
dotenv.config({ path: "backend/config/config.env" });
connectDatabase();

const seedingData = async () => {
  try {
    await ProductModel.deleteMany();
    console.log("All Product are deleted");
    await ProductModel.insertMany(Products);
    console.log("All Products are inserted successfully");
  } catch (err) {
    console.log(err.message);
  } finally {
    process.exit();
  }
};

seedingData();
