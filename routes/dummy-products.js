const express = require("express");
const router = express.Router();

//initial data
const products = [
  { id: 1, name: "mouse", price: 30 },
  { id: 2, name: "keyboard", price: 50 },
  { id: 3, name: "RAM", price: 80 },
];

// for routes looking like this `api/products?page=1&pageSize=50`
router.get("/", (req, res) => {
  const page = req.query.page;
  const pageSize = req.query.pageSize;
  if (!(page && pageSize)) return res.send(products);
  const totalNumOfProducts = products.length;
  const to = pageSize * page;
  const from = to - pageSize;
  const filteredProducts =
    totalNumOfProducts < pageSize ? products : products.slice(from, to);
  res.send(filteredProducts);
});

// for routes looking like this `api/products/1`
router.get("/:id", (req, res) => {
  const product = products.find((x) => x.id === Number(req.params.id));
  if (!product) return res.status(404).send("product with given id not found");
  res.send(product);
});

// to create new product
router.post("/", function (req, res) {
  const product = {
    id: products.length + 1,
    name: req.body.name,
    price: req.body.price,
  };
  const { error } = validateProduct(product);
  if (error)
    return res.status(400).send(error.details.map((x) => x.message).join("\n"));
  products.push(product);
  res.send(product);
});

//update product
router.put("/:id", function (req, res) {
  let product = products.find((x) => x.id === Number(req.params.id));
  if (!product) return res.status(404).send("product with given id not found");

  const { error } = validateProduct({ ...req.body });
  console.log(error);
  if (error)
    return res.status(400).send(error.details.map((x) => x.message).join("\n"));

  const index = products.findIndex((x) => x.id === Number(product.id));
  //   const index = products.indexOf(product); //alternative
  product = { ...product, ...req.body };
  products[index] = product;
  res.send(product);
});

router.delete("/:id", function (req, res) {
  let product = products.find((x) => x.id === Number(req.params.id));
  if (!product) return res.status(404).send("product with given id not found");

  const index = products.indexOf(product);
  products.splice(index, 1);
  res.send(product);
});

module.exports = router;

const validateProduct = (product) => {
  const productSchema = Joi.object({
    id: Joi.number().required(),
    name: Joi.string().required(),
    price: Joi.number().required(),
  });
  return productSchema.validate(product, { abortEarly: false });
};
