const { default: axios } = require("axios");

const getTokenForXero = async () => {
  const clientId = "018C140070D64007B9D6466F7076B798";
  const clientSecret = "lH-IGXBgXqr5pBpnvrMGfz8OocVyx65c84OAlbxVTb_PfX8D";
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
