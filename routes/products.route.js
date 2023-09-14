const { Router } = require("express");
const productController = require("../controllers/product.controller");
// init express router
const productRoute = Router();

productRoute.use("/product", productRoute);
productRoute.post("/sync", productController.syncProducts);
productRoute.post("/sync-order", productController.syncProductsWithOrder);

module.exports = productRoute;
