const { syncProductsOtherProductsWithTLC, getTLCProductDetails, syncProductWithTLC } = require("../helpers/products.helper");

const syncProductWithOrder = async (requestBody) => {
    try {
        const tlcData = await getTLCProductDetails()
        requestBody.line_items.forEach(element => {
            if(element.product_id == 7240175517743) {
                syncProductsOtherProductsWithTLC()
            } else {
                syncProductWithTLC(tlcData, element.sku, element.quantity)
            }
        });
  
      return {
        code: 200,
        data: null,
      };
    } catch (e) {
      throw e;
    }
  };

module.exports = {
    syncProductWithOrder,
  };
  