const winston = require("winston");
require("winston-mongodb");

module.exports = function (connectionString) {
  // handling uncaughtException
  process.on("uncaughtException", (err) => {
    winston.error(err.message, err);
  });

  // handling promiseRejection
  process.on("unhandledRejection", (err) => {
    winston.error(err.message, err);
  });

  winston.add(winston.transports.File, { filename: "error.log" });

  winston.add(winston.transports.MongoDB, {
    db: connectionString,
    level: "error",
  });
};
