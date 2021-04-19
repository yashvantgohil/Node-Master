const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { User } = require("../model/user");
const bcrypt = require("bcrypt");
const _ = require("lodash");

//POST : api/auth
router.post("/", async (req, res) => {
  try {
    console.log(req.body);
    const { error } = validate(req.body);
    console.log(error);
    if (error)
      return res
        .status(400)
        .send(error.details.map((x) => x.message).join("\n"));

    let user = await User.findOne({ email: req.body.email });
    console.log(user);
    if (!user) return res.status(400).send("Invalid email or password");

    //hashing password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    console.log(validPassword);
    if (!validPassword)
      return res.status(400).send("Invalid email or password");

    const token = user.generateAuthToken();
    return res.send(token);
  } catch (error) {
    return res.status(500).send(error);
  }
});

const validate = (req) => {
  const loginSchema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return loginSchema.validate(req, { abortEarly: false });
};

module.exports = router;
