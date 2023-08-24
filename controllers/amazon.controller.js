const { json } = require("body-parser");
const { createOrder } = require("../services/amazon.service");

const createMcfOrder = async (req, res, next) => {
  try {
      
    const credentials = await createOrder()
    res
    .status(200)
    .json({ response: credentials });
  return;
   } catch (e) {
     throw e;
   }
}

module.exports = {
    createMcfOrder,
  };