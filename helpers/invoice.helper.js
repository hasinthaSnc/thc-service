const { default: axios } = require("axios");

const createInvoiceInXero = async (invoiceData, accessToken) => {
  const invoiceApiUrl = `https://api.xero.com/api.xro/2.0/invoices`;
  try {
    const invoiceResponse = await axios.post(invoiceApiUrl, invoiceData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    console.log("INVOICE CREATED ------- ", invoiceResponse.data);

    return invoiceResponse.data;
  } catch (e) {
    throw e;
  }
};

const updateInvoiceInXero = async (invoiceData, invoiceID, accessToken) => {
  const invoiceApiUrl = `https://api.xero.com/api.xro/2.0/invoices/` + invoiceID;
  try {
    const invoiceResponse = await axios.post(invoiceApiUrl, invoiceData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    console.log("INVOICE UPDATED ------- ", invoiceResponse.data);

    return invoiceResponse.data;
  } catch (e) {
    throw e;
  }
};

module.exports = {
  createInvoiceInXero,
  updateInvoiceInXero
};
