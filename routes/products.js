const express = require("express");
const router = express.Router();
const { Product, validateProduct } = require("./../model/Product");
const auth = require("./../middleware/auth");
const admin = require("./../middleware/admin");

router.get("/", (req, res) => {
  Product.find()
    .then((products) => res.send(products))
    .catch((err) => res.status(404).send(err.message));
});

// for routes looking like this `api/products/1`
router.get("/:id", (req, res) => {
  Product.findById(req.params.id)
    .then((product) =>
      product
        ? res.send(product)
        : res.status(404).send("requested id not found")
    )
    .catch((err) => res.status(404).send(err.message));
});

// to create new product
router.post("/", [auth], (req, res) => {
  const product = {
    name: req.body.name,
    price: req.body.price,
  };
  const { error } = validateProduct(product);
  if (error)
    return res.status(400).send(error.details.map((x) => x.message).join("\n"));

  Product.create(product, (err, product) => {
    if (err) return res.send(err.message);
    res.send(product);
  });
});

//update product
router.put("/:id", [auth], (req, res) => {
  let product = Product.findById(req.params.id);
  if (!product) return res.status(404).send("product with given id not found");

  const { error } = validateProduct({ ...product, ...req.body });
  if (error)
    return res.status(400).send(error.details.map((x) => x.message).join("\n"));

  Product.findOneAndUpdate(
    id,
    {
      $set: { ...req.body },
    },
    { new: true }
  )
    .then((product) => res.send(product))
    .catch((err) => res.status(400).send(err.message));
});

//delete product
router.delete("/:id", [auth, admin], (req, res) => {
  Product.findById(req.params.id)
    .then((product) => {
      Product.findByIdAndRemove(product._id)
        .then((product) => res.send(product))
        .catch((err) => res.status(400).send(err.message));
    })
    .catch((err) => res.status(404).send(err.message));
});

module.exports = router;
