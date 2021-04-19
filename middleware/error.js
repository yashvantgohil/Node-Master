const winston = require("winston");

const error = (err, req, res, next) => {
  winston.error(err.message, err);
  res.status(500).send("Something failed");
};

module.exports = error;
