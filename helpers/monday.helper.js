const { default: axios } = require("axios");
const { MONDAY_AUTH_TOKEN } = require("../config/const");
const { logger } = require("../helpers/logger.helper");

async function createOrUpdateItem(data) {
  const url = `https://api.monday.com/v2`;
  logger.info("Google sheet data: " + JSON.stringify(data))
  const existingItemsResponse = await axios.post(
    url,
    JSON.stringify({
      query: `
      query {
        boards(ids: 5060067013) {
          items {
            id
            column_values(ids: ["text7"]) {
              text
            }
          }
        }
      }
      `,
    }),
    {
      headers: {
        Authorization: MONDAY_AUTH_TOKEN,
        "Content-Type": "application/json",
      },
    }
  );


  const existingItems = existingItemsResponse.data.data.boards[0].items;
  for (const element of data) {
    console.log(element)
    const existingItem = existingItems.find(
      (item) => item.column_values[0].text === element["PO Number"].toString()
    );
    
    let createOrUpdateItemQuery = `
      mutation {
        ${existingItem ? "change_multiple_column_values" : "create_item"} (
          board_id: 5060067013,
          ${!existingItem ? `group_id: "topics"` : ""},
          ${!existingItem ? `item_name: "${element["Product Name/ID"]}"` : ""},
          ${existingItem ? `item_id: ${existingItem.id}` : ""}
          column_values: "{\\"name\\":\\"${
            element["Product Name/ID"]
          }\\",\\"text\\":\\"${element["Stage"]}\\",\\"date4\\":\\"${
      element["Start Date"]
    }\\",\\"status\\":\\"Done\\",\\"text7\\":\\"${
      element["PO Number"]
    }\\",\\"status_1\\":\\"${element["Status"]}\\",\\"text3\\":\\"${
      element["Expected Completion Date"]
    }\\",\\"text0\\":\\"${
      element["Actual Completion Date"]
    }\\",\\"text2\\":\\"${
      element["Materials/Colorways"]
    }\\",\\"long_text\\":\\"${element["Notes/Comments"]}\\",\\"text20\\":\\"${
      element["Invoice/Quotation Details"]
    }\\"}"
        ) {
          id
          name
        }
      }
    `;

    try {
      const response = await axios.post(
        url,
        JSON.stringify({
          query: createOrUpdateItemQuery,
        }),
        {
          headers: {
            Authorization: MONDAY_AUTH_TOKEN,
            "Content-Type": "application/json",
          },
        }
      );
      
    } catch (error) {
      console.error("Error creating or updating item:", error);
      logger.error("Error creating or updating item: " + JSON.stringify(error))
    
    }
  }

  return existingItems
}

module.exports = {
  createOrUpdateItem
};
