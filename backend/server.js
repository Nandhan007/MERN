const dotenv = require("dotenv");
const app = require("./app");
const path = require("path");
const connectDatabase = require("./config/database");

dotenv.config({
  path: path.join(__dirname, "config/config.env"),
});

connectDatabase();

const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server is running in the port ${process.env.PORT} in ${process.env.NODE_ENV}`
  );
});

process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to unhandledRejection");
  server.close(() => {
    process.exit();
  });
});

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to uncaughtException");
  server.close(() => {
    process.exit();
  });
});
