const { createOrUpdateItem } = require("../helpers/monday.helper");

const syncBoard = async (requestBody) => {
  try {
    const data = await createOrUpdateItem(requestBody);

    return {
      code: 200,
      data: data,
    };
  } catch (e) {
    throw e;
  }
};

module.exports = {
  syncBoard,
};
