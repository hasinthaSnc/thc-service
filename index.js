// Assuming you're using Express.js framework

const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const moment = require("moment");
const invoiceRoute = require("./routes/invoice.route");
const { sendCustomEmail } = require("./helpers/email.helper");
const { getQuoteInXero } = require("./helpers/quote.helper");
const { getTokenForXero } = require("./helpers/token.helper");
const amazoneRoute = require("./routes/amazon.route");
const { logger } = require("./helpers/logger.helper");
const { changeOrderFullfillmentStatus, getOrderById, getOrderList } = require("./helpers/order.helper");
const mondatRoute = require("./routes/monday.route");
const clientId = "018C140070D64007B9D6466F7076B798";
const clientSecret = "lH-IGXBgXqr5pBpnvrMGfz8OocVyx65c84OAlbxVTb_PfX8D";
const tokenUrl = "https://identity.xero.com/connect/token"; // Replace with the appropriate Xero API endpoint
const { startProductSyncCron } = require("./crons/products.cron");
const productRoute = require("./routes/products.route");
const emailRoute = require("./routes/email.route");

require('dotenv').config();

// for parsing application/json
app.use(bodyParser.json());

app.use(
  cors({
    origin: "https://www.theladcollective.com",
  })
);

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));
//form-urlencoded

app.post("/get-token", async (req, res) => {
  try {
    // Make a request to the Xero API to create an invoice
    const apiUrl = "https://identity.xero.com/connect/token"; // Replace with the appropriate Xero API endpoint
    const token =  Buffer.from(clientId + ":" + clientSecret).toString("base64");
    console.log(token);
    const response = await axios.post(
      apiUrl,
      { grant_type: "client_credentials" },
      {
        headers: {
          Authorization: "Basic " + token,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    // Handle the Xero API response
   
      // Invoice created successfully
      return res.status(200).json(response.data);


    res.status(201).json(response);
  } catch (error) {
    // Handle any errors that occurred
    logger.error(JSON.stringify(error))
    console.error("Error creating invoice:", error);
    res.status(500).json({ message: "An error occurred" });
  }
});



app.post("/get-products", async (req, res) => {
  try {

    const response = await axios.get(
      "https://the-lad-collective.myshopify.com/admin/api/2023-07/products.json",
      {
        headers: {
          "X-Shopify-Access-Token": process.env.SHOPIFY_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    // Handle the Xero API response
    if (response.status === 200) {
      // Invoice created successfully
      //res.status(200).json(response.data);
      return res.status(200).json(response.data.products);
      return res.redirect(
        "https://www.theladcollective.com/products/tlc-assistive-bedding-set?contact_posted=true"
      );
    } else {
      // Error creating the invoice
      res.status(500).json({ message: "Error creating the invoice" });
    }
  } catch (error) {
    // Handle any errors that occurred
    console.error("Error creating invoice:", error);
    res.status(500).json({ message: "An error occurred" });
  }
});

app.post("/get-orders", async (req, res) => {
  try {

    const response = await changeOrderFullfillmentStatus("us", 5449850978608,"fulfilled")
    res.status(200).json(response);

  } catch (error) {
    // Handle any errors that occurred
    console.error("Error creating invoice:", error);
    res.status(500).json({ message: "An error occurred" });
  }
});

app.post("/get-orders-list", async (req, res) => {
  try {

    const response = await getOrderList("us")
    res.status(200).json(response);

  } catch (error) {
    // Handle any errors that occurred
    console.error("Error creating invoice:", error);
    res.status(500).json({ message: "An error occurred" });
  }
});

app.post("/get-order", async (req, res) => {
  try {

    const response = await getOrderById("us", 5446282379568)
    res.status(200).json(response);

  } catch (error) {
    // Handle any errors that occurred
    console.error("Error creating invoice:", error);
    res.status(500).json({ message: "An error occurred" });
  }
});

app.get("/email", async (req, res) => {
  try {
    const tokenResponse = await getTokenForXero()
    await getQuoteInXero("3bd28500-b93e-4683-a427-b4ede718a8d5", tokenResponse.access_token);

    return res.status(200);
  } catch (error) {
    // Handle any errors that occurred
    console.error("Error creating invoice:", error);
    res.status(500).json({ message: "An error occurred" });
  }
});

app.post("/", async (req, res) => {
  logger.info(JSON.stringify(req?.body))
  return res.json("ORDER REQUEST")
 });

app.get("/", async (req, res) => {
 return res.json("THE THC RUNNING FINE V6.1 - inquiry integration")
});



app.use("/lad-collective", invoiceRoute);
app.use("/lad-collective", amazoneRoute);
app.use("/lad-collective", mondatRoute);
app.use("/lad-collective", productRoute);
app.use("/lad-collective", emailRoute);
// Start the server
app.listen(4000, () => {
  console.log("Server started on port 4000");
  // startProductSyncCron()

});
