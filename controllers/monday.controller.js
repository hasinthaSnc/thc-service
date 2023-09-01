const { json } = require("body-parser");
const { syncBoard } = require("../services/monday.service");
const { sampleData } = require("../config/const");
const { logger } = require("../helpers/logger.helper");

const syncBoards = async (req, res, next) => {
  try {
    const body = req.body
    const response = await syncBoard(body);
    res.status(response.code).json(response);
    return;
  } catch (e) {
    logger.error(JSON.stringify(e))
    res.status(e.response?.status).json(e.response?.data);
  }
};

module.exports = {
    syncBoards,
};
