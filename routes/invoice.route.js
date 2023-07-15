const { Router } = require("express");
const invoiceController = require("../controllers/invoice.controller");
// init express router
const invoiceRoute = Router();

invoiceRoute.use("/invoice", invoiceRoute);
invoiceRoute.post("/", invoiceController.createInvoice);

module.exports = invoiceRoute;
