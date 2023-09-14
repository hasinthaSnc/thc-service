const { default: axios } = require("axios");
require("dotenv").config();

const getProductByIdInStore = async (id) => {
  const accessToken = process.env.SHOPIFY_TOKEN;
  console.log(accessToken);
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

const updateProductInventoryLevels = async (data) => {
  const accessToken = process.env.SHOPIFY_TOKEN;
  const requestData = data;
  const productApiUrl =
    "https://the-lad-collective.myshopify.com/admin/api/2023-07/inventory_levels/set.json";
  console.log(data.inventory_item_id);
  try {
    const updateResponse = await axios.post(productApiUrl, requestData, {
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
    });
    console.log(updateResponse.data);
  } catch (e) {
    console.log(e.response);
    throw e;
  }
};

const getLocationDetails = async () => {
  const accessToken = process.env.SHOPIFY_TOKEN;
  const locationApiUrl =
    "https://the-lad-collective.myshopify.com/admin/api/2023-07/locations.json";
  try {
    const locationResponse = await axios.get(locationApiUrl, {
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
    });
    return locationResponse.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

const syncProductsOtherProductsWithTLC = async () => {
  const accessToken = process.env.SHOPIFY_TOKEN;
  const productApiUrl = `https://the-lad-collective.myshopify.com/admin/api/2023-07/products/7240175517743.json`;
  try {
    const productResponse = await axios.get(productApiUrl, {
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
    });

    const productsResponse = await axios.get(
      "https://the-lad-collective.myshopify.com/admin/api/2023-07/products.json",
      {
        headers: {
          "X-Shopify-Access-Token": process.env.SHOPIFY_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    const locationData = await getLocationDetails();
    const locationId = locationData?.locations[0]?.id;
    console.log("CALLED")

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    async function updateInventoryWithDelay() {
      for (const element of productResponse.data.product.variants) {
        for (const item of productsResponse.data.products) {
          for (const variantItem of item.variants) {
            if (
              element.sku == variantItem.sku &&
              element.inventory_quantity != variantItem.inventory_quantity
            ) {
              console.log(
                "Need to change : " +
                  element.sku +
                  " " +
                  element.title +
                  " old qty:" +
                  variantItem.inventory_quantity +
                  " new qty:" +
                  element.inventory_quantity +
                  " VID:" +
                  variantItem.id +
                  " ID:" +
                  variantItem.product_id +
                  " inv ID:" +
                  variantItem.inventory_item_id
              );
              await updateProductInventoryLevels({
                inventory_item_id: variantItem.inventory_item_id,
                location_id: locationId,
                available: Number(element.inventory_quantity),
              });

              // Introduce a 1-second delay before the next iteration
              await delay(1000);
            }
          }
        }
      }
    }

    // Call the function to start the process with a 1-second delay
    updateInventoryWithDelay();
    // return productResponse.data;
  } catch (e) {
    throw e;
  }
};

const getTLCProductDetails = async () => {
  const accessToken = process.env.SHOPIFY_TOKEN;
  const productTLCApiUrl = `https://the-lad-collective.myshopify.com/admin/api/2023-07/products/7240175517743.json`;
  try {
    const productResponse = await axios.get(productTLCApiUrl, {
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
    });

    return productResponse.data
  } catch (e) {
    throw e
  }
}

const syncProductWithTLC = async (tlcdata, sku, qty) => {


  try {

    console.log(tlcdata.product)

    const productsResponse = await axios.get(
      "https://the-lad-collective.myshopify.com/admin/api/2023-07/products.json",
      {
        headers: {
          "X-Shopify-Access-Token": process.env.SHOPIFY_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    const locationData = await getLocationDetails();
    const locationId = locationData?.locations[0]?.id;

    tlcdata.product.variants.forEach(async tlcVariant => {
      if(tlcVariant.sku == sku) {
        console.log(tlcVariant)
        await updateProductInventoryLevels({
          inventory_item_id: tlcVariant.inventory_item_id,
          location_id: locationId,
          available: Number(tlcVariant.inventory_quantity - Number(qty)),
        });
      }
    });

 
   
  } catch (e) {
    throw e
  }
}

module.exports = {
  getProductByIdInStore,
  syncProductsOtherProductsWithTLC,
  getTLCProductDetails,
  syncProductWithTLC
};
