const { default: axios } = require("axios");
require('dotenv').config();

const getProductByIdInStore = async (id) => {
    const accessToken = process.env.SHOPIFY_TOKEN + "Test"
    console.log(accessToken)
    const productApiUrl = `https://the-lad-collective.myshopify.com/admin/api/2023-07/products/${id}.json`;
    try {
        const productResponse = await axios.get(productApiUrl, {
            headers: {
              "X-Shopify-Access-Token": accessToken,
              "Content-Type": "application/json",
            },
          });
  
      // console.log("PRODUCT LIST ------- ", productResponse.data);
  
      return productResponse.data;
    } catch (e) {
      throw e;
    }
  };
  
  module.exports = {
    getProductByIdInStore
  };