const { createOrderShopify } = require("../services/order.service");


const createOrder = async (req, res, next) => {
    try {
      const body = req.body
      const response = await syncBoard(body);
      res.status(response.code).json(response);
      return;
    } catch (e) {
      logger.error(JSON.stringify(e))
      res.status(e.response?.status).json(e.response?.data);
    }
  };

  const createTestOrder = async (req, res, next) => {
    try {
      const response = await createOrderShopify();
      res.status(response.code).json(response);
      return;
    } catch (e) {
      logger.error(JSON.stringify(e))
      res.status(e.response?.status).json(e.response?.data);
    }
  };
  

  module.exports = {
    createOrder,
    createTestOrder
  };