const { default: axios } = require("axios");
const nodemailer = require("nodemailer");
const { EMAIL, EMAIL_PASS, EMAIL_2_PASS, EMAIL_2 } = require("../config/const");

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

const sendInquiryEmailForCustomer = async (customerEmail) => {
  try {
    const htmlContent = `<p>G’day,</p>
    <p>Thank you for reaching out to The Lad Collective. We wanted to let you know that we've successfully received your email.
    </p>
    <p>We are currently out of office and will return on Tuesday the 2nd of April. Your message is very important to us and we will do our best to get back to you as soon as we can once we have returned from the short break.</p>
    <p>On behalf of the TLC Team, we hope you have an amazing Easter weekend.</p>
    <p>Talk soon :blush::rabbit:</p>
    <br>
    <p>Warm regards,<br>
    The Lad Collective Team</p>`;

    // const htmlContent = `<p>G’day,</p>
    // <p>Thank you for reaching out to The Lad Collective. We wanted to let you know that we've successfully received your email.
    // </p>
    // <p>We are currently experiencing a high volume of enquiries and are working diligently to respond to each one quickly. Our commitment to providing you with the best service remains our top priority.</p>
    // <p>We appreciate your patience and understanding during this busy time. Rest assured, a member of our customer service team will be in touch with you as soon as we can.</p>
    // <p>Thank you for choosing The Lad Collective. We're looking forward to assisting you!</p>
    // <br>
    // <p>Warm regards,<br>
    // The Lad Collective Team</p>`;

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_2,
        pass: EMAIL_2_PASS,
      },
    });

    let mailOptions = {
      from: EMAIL_2,
      to: [customerEmail],
      subject: `Thank you for your enquiry!`,
      html: htmlContent,
    };
    let info = await transporter.sendMail(mailOptions);
    return info;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

const sendInquiryEmail = async (data) => {
  try {

    delete data['utf8']
    delete data['challenge']
    delete data['null']
    const tableRows = Object.entries(data)
    .map(([key, value]) => {
      // Remove "contact" from the key for the first column
      const columnHeader = key.replace("contact[", "").replace("]", "");
      return `<tr><td style="font-weight: bold; padding: 5px;">${columnHeader}</td><td style="padding: 5px;">${value == Boolean(true) ? "Yes" : value == Boolean(false) ? "No" : value}</td></tr>`;
    })
    .join("");



    const tableHTML =
    `<p>Dear Admin,</p>` +
    `<p>We hope this message finds you well. We wanted to inform you that a new inquiry has been submitted by a customer. Below are the details of the inquiry:</p> <br />` +
    `<table style="border-collapse: collapse; width: 100%; max-width: 500px; margin: 0 auto; font-size: 14px; border: 1px solid #ccc;">${tableRows}</table><br />` + 
    `<p>Thank you for your prompt attention to this matter. We strive to provide excellent customer service, and your assistance in resolving this inquiry is greatly appreciated.</p> <br />` +
    `<p>Best regards,</p>` + 
    `<p>- Auto Genarated from Shopify Server</p>`;
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_2,
        pass: EMAIL_2_PASS,
      },
    });

    let mailOptions = {
      from: EMAIL_2,
      to: ["layla@theladcollective.com", "hasinthasupernicecrunch@gmail.com"],
      subject: `Customer Inquiry! - ${data['contact[Name]']}`,
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
  sendAmazonAlertEmail,
  sendInquiryEmailForCustomer,
  sendInquiryEmail
};
