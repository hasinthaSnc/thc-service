const { default: axios } = require("axios");
const nodemailer = require("nodemailer");
const { EMAIL, EMAIL_PASS } = require("../config/const");

const sendInvoiceEmailByXero = async (invoiceId, accessToken) => {
  const emailUrl = `https://api.xero.com/api.xro/2.0/Invoices/${invoiceId}/Email`;
  try {
    const emailResponse = await axios.post(emailUrl, null, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    console.log("EMAIL SENT ------- ");

    return emailResponse.data;
  } catch (e) {
    throw e;
  }
};

const sendCustomEmail = async (data) => {
  console.log("Called");
  try {
    const tableRows = Object.entries(data)
      .map(([key, value]) => {
        // Remove "contact" from the key for the first column
        const columnHeader = key.replace("contact[", "").replace("]", "");
        return `<tr><td style="font-weight: bold; padding: 5px;">${columnHeader}</td><td style="padding: 5px;">${value}</td></tr>`;
      })
      .join("");

    const tableHTML =
      `<p>Service is currently down. We apologize for the inconvenience. Here is the submitted details from NDIS</p> <br /> <hr>` +
      `<table style="border-collapse: collapse; width: 100%; max-width: 500px; margin: 0 auto; font-size: 14px; border: 1px solid #ccc;">${tableRows}</table>`;

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL,
        pass: EMAIL_PASS,
      },
    });

    let mailOptions = {
      from: EMAIL,
      to: ["chloe@theladcollective.com", EMAIL],
      subject: data["contact[lead_type]"]
        ? `${data["contact[lead_type]"]} - ${data["contact[first_name]"]}`
        : "Quote Submitted",
      html: tableHTML,
    };
    let info = await transporter.sendMail(mailOptions);
    return info;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

const sendAmazonAlertEmail = async (orderId,orderNumber, message) => {
  try {
    const tableHTML = `
    <p>Hi</p>
    <p>${message}</p> 
    <br /> 
    <span>ORDER ID: ${orderNumber}</span> <br /> 
    <span>ORDER URL: <a>https://admin.shopify.com/store/the-lad-collective-us-store/orders/${orderId}</a></span> <br /> 
    <p>Thank You!</p>
    <hr>`;

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL,
        pass: EMAIL_PASS,
      },
    });

    let mailOptions = {
      from: EMAIL,
      to: [EMAIL],
      subject: `Order No: ${orderNumber} - Encounted a issue`,
      html: tableHTML,
    };
    let info = await transporter.sendMail(mailOptions);
    return info;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

module.exports = {
  sendInvoiceEmailByXero,
  sendCustomEmail,
  sendAmazonAlertEmail
};
