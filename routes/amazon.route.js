const { Router } = require("express");
const amazonController = require("../controllers/amazon.controller");
// init express router
const amazoneRoute = Router();

amazoneRoute.use("/amazon", amazoneRoute);
amazoneRoute.post("/createOrder", amazonController.createMcfOrder);

module.exports = amazoneRoute;
