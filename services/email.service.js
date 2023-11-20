const { sendInquiryEmail, sendInquiryEmailForCustomer } = require("../helpers/email.helper");

const sendInquiry = async (requestBody) => {
  try {


    const sample = {
      "form_type": "contact",
      "utf8": "✓",
      "contact[Name]": "Hasintha Doluweera",
      "contact[email]": "hasintha98@gmail.com",
      "contact[Order_Number]": "35627",
      "Return": true,
      "Warranty Claim": true,
      "Share My Sheet Horror Story": false,
      "contact[body]": "nothing",
      "challenge": "false",
      "null": "Submit"
  }

    const data = await sendInquiryEmail(requestBody);
    await sendInquiryEmailForCustomer(requestBody["contact[email]"]);

    return {
      code: 200,
      data: data,
    };
  } catch (e) {
    throw e;
  }
};

module.exports = {
  sendInquiry,
};
