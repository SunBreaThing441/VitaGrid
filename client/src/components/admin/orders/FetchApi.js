import axios from "axios";
const apiURL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/**
 * Retrieves all hospital transfer orders from POST /api/order/get-all-orders
 * (with fallback to GET /api/order/get-all-orders).
 */
export const getAllOrder = async () => {
  try {
    let res = await axios.post(`${apiURL}/api/order/get-all-orders`);
    return res.data;
  } catch (error) {
    try {
      let res2 = await axios.get(`${apiURL}/api/order/get-all-orders`);
      return res2.data;
    } catch (err) {
      console.error("Error fetching order pipeline:", err);
      return { Orders: [] };
    }
  }
};

/**
 * Commits a state machine transition for a requisition mission
 * via POST /api/order/update-order.
 */
export const updateOrderStatus = async (oId, status) => {
  const payload = { oId, status };
  try {
    let res = await axios.post(`${apiURL}/api/order/update-order`, payload);
    return res.data;
  } catch (error) {
    console.error("Error updating order status:", error);
    return { error: error.message };
  }
};

// Aliases for legacy component compatibility
export const editCategory = updateOrderStatus;
export const editOrder = updateOrderStatus;

/**
 * Decommissions an order record from the active log.
 */
export const deleteOrder = async (oId) => {
  try {
    let res = await axios.post(`${apiURL}/api/order/delete-order`, { oId });
    return res.data;
  } catch (error) {
    console.error("Error deleting order:", error);
    return { error: error.message };
  }
};
