const { default: axios } = require("axios");

const getProductByIdInStore = async (id) => {
    const accessToken = "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"
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