const mongoose = require("mongoose");
const winston = require("winston");

module.exports = function (connectionString) {
  mongoose
    .connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    .then(() => winston.info("mongodb connected"));
  // .catch((err) => console.log("err", err)); // it will get handled and logged anyway
};
