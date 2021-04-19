const express = require("express");
const router = express.Router();
const { User, validateUser } = require("../model/user");
const _ = require("lodash");
const bcrypt = require("bcrypt");

//GET: api/users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    return res.send(users);
  } catch (error) {
    return res.status(500).send(error);
  }
});

//POST : api/users
router.post("/", async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error)
      return res
        .status(400)
        .send(error.details.map((x) => x.message).join("\n"));

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("email id is already available");

    //hashing password
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    user = new User(_.pick(req.body, ["name", "email", "password"]));

    await user.save();

    const token = user.generateAuthToken();
    return res.header("x-auth-token", token).send(user);
  } catch (error) {
    return res.status(500).send(error);
  }
});

module.exports = router;
