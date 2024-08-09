export const createOrderShopify = async () => {
  const accessToken = process.env.SHOPIFY_TOKEN;
  console.log(accessToken);
  const orderApiUrl = `https://the-lad-collective.myshopify.com/admin/api/2023-07/orders.json`;
  try {
    const orderResponse = await axios.post(orderApiUrl, {
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
      data: {
        order: {
          line_items: [
            {
              variant_id: 42139560214575,
              quantity: 1,
            },
          ],
          customer: {
            first_name: "Hasintha",
            last_name: "Doluweera",
            email: "hasintha98@gmail.com",
          },
          billing_address: {
            first_name: "Hasintha",
            last_name: "Doluweera",
            address1: "123 Fake Street",
            phone: "555-555-5555",
            city: "Fakecity",
            province: "Ontario",
            country: "Canada",
            zip: "K2P 1L4",
          },
          email: "hasintha98@gmail.com",
          transactions: [
            {
              kind: "authorization",
              status: "success",
              amount: 50.0,
            },
          ],
          financial_status: "voided",
        },
      },
    });

    // console.log("PRODUCT LIST ------- ", productResponse.data);

    return orderResponse.data;
  } catch (e) {
    throw e;
  }
};
