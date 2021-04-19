const mongoose = require("mongoose");
const { Schema } = mongoose;
const Joi = require("joi");

const productSchema = new Schema({
  name: { type: String, required: true }, // String is shorthand for {type: String}
  price: {
    type: Number,
    required: true,
    validate: {
      validator: () => Promise.resolve(true),
      message: "Email validation failed",
    },
    get: (p) => Number(p.trim()),
    set: (p) => Number(p.trim()),
  },
});

const Product = mongoose.model("Products", productSchema);

const validateProduct = (product) => {
  const productSchema = Joi.object({
    id: Joi.number().required(),
    name: Joi.string().required(),
    price: Joi.number().required(),
  });
  return productSchema.validate(product, { abortEarly: false });
};

module.exports.Product = Product;
module.exports.validateProduct = validateProduct;
