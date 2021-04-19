const config = require("config");

module.exports = function () {
  if (!config.get("jwtPrivateKey")) {
    throw new Error("jwtPrivateKey ENV is not set");
  }
};
