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
const clientId = "018C140070D64007B9D6466F7076B798";
const clientSecret = "lH-IGXBgXqr5pBpnvrMGfz8OocVyx65c84OAlbxVTb_PfX8D";
const tokenUrl = "https://identity.xero.com/connect/token"; // Replace with the appropriate Xero API endpoint

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

// Route to handle the form submission
app.post("/submit-form", async (req, res) => {
  try {
    console.log(req.body);
    // Extract form data from the request
    const body = req.body;

    const basicToken = Buffer.from(clientId + ":" + clientSecret).toString(
      "base64"
    );
    const tokenResponse = await axios.post(
      tokenUrl,
      { grant_type: "client_credentials" },
      {
        headers: {
          Authorization: "Basic " + basicToken,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    // Make a request to the Xero API to create an invoice
    const accessToken = tokenResponse.data.access_token; // Replace with your actual access token
    const apiUrl = "https://api.xero.com/api.xro/2.0/invoices"; // Replace with the appropriate Xero API endpoint
    const contactApiUrl = "https://api.xero.com/api.xro/2.0/contacts";
    const productApiUrl = `https://the-lad-collective.myshopify.com/admin/api/2023-07/products/${body["contact[product_name]"]}.json`;

    const productResponse = await axios.get(productApiUrl, {
      headers: {
        "X-Shopify-Access-Token": `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`,
        "Content-Type": "application/json",
      },
    });

    const selectedVarient = productResponse.data.product.variants.find(
      (item) =>
        item.option1 == body["contact[bedding_type]"] || item.option2 == body["contact[bedding_type]"] &&
        item.option2 == body["contact[color]"] || item.option3 == body["contact[color]"]
    );

    const contactBody = {
      Name:
        body["contact[first_name]"] +
        " " +
        body["contact[last_name]"] +
        " " +
        " + Testing",
      FirstName: body["contact[first_name]"],
      LastName: body["contact[last_name]"],
      EmailAddress: body["contact[participant_email]"],
      ContactStatus: "ACTIVE",
      Addresses: [
        {
          AddressLine1: body["contact[street_address]"],
          Region: body["contact[state_or_Region]"],
          PostalCode: body["contact[postal_code]"],
          City: body["contact[city]"],
          Country: "Australia",
        },
      ],
    };

    const contactResponseData = await axios.post(contactApiUrl, contactBody, {
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
      },
    });

    console.log("CONTACT CREATED ------- ", contactResponseData.data);

    // Construct the invoice payload
    const invoiceData = {
      Type: "ACCREC",
      Contact: {
        ContactID: contactResponseData?.data?.Contacts[0]?.ContactID,
      },
      dueDate: moment().add(1, "day").format("YYYY-MM-DD"),
      Reference: body["contact[ndis_participant_number]"],
      CurrencyCode: "AUD",
      LineItems: [
        {
          Description: `${productResponse.data?.product?.title} / ${body["contact[bedding_type]"]} / ${body["contact[color]"]}`,
          Quantity: body["contact[quantity]"],
          UnitAmount: selectedVarient ? selectedVarient.price : "",
          AccountCode: "215",
        },
      ],
      Status: "SUBMITTED",
      // ...other invoice details
    };

    const invoiceResponse = await axios.post(apiUrl, invoiceData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    console.log("INVOICE CREATED ------- ", invoiceResponse.data);
    const invoiceID = invoiceResponse.data.Invoices[0].InvoiceID;

    //emailing

    const emailUrl = `https://api.xero.com/api.xro/2.0/Invoices/${invoiceID}/Email`;

    const emailResponse = await axios.post(emailUrl, null, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    console.log("EMIAL SENT ----- ", emailResponse.data);

    return res.status(200).json({ message: "success" });
  } catch (error) {
    // Handle any errors that occurred
    console.error("Error creating invoice:", error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

app.post("/get-token", async (req, res) => {
  try {
    // Make a request to the Xero API to create an invoice
    const apiUrl = "https://identity.xero.com/connect/token"; // Replace with the appropriate Xero API endpoint
    const token = Buffer.from(clientId + ":" + clientSecret).toString("base64");
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

    console.log(response);

    // Handle the Xero API response
    if (response.status === 200) {
      // Invoice created successfully
      return res.status(200).json(response.data);
    } else {
      // Error creating the invoice
      return res.status(500).json(response.data);
    }

    res.status(201).json(response);
  } catch (error) {
    // Handle any errors that occurred
    console.error("Error creating invoice:", error);
    res.status(500).json({ message: "An error occurred" });
  }
});

app.get("/get-contacts", async (req, res) => {
  try {
    // Make a request to the Xero API to create an invoice
    const email = "hasinthasupernicecrunch@gmail.com";
    const clientId = "018C140070D64007B9D6466F7076B798";
    const clientSecret = "lH-IGXBgXqr5pBpnvrMGfz8OocVyx65c84OAlbxVTb_PfX8D";
    const apiUrl = "https://identity.xero.com/connect/token"; // Replace with the appropriate Xero API endpoint
    const token = Buffer.from(clientId + ":" + clientSecret).toString("base64");
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

    console.log(response);

    const responseData = await axios.get(
      "https://api.xero.com/api.xro/2.0/contacts",
      {
        headers: {
          Authorization: "Bearer " + response.data.access_token,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log(responseData.data);

    const existingContact = responseData.data.Contacts.find(
      (contact) => contact.EmailAddress == email
    );

    if (!existingContact) {
      res.status(400).json({ message: "No existing contact" });
    }

    // Handle the Xero API response
    if (responseData.status === 200) {
      // Invoice created successfully
      res.status(200).json(existingContact);
    } else {
      // Error creating the invoice
      res.status(500).json(responseData.data);
    }

    res.status(201).json(responseData.data);
  } catch (error) {
    // Handle any errors that occurred
    console.error("Error creating invoice:", error);
    res.status(500).json({ message: "An error occurred" });
  }
});

app.post("/get-products", async (req, res) => {
  try {
    // console.log(req.body);
    // const data = req.body;
    // let productData = [];
    // data.contact.product.forEach((element) => {
    //   console.log(element.toLowerCase().replace(/\s/g, "_") + "_color");
    //   productData.push({
    //     name: element,
    //     color:
    //       data.contact[element.toLowerCase().replace(/\s/g, "_") + "_color"],
    //     type: data.contact[
    //       element.toLowerCase().replace(/\s/g, "_") + "_bedding_type"
    //     ],
    //   });
    // });

    const response = await axios.get(
      "https://the-lad-collective.myshopify.com/admin/api/2023-07/products/7284925988911.json",
      {
        headers: {
          "X-Shopify-Access-Token": `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`,
          "Content-Type": "application/json",
        },
      }
    );

    // Handle the Xero API response
    if (response.status === 200) {
      // Invoice created successfully
      //res.status(200).json(response.data);
      return res.status(200).json(response.data.product);
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

app.get("/", async (req, res) => {
 return res.json("THE THC RUNNING FINE V2")
});

app.use("/lad-collective", invoiceRoute);

// Start the server
app.listen(4000, () => {
  console.log("Server started on port 4000");
});
