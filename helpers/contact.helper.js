const { default: axios } = require("axios");

const createContactInXero = async (contactBody, accessToken) => {
  const contactApiUrl = "https://api.xero.com/api.xro/2.0/contacts";
  try {
    const contactResponseData = await axios.post(contactApiUrl, contactBody, {
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
      },
    });

    console.log("CONTACT CREATED ------- ", contactResponseData.data);

    return contactResponseData.data;
  } catch (e) {
    throw e;
  }
};

module.exports = {
  createContactInXero
};
