const { createContactInXero } = require("../helpers/contact.helper");
const { sendInvoiceEmailByXero } = require("../helpers/email.helper");
const {
  createInvoiceInXero,
  updateInvoiceInXero,
} = require("../helpers/invoice.helper");
const { getProductByIdInStore } = require("../helpers/products.helper");
const { createQuoteInXero } = require("../helpers/quote.helper");
const { getTokenForXero } = require("../helpers/token.helper");
const moment = require("moment");

const createInvoice = async (req, res, next) => {
  try {
    const body = req.body;
    const accessToken = (await getTokenForXero())?.access_token; // get access token

    const productNamesAndBeddingTypes = Object.keys(body)
      .filter((key) => key.startsWith("contact[product_name]_"))
      .map((key) => {
        const index = key.split("]_")[1];
        console.log(index);
        return {
          name: body[key],
          beddingType: body[`contact[bedding_type]_${index}`],
          color: body[`contact[color]_${index}`],
          qty: body[`contact[quantity]_${index}`],
        };
      });

    const selectedVarient = await Promise.all(
      productNamesAndBeddingTypes.map(async (product) => {
        const productResponse = await getProductByIdInStore(product.name);
        return {
          ...productResponse.product.variants.find(
            (variant) =>
              variant.option1 === product.beddingType &&
              variant.option2 === product.color
          ),
          productName: productResponse.product.title,
        };
      })
    );

    if (selectedVarient.some((value) => !value)) {
      res
        .status(400)
        .json({ message: "Product & Selected variants not available" });
      return;
    }

    console.log("selectedVarient", selectedVarient);

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
          AddressType: "STREET",
          AddressLine1: body["contact[street_address]"],
          City: body["contact[city]"],
          Region: body["contact[state_or_Region]"],
          PostalCode: body["contact[postal_code]"],
          Country: "Australia",
        },
      ],
      Phones: [
        {
          PhoneType: "DEFAULT",
          PhoneNumber: body["contact[phone_number]"],
        },
      ],
    };

    const contactResponseData = await createContactInXero(
      contactBody,
      accessToken
    );

    const lineItems = selectedVarient.map((itemProduct, key) => {
      return {
        Description: `${itemProduct.productName} / ${itemProduct.title}`,
        Quantity: body[`contact[quantity]_${key + 1}`],
        UnitAmount: itemProduct ? itemProduct.price : "",
        AccountCode: "215",
      };
    });

    console.log(lineItems);

    // Construct the quote payload
    const quoteData = {
      Type: "ACCREC",
      Contact: {
        ContactID: contactResponseData?.Contacts[0]?.ContactID,
      },
      Date: moment().format("YYYY-MM-DD"),
      ExpiryDate: moment().add(7, "day").format("YYYY-MM-DD"),
      Reference: body["contact[ndis_participant_number]"],
      CurrencyCode: "AUD",
      Comments: body["contact[Comments]"],
      LineItems: lineItems,
      Title: `Quote for (${body["contact[lead_type]"]})`,
      Summary: body["contact[Comments]"],
      Terms: "Quote is valid for 7 days",
      Status: "SENT",
    };

    const quoteResponse = await createQuoteInXero(quoteData, accessToken);
    // const invoiceID = invoiceResponse?.Invoices[0].InvoiceID;

    // const invoiceForUpdate = {
    //   Invoices: [
    //     {
    //       InvoiceID: invoiceID,
    //       Notes: body["contact[Comments]"],
    //       Comments: body["contact[Comments]"],
    //     },
    //   ],
    // };
    // await updateInvoiceInXero(invoiceForUpdate, invoiceID, accessToken);

    // const emailResponse = await sendInvoiceEmailByXero(invoiceID, accessToken); //send email

    res.status(200).json({ message: "success" });
  } catch (error) {
    // Handle any errors that occurred
    console.error("Error creating invoice:", error);
    res.status(500).json({ message: "An error occurred" });
  }
};

module.exports = {
  createInvoice,
};
