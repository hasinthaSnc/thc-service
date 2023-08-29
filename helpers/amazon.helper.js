const {
  AMAZON_STS_TOKEN_URL,
  IAM_ROLE_ARN,
  AMAZON_STS_ACCESS_KEY,
  AMAZON_STS_SECRET_KEY,
  AMAZON_TOKEN_URL,
  AMAZON_SA_ENDPOINT,
  MARKETPLACE_ID,
} = require("../config/const");

const { default: axios } = require("axios");
const qs = require("qs");
const AWS = require("aws-sdk");

const configureSDK = async () => {
  AWS.config.update({
    accessKeyId: AMAZON_STS_ACCESS_KEY,
    secretAccessKey: AMAZON_STS_SECRET_KEY,
    region: "us-east-1", // Replace with your desired region
  });
  const sts = new AWS.STS();

  // Parameters for AssumeRole
  const roleArn = IAM_ROLE_ARN; // Replace with your Role ARN
  const roleSessionName = "YourRoleSessionName"; // A name for the session
  const durationSeconds = 3600; // The duration of the temporary credentials

  const params = {
    RoleArn: roleArn,
    RoleSessionName: roleSessionName,
    DurationSeconds: durationSeconds,
  };
  try {
    // Assume the role
    const data = await sts.assumeRole(params).promise();

    // Construct and return the temporaryCredentials object
    const temporaryCredentials = {
      accessKeyId: data.Credentials.AccessKeyId,
      secretAccessKey: data.Credentials.SecretAccessKey,
      sessionToken: data.Credentials.SessionToken,
    };

    return temporaryCredentials;
  } catch (err) {
    console.error("Error assuming role:", err);
    throw err; // You can handle the error as needed
  }
};

const genarateAmazonToken = async () => {
  const url = AMAZON_TOKEN_URL;
  try {
    const formData = {
      grant_type: "refresh_token",
      refresh_token:
        "Atzr|IwEBINMKwVt_u_QQFWKIZ7iTIZCnsmW0p934IwkecqisW__lPdhLxX66Gb7HpyZArRdKXkFGoYvIVKxEaB4oscP924NcxJ85nGfH05daR8SdQnfdCILOq_c2a-puoAQrpuUPQEQCoOu2rAMZNPQI2_u6vV7hoO748Icjv5vka8Lfqjqgg70h_ZGmZHEk-hlt-oyLvs4Kq_MBSE1gEegRXcxrE7ZfTPp7xEbdExP_YJWwnVhidI8RkXPup6A_Hxjge31uVDmMocD2OP-KUGdYBBi4uprVmq9Sp-CKhwLJQx9kBc7_yAq1RFPZIIcLpKtmbLPV5yRDNOTcRzanqDoNb7mkM6eP",
      client_id:
        "amzn1.application-oa2-client.1a23257758e24b998423a5f72eb4e9dc",
      client_secret:
        "amzn1.oa2-cs.v1.f184f7286607b2087c22fd4b994467303f795a0df44b33eee92e81e2d1d02f9f",
      // Add more key-value pairs as needed
    };

    const tokenRes = await axios.post(url, qs.stringify(formData), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return tokenRes.data;
  } catch (e) {
    throw e;
  }
};

const getProductBySKU = async (sku, token) => {
  const queryParams = {
    details: true,
    granularityType: "Marketplace",
    granularityId: MARKETPLACE_ID,
    marketplaceIds: MARKETPLACE_ID,
    sellerSkus: sku,
  };

  const headerBody = {
    Accept: "application/json",
    "x-amz-access-token": token,
  };

  const endpointUrl = `${AMAZON_SA_ENDPOINT}/fba/inventory/v1/summaries`;

  try {
    const response = await axios.get(endpointUrl, {
      params: queryParams,
      headers: headerBody,
    });

    return response.data;
  } catch (e) {
    throw e;
  }
};

const createFulfillmentOrder = async (body, token) => {
  const headerBody = {
    Accept: "application/json",
    "x-amz-access-token": token,
  };

  const endpointUrl = `${AMAZON_SA_ENDPOINT}/fba/outbound/2020-07-01/fulfillmentOrders`;

  try {
    const response = await axios.post(endpointUrl, body, {
      headers: headerBody,
    });

    return response.data;
  } catch (e) {
    throw e;
  }
};
module.exports = {
  configureSDK,
  genarateAmazonToken,
  getProductBySKU,
  createFulfillmentOrder,
};
