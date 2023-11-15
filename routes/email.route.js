const { Router } = require("express");
const emailController = require("../controllers/email.controller");
// init express router
const emailRoute = Router();

emailRoute.use("/email", emailRoute);
emailRoute.post("/inquiry", emailController.sendInquiries);

module.exports = emailRoute;
