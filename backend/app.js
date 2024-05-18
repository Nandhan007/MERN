const express = require("express");
const app = express();
const products = require("./routes/product.js");
const error = require("./middlewares/error.js");
const auth = require("./routes/auth.js");
const cookieParser = require("cookie-parser");
const order = require("./routes/order.js");

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/", products);
app.use("/api/v1/", auth);
app.use("/api/v1/", order);
app.use(error);

module.exports = app;
