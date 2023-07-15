const { default: axios } = require("axios");
const nodemailer = require("nodemailer");

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

const sendCustomEmail = async () => {
  console.log("Called")

  const pdfResponse = await axios.post('https://api.xero.com/api.xro/2.0/Invoice/Quotes', quote, { headers, responseType: 'arraybuffer' })

  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "hasinthasupernicecrunch@gmail.com",
        pass: "qyigkhnqcykpiicz",
      },
    });

    let mailOptions = {
      from: "hasinthasupernicecrunch@gmail.com",
      to: "hasintha.doluweera@gmail.com",
      subject: "Sending email with attachments",
      text: "Please see the attached files.",
      html: `
      <h2>Invoice</h2>
      <p>Dear recipient,</p>
      <p>Please find attached the invoice for your recent purchase.</p>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Product 1</td>
            <td>2</td>
            <td>$10</td>
          </tr>
          <tr>
            <td>Product 2</td>
            <td>1</td>
            <td>$20</td>
          </tr>
        </tbody>
      </table>
      <p>Total: $30</p>
      <p>Thank you for your business.</p>
    `,
    };
    let info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info);
    return info;
  } catch (e) {
    console.log(e)
    throw e;
  }
};

module.exports = {
  sendInvoiceEmailByXero,
  sendCustomEmail
};
