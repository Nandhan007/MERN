const express = require("express");
const app = express();
const products = require("./routes/product.js");
const error = require("./middlewares/error.js");
const auth = require("./routes/auth.js");
const cookieParser = require("cookie-parser");
const order = require("./routes/order.js");
const cors = require("cors");
const path = require("path");
const payment = require("./routes/payment.js");

app.use(
  cors({
    origin: "https://mern-wepapp-project.netlify.app",
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/v1/", products);
app.use("/api/v1/", auth);
app.use("/api/v1/", order);
app.use("/api/v1/", payment);
app.use(error);

module.exports = app;
