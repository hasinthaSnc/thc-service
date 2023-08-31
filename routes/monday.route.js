const { Router } = require("express");
const mondayController = require("../controllers/monday.controller");
// init express router
const mondatRoute = Router();

mondatRoute.use("/monday", mondatRoute);
mondatRoute.post("/sync", mondayController.syncBoards);

module.exports = mondatRoute;
