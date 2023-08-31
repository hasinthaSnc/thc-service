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
const { getItemList, createItem } = require("../helpers/monday.helper");
  
  const syncBoard = async (requestBody) => {
  
    try {
       const data = await createItem(requestBody)

       return {
        code: 200,
        data: data
       }
    } catch (e) {
      throw e;
    }
  };
  
  module.exports = {
    syncBoard,
  };
  