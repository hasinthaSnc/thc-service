const { json } = require("body-parser");
const { syncBoard } = require("../services/monday.service");
const { sampleData } = require("../config/const");

const syncBoards = async (req, res, next) => {
  try {
    console.log("called")
    const body = sampleData.mondatData
    const response = await syncBoard(body);
    res.status(response.code).json(response);
    return;
  } catch (e) {
    res.status(e.response?.status).json(e.response?.data);
  }
};

module.exports = {
    syncBoards,
};
