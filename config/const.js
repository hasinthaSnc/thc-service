require('dotenv').config();

const SHOPIFY_TOKEN = process.env.SHOPIFY_TOKEN
const EMAIL = process.env.EMAIL
const EMAIL_PASS = process.env.EMAIL_PASS
const IAM_ROLE_ARN = process.env.IAM_ROLE_ARN
const AMAZON_STS_TOKEN_URL = process.env.AMAZON_STS_TOKEN_URL
const AMAZON_STS_ACCESS_KEY = process.env.AMAZON_STS_ACCESS_KEY
const AMAZON_STS_SECRET_KEY = process.env.AMAZON_STS_SECRET_KEY
const AMAZON_TOKEN_URL = process.env.AMAZON_TOKEN_URL

module.exports = {
    SHOPIFY_TOKEN,
    EMAIL_PASS,
    EMAIL,
    IAM_ROLE_ARN,
    AMAZON_STS_TOKEN_URL,
    AMAZON_STS_ACCESS_KEY,
    AMAZON_STS_SECRET_KEY,
    AMAZON_TOKEN_URL
}