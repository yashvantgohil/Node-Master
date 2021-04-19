const { Schema, model } = require("mongoose");
const Joi = require("joi");
const config = require("config");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: Boolean,
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    _.pick(this, ["_id", "email", "password", "isAdmin"]),
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = model("Users", userSchema);

const validateUser = (user) => {
  const userSchema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return userSchema.validate(user, { abortEarly: false });
};

module.exports.validateUser = validateUser;
module.exports.User = User;
