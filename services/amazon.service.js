const { AMAZON_STS_TOKEN_URL, IAM_ROLE_ARN, AMAZON_STS_ACCESS_KEY, AMAZON_STS_SECRET_KEY } = require("../config/const");
const { configureSDK,genarateAmazonToken } = require("../helpers/amazon.helper");
const AWS = require("aws-sdk");
const { logger } = require("../helpers/logger.helper");

const createOrder = async () => {
    try {
      
     const credentials = await configureSDK()
     const token = await genarateAmazonToken()
     logger.info("Genarated")
      return {credentials, token}
    } catch (e) {
      throw e;
    }
}

module.exports = {
    createOrder,
  };