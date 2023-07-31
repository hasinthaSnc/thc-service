const { default: axios } = require("axios");

const getTokenForXero = async () => {
  const clientId = process.env.XERO_CLIENT;
  const clientSecret = process.env.XERO_SECRET;
  const tokenUrl = "https://identity.xero.com/connect/token";

  try {
    const basicToken = Buffer.from(clientId + ":" + clientSecret).toString(
      "base64"
    );

    const tokenResponse = await axios.post(
      tokenUrl,
      { grant_type: "client_credentials" },
      {
        headers: {
          Authorization: "Basic " + basicToken,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return tokenResponse.data;
  } catch (e) {
    throw e;
  }
};

module.exports = {
  getTokenForXero
};
