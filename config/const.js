require('dotenv').config();

const SHOPIFY_TOKEN = process.env.SHOPIFY_TOKEN
const EMAIL = process.env.EMAIL
const EMAIL_PASS = process.env.EMAIL_PASS

module.exports = {
    SHOPIFY_TOKEN,
    EMAIL_PASS,
    EMAIL
}