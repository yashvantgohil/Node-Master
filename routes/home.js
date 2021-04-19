const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", {
    title: "express-demo app",
    message: "this html render using pug",
  });
});

module.exports = router;
