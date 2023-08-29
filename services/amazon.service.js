const {
  AMAZON_STS_TOKEN_URL,
  IAM_ROLE_ARN,
  AMAZON_STS_ACCESS_KEY,
  AMAZON_STS_SECRET_KEY,
  MARKETPLACE_ID,
  STRINGS,
} = require("../config/const");
const {
  configureSDK,
  genarateAmazonToken,
  getProductBySKU,
  createFulfillmentOrder,
} = require("../helpers/amazon.helper");
const AWS = require("aws-sdk");
const { logger } = require("../helpers/logger.helper");
var moment = require("moment");
const { sendAmazonAlertEmail } = require("../helpers/email.helper");

const createOrder = async (requestBody) => {
  const orderNumber = `#${requestBody?.order_number}`;
  const orderId = requestBody.id;
  const shippingAddress = {
    name: requestBody.shipping_address?.name,
    addressLine1: requestBody.shipping_address?.address1,
    addressLine2: requestBody.shipping_address?.address2,
    city: requestBody.shipping_address?.city,
    districtOrCounty: requestBody.shipping_address?.country,
    stateOrRegion: requestBody.shipping_address?.province_code,
    postalCode: requestBody.shipping_address?.zip,
    countryCode: requestBody.shipping_address?.country_code,
    phone: requestBody.shipping_address?.phone,
  };
  const requestedProducts = requestBody.line_items;
  const customerEmail = requestBody.customer?.email;

  try {
    // const shippingAddress = {
    //     "name": "Hasintha",
    //     "addressLine1": "112",
    //     "city": "AUSTIN",
    //     "stateOrRegion": "TX",
    //     "postalCode": "78703-4985",
    //     "countryCode": "US",
    //     "phone": "4314098930044"
    // }

    // const requestedProducts = [
    //     {
    //         sku: "TLC20-K-MM-SS",
    //         qty: 1
    //     },
    //     {
    //         sku: "TLC20-K-BB-SS",
    //         qty: 2
    //     }
    // ]

    const token = await genarateAmazonToken();

    const skuList = requestedProducts.map((product) => product.sku).join(",");

    const product = await getProductBySKU(skuList, token?.access_token);

    if (
      product.payload.inventorySummaries.length == 0 ||
      product.payload.inventorySummaries.length != requestedProducts.length
    ) {
      sendAmazonAlertEmail(
        orderId,
        orderNumber,
        STRINGS.EMAIL_MSG_NO_SKU_AVAILABLE
      );
      return {
        code: 400,
        message: "No Product Available for the SKUs",
        data: null,
      };
    }

    const lineItems = requestedProducts.map((product, key) => {
      return {
        sellerSku: product.sku,
        quantity: product.quantity,
        sellerFulfillmentOrderItemId: `${orderNumber}-${key}`,
        shippingSpeedCategories: ["Standard"],
        perUnitDeclaredValue: {
          value: product.price,
          currencyCode: product?.price_set?.presentment_money?.currency_code || "USD"
        },
      };
    });

    const orderBody = {
      marketplaceId: MARKETPLACE_ID,
      sellerFulfillmentOrderId: orderNumber,
      displayableOrderId: orderNumber,
      displayableOrderDate: moment(new Date()).format("YYYY-MM-DD"),
      displayableOrderComment: "Thank you for your order!",
      shippingSpeedCategory: "Standard",
      destinationAddress: shippingAddress,
      fulfillmentAction: "Hold",
      items: lineItems,
      notificationEmails: [customerEmail],
    };

    const response = await createFulfillmentOrder(
      orderBody,
      token?.access_token
    );

    return {
      code: 201,
      message: orderNumber + " Order Created",
      data: orderBody,
      amazonResponse: response,
    };
  } catch (e) {
    sendAmazonAlertEmail(orderId, orderNumber, STRINGS.EMAIL_MSG_SERVER_ERROR);
    throw e;
  }
};

module.exports = {
  createOrder,
};
