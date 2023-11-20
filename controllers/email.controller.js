const { json } = require("body-parser");
const { logger } = require("../helpers/logger.helper");
const { sendInquiry } = require("../services/email.service");

const sendInquiries = async (req, res, next) => {
  try {
    const body = req.body

    if(!body['contact[Name]']) {
      res.status(403).json({message: "Validation Failed"})
    }
    const response = await sendInquiry(body);
    res.status(response.code).json(response);
    return;
  } catch (e) {
    logger.error(JSON.stringify(e))
    res.status(e.response?.status).json(e.response?.data);
  }
};



module.exports = {
  sendInquiries,
};
