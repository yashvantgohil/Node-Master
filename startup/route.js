require("express-async-errors"); //it will handle all http errors and call error middlaware
const express = require("express");
const morgan = require("morgan");
const config = require("config");
const winston = require("winston");
const helmet = require("helmet");
const productsRoutes = require("../routes/products");
const homeRoutes = require("../routes/home");
const userRoutes = require("../routes/user");
const authRoutes = require("../routes/auth");
const error = require("../middleware/error");

module.exports = function (app) {
  app.use(express.json()); //it will set req.body = json object if any
  app.use(express.urlencoded({ extended: true })); //it will parse form object as request which will have key-value pair as body (x-form-urlencoded)
  app.use(express.static("public")); //to server (root) static files eg. localhost:4040/readme.txt
  app.use(helmet()); //to protect http request

  winston.info(`NODE_ENV: ${process.env.NODE_ENV}`); //here we haven't set any var yet so will give undefined
  winston.info(`app setting: ${app.get("env")} `); //it will return development if NODE_ENV not set

  if (app.get("env") === "development") {
    // morgon log types : dev tiny short combined common
    app.use(morgan("dev")); //short and pertty http req console logger
    winston.info("morgan logger is enabled...");
  }

  //cofig settings
  winston.info(`app name : ${config.get("name")}`);
  winston.info(`mail server : ${config.get("mail.host")}`);

  // seting to pug | by default for files it looks into app.set('views','./views');
  app.set("view engine", "pug");

  app.use("/", homeRoutes);
  app.use("/api/products", productsRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/auth", authRoutes);
  app.use(error);
};
