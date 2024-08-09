const { Router } = require("express");
const orderController = require("../controllers/order.controller");
// init express router
const orderRoute = Router();

orderRoute.use("/order", orderRoute);
orderRoute.post("/create", orderController.createTestOrder);

module.exports = orderRoute;
