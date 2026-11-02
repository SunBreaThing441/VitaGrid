import axios from "axios";
const apiURL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/**
 * Requests the client token from the Express backend
 * via GET /api/braintree/get-token (with fallback to POST).
 */
export const getBrainTreeToken = async () => {
  try {
    let res = await axios.get(`${apiURL}/api/braintree/get-token`);
    return res.data;
  } catch (error) {
    try {
      let uId = "";
      const rawJwt = localStorage.getItem("jwt");
      if (rawJwt) {
        uId = JSON.parse(rawJwt)?.user?._id || "";
      }
      let res2 = await axios.post(`${apiURL}/api/braintree/get-token`, { uId });
      return res2.data;
    } catch (err) {
      console.error("Error retrieving Braintree client token:", err);
      return null;
    }
  }
};

/**
 * Executes the organ transfer confirmation and tokenized payment
 * via POST /api/braintree/payment.
 */
export const getPaymentProcess = async (paymentData) => {
  try {
    let res = await axios.post(`${apiURL}/api/braintree/payment`, paymentData);
    return res.data;
  } catch (error) {
    console.error("Error executing Braintree payment:", error);
    return { error: error.message };
  }
};

/**
 * Creates the official humanitarian transfer mission order
 * via POST /api/order/create-order.
 */
export const createOrder = async (orderData) => {
  try {
    let res = await axios.post(`${apiURL}/api/order/create-order`, orderData);
    return res.data;
  } catch (error) {
    console.error("Error creating transfer order:", error);
    return { error: error.message };
  }
};
