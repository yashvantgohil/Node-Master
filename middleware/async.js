const { route } = require("../routes/products");

const asyncErrorMiddleware = (handler) => {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (error) {
      next(error); //this will get passed in app.use(error) middlware
    }
  };
};

module.exports = asyncErrorMiddleware;

//================ how to use  =======
// need to wrap every route with this middleware like this
// router.get("/", asyncErrorMiddleware( (req, res) => {
//     Product.find()
//       .then((products) => res.send(products))
//       .catch((err) => res.status(404).send(err.message));
//   }) );
