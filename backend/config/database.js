const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((cor) =>
      console.log(`Database is connected in ${cor.connection.host}`)
    );
};

module.exports = connectDatabase;
