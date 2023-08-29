const { default: axios } = require("axios");
const { US_SHOPIFY_TOKEN, SHOPIFY_TOKEN } = require("../config/const");
require("dotenv").config();

const changeOrderFullfillmentStatus = async (store, id, fulfillmentStatus) => {
  const orderApiUrl = `https://${
    store == "us" ? "the-lad-collective-us-store" : "the-lad-collective"
  }.myshopify.com/admin/api/2023-07/fulfillments.json`;
  try {
    console.log(orderApiUrl);

    // const response = await axios.get(
    //   `https://the-lad-collective-us-store.myshopify.com/admin/api/2023-07/locations.json`,
    //   {
    //     headers: {
    //       "Content-Type": "application/json",
    //       "X-Shopify-Access-Token":
    //         store == "us"
    //           ? process.env.US_SHOPIFY_TOKEN
    //           : process.env.SHOPIFY_TOKEN,
    //     },
    //   }
    // );

    // console.log(response);

    const response = await axios.post(
      orderApiUrl,
      {
        "fulfillment": {
            "line_items_by_fulfillment_order": [
                {
                    "fulfillment_order_id": id
                }
            ],
            "tracking_info": {
                "number": "MS1562678",
                "url": "https://www.my-shipping-company.com?tracking_number=MS1562678"
            }
        }
    },
      {
        headers: {
          "X-Shopify-Access-Token":
            store == "us"
              ? process.env.US_SHOPIFY_TOKEN
              : process.env.SHOPIFY_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (e) {
    throw e;
  }
};

const getOrderList = async (store) => {
  const orderApiUrl = `https://${
    store == "us" ? "the-lad-collective-us-store" : "the-lad-collective"
  }.myshopify.com/admin/api/2023-07/orders.json`;
  try {
    console.log(orderApiUrl);
    const response = await axios.get(orderApiUrl, {
      headers: {
        "X-Shopify-Access-Token":
          store == "us"
            ? process.env.US_SHOPIFY_TOKEN
            : process.env.SHOPIFY_TOKEN,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (e) {
    throw e;
  }
};

const getOrderById = async (store, id) => {
  const orderApiUrl = `https://${
    store == "us" ? "the-lad-collective-us-store" : "the-lad-collective"
  }.myshopify.com/admin/api/2023-07/orders/${id}.json`;
  try {
    console.log(orderApiUrl);
    const response = await axios.get(orderApiUrl, {
      headers: {
        "X-Shopify-Access-Token":
          store == "us"
            ? process.env.US_SHOPIFY_TOKEN
            : process.env.SHOPIFY_TOKEN,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (e) {
    throw e;
  }
};
module.exports = {
  changeOrderFullfillmentStatus,
  getOrderById,
  getOrderList,
};
