const { default: axios } = require("axios");

const getItemList = async () => {
  const url = "https://api.monday.com/v2";
  try {
    let query =
      "query { boards (ids: 5060067013) {name id columns { title id type } groups { title id }}}";
    const response = await axios.post(
      url,
      JSON.stringify({
        query: query,
      }),
      {
        headers: {
          Authorization:
            "eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjE0NjQ0NjE4MiwiYWFpIjoxMSwidWlkIjoxNTg3OTE2NywiaWFkIjoiMjAyMi0wMi0xN1QwMTowNzowOS4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6NjU5NDAwOCwicmduIjoidXNlMSJ9.7mFC9bMrnHUsTg4HiWGd4YsHSTrMghW9pf7684dHpdc",
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

async function createItem(data) {
  const url = `https://api.monday.com/v2`;

  return data.forEach(async element => {
    const createItemQuery = `
    mutation {
        create_item (
            board_id: 5060067013,
            group_id: "topics",
            item_name: ${element["Product Name/ID"]},
            column_values: "{\\"name\\":\\"${element["Product Name/ID"]}\\",\\"text\\":\\"${element["Product Name/ID"]}\\",\\"date4\\":\\"${element["Start Date"]}\\",\\"status\\":\\"Done\\",\\"text7\\":\\"${element["PO Number"]}\\",\\"status_1\\":\\"${element["Status"]}\\",\\"text3\\":\\"${element["Expected Completion Date"]}\\",\\"text0\\":\\"${element["Actual Completion Date"]}\\",\\"text2\\":\\"${element["Materials/Colorways"]}\\",\\"long_text\\":\\"${element["Notes/Comments"]}\\",\\"text20\\":\\"${element["Invoice/Quotation Details"]}"}"
        ) {
            id
            name
        }
    }
  `;

  console.log(createItemQuery)
  try {
    const response = await axios.post(
      url,
      JSON.stringify({
        query: createItemQuery,
      }),
      {
        headers: {
          Authorization:
            "eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjE0NjQ0NjE4MiwiYWFpIjoxMSwidWlkIjoxNTg3OTE2NywiaWFkIjoiMjAyMi0wMi0xN1QwMTowNzowOS4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6NjU5NDAwOCwicmduIjoidXNlMSJ9.7mFC9bMrnHUsTg4HiWGd4YsHSTrMghW9pf7684dHpdc",
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Item created:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating item:", error.response.data);
    throw error;
  }
  });
//   const createItemQuery = `
//   mutation {
//       create_item (
//           board_id: 5060067013,
//           group_id: "topics",
//           item_name: "New Item Name",
//           column_values: "{\\"name\\":\\"Item Name\\",\\"text\\":\\"Stage\\",\\"date4\\":\\"2023-08-31\\",\\"status\\":\\"Done\\",\\"text7\\":\\"PO123\\",\\"status_1\\":\\"Pass\\",\\"text3\\":\\"2023-09-15\\",\\"text0\\":\\"2023-08-31\\",\\"text2\\":\\"Material A, Colorway B\\",\\"long_text\\":\\"Additional notes...\\",\\"text20\\":\\"Invoice: INV123, Quotation: QUO456\\"}"
//       ) {
//           id
//           name
//       }
//   }
// `;


 
}

module.exports = {
  getItemList,
  createItem,
};
