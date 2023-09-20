const { createContactInXero } = require("../helpers/contact.helper");
const {
  sendInvoiceEmailByXero,
  sendCustomEmail,
} = require("../helpers/email.helper");
const {
  createInvoiceInXero,
  updateInvoiceInXero,
} = require("../helpers/invoice.helper");
const { logger } = require("../helpers/logger.helper");
const { getProductByIdInStore } = require("../helpers/products.helper");
const { createQuoteInXero } = require("../helpers/quote.helper");
const { getTokenForXero } = require("../helpers/token.helper");
const moment = require("moment");

const createInvoice = async (req, res, next) => {
  const body = req.body;
  try {
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
              (variant.option1 === product.beddingType ||
                variant.option2 === product.beddingType) &&
              (variant.option2 === product.color ||
                variant.option3 === product.color)
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
      Name: body["contact[first_name]"] + " " + body["contact[last_name]"],
      FirstName: body["contact[first_name]"],
      LastName: body["contact[last_name]"],
      EmailAddress: body["contact[participant_email]"],
      ContactStatus: "ACTIVE",
      Addresses: [
        {
          AddressType: "POBOX",
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

    const summery = `Comments: \n ${
      body["contact[Comments]"] ? body["contact[Comments]"] : "-"
    } \n\n Support Coordinator: ${
      body["contact[support_coordinator]"]
        ? body["contact[support_coordinator]"]
        : "Not Given"
    } \n Participant’s Date of Birth: ${
      body["contact[participant_date_of_birth]"]
        ? body["contact[participant_date_of_birth]"]
        : "Not Given"
    } \n Participant’s Representative Name: ${
      body["contact[participant_representative_name]"]
        ? body["contact[participant_representative_name]"]
        : "-"
    } \n Contact No: ${
      body["contact[phone_number]"]
        ? body["contact[phone_number]"]
        : "Not Given"
    }`;
    const quoteData = {
      Type: "ACCREC",
      Contact: {
        ContactID: contactResponseData?.Contacts[0]?.ContactID,
      },
      Date: moment().format("YYYY-MM-DD"),
      ExpiryDate: moment().add(7, "day").format("YYYY-MM-DD"),
      Reference: body["contact[ndis_participant_number]"]
        ? body["contact[ndis_participant_number]"]
        : "",
      CurrencyCode: "AUD",
      Comments: body["contact[Comments]"] ? body["contact[Comments]"] : "-",
      LineItems: lineItems,
      Title: `Quote for (${body["contact[lead_type]"]})`,
      Summary: summery,
      Terms: "Quote is valid for 7 days",
      Status: "SENT",
      LineAmountTypes: "Inclusive",
    };

    const quoteResponse = await createQuoteInXero(quoteData, accessToken);
    return res
      .status(200)
      .json({ message: "success", response: quoteResponse });
  } catch (error) {
    // Handle any errors that occurred
    logger.error(JSON.stringify(error))
    sendCustomEmail(body)
      .then((emailRes) => {
        if (emailRes.accepted?.length > 0)
          return res.status(200).json({ message: "Email Sent" });

        return res.status(500).json({ message: "Error creating invoice" });
      })
      .catch(() => {
        return res.status(500).json({ message: "Error creating invoice" });
      });
  }
};

module.exports = {
  createInvoice,
};
