require('dotenv').config();

const SHOPIFY_TOKEN = process.env.SHOPIFY_TOKEN
const US_SHOPIFY_TOKEN = process.env.US_SHOPIFY_TOKEN
const EMAIL = process.env.EMAIL
const EMAIL_PASS = process.env.EMAIL_PASS
const IAM_ROLE_ARN = process.env.IAM_ROLE_ARN
const AMAZON_STS_TOKEN_URL = process.env.AMAZON_STS_TOKEN_URL
const AMAZON_STS_ACCESS_KEY = process.env.AMAZON_STS_ACCESS_KEY
const AMAZON_STS_SECRET_KEY = process.env.AMAZON_STS_SECRET_KEY
const AMAZON_TOKEN_URL = process.env.AMAZON_TOKEN_URL
const AMAZON_SA_ENDPOINT = process.env.AMAZON_SA_ENDPOINT
const MARKETPLACE_ID = process.env.MARKETPLACE_ID

const STRINGS = {
    EMAIL_MSG_NO_SKU_AVAILABLE: 'The fulfillment of this order within Amazon Seller Central has encountered an issue due to the absence of corresponding Shopify product SKUs in the Amazon Seller Central inventory. This disparity in SKUs between the two platforms has led to the current fulfillment shortfall',
    EMAIL_MSG_SERVER_ERROR: 'the fulfillment of this order through Amazon Seller Central is currently impeded due to a server error. This has resulted in the unavailability of Shopify product SKUs within the Amazon Seller Central system, contributing to the existing fulfillment challenge.'
}

const sampleData = {
    mondatData: [
        {
          "PO Number": 42542,
          "Product Name/ID": "Test",
          "Stage": "Test",
          "Start Date": "2023-08-31",
          "Expected Completion Date": "2023-08-31",
          "Actual Completion Date": "2023-08-31",
          "Status": "Test",
          "Notes/Comments": "Test",
          "Materials/Colorways": "Test",
          "Invoice/Quotation Details": "Test"
        },
        {
          "PO Number": 21314,
          "Product Name/ID": "Test",
          "Stage": "Test",
          "Start Date": "2023-08-31",
          "Expected Completion Date": "2023-08-31",
          "Actual Completion Date": "2023-08-31",
          "Status": "Pass",
          "Notes/Comments": "Test",
          "Materials/Colorways": "Test",
          "Invoice/Quotation Details": "Test"
        },
        {
          "PO Number": "Ref9210",
          "Product Name/ID": "Name changed",
          "Stage": "Weving",
          "Start Date": "2023-08-31",
          "Expected Completion Date": "2023-08-31",
          "Actual Completion Date": "2023-08-31",
          "Status": "Pass",
          "Notes/Comments": "No notes",
          "Materials/Colorways": "no",
          "Invoice/Quotation Details": "no"
        }
      ]
}

module.exports = {
    SHOPIFY_TOKEN,
    EMAIL_PASS,
    EMAIL,
    IAM_ROLE_ARN,
    AMAZON_STS_TOKEN_URL,
    AMAZON_STS_ACCESS_KEY,
    AMAZON_STS_SECRET_KEY,
    AMAZON_TOKEN_URL,
    AMAZON_SA_ENDPOINT,
    MARKETPLACE_ID,
    US_SHOPIFY_TOKEN,
    STRINGS,
    sampleData
}