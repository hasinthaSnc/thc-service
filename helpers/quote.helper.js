const { default: axios } = require("axios");
const fs = require("fs");

const createQuoteInXero = async (quoteData, accessToken) => {
  const quoteApiUrl = `https://api.xero.com/api.xro/2.0/Quotes`;
  try {
    const quoteResponse = await axios.post(quoteApiUrl, quoteData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    console.log("QUOTE CREATED ------- ", quoteResponse.data);

    return quoteResponse.data;
  } catch (e) {
    throw e;
  }
};

const getQuoteInXero = async (quoteID, accessToken) => {
  const quoteApiUrl = `https://api.xero.com/api.xro/2.0/Quotes/${quoteID}`;
  try {
    axios
      .get(quoteApiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        responseType: 'stream'
      })
      .then((response) => {
        console.log(response)
        const writer = fs.createWriteStream("quote.pdf");
        response.data.pipe(writer);

        writer.on("finish", () => {
          console.log("Quote PDF saved successfully.");
        });

        writer.on("error", (err) => {
          console.error("Failed to save the Quote PDF:", err);
        });
      })
      .catch((error) => {
        console.error(
          "Failed to retrieve the Quote as PDF:",
          error.response.data
        );
      });

    console.log("QUOTE CREATED ------- ", quoteResponse.data);

    return quoteResponse.data;
  } catch (e) {
    throw e;
  }
};

module.exports = {
  createQuoteInXero,
  getQuoteInXero
};
