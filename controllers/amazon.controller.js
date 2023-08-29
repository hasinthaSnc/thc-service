const { json } = require("body-parser");
const { createOrder } = require("../services/amazon.service");

const createMcfOrder = async (req, res, next) => {
  try {
    const body = req.body;
    const response = await createOrder(body);
    res.status(response.code).json(response);
    return;
  } catch (e) {
    res.status(e.response?.status).json(e.response?.data);
  }
};

module.exports = {
  createMcfOrder,
};
