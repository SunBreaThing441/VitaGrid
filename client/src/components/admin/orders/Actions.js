import { getAllOrder, deleteOrder } from "./FetchApi";

/**
 * Fetches all active requisitions and immediately updates context state.
 */
export const fetchData = async (dispatch) => {
  dispatch({ type: "loading", payload: true });
  try {
    let responseData = await getAllOrder();
    if (responseData && responseData.Orders) {
      dispatch({
        type: "fetchOrderAndChangeState",
        payload: responseData.Orders,
      });
    }
  } catch (err) {
    console.error("Error loading order pipeline:", err);
  } finally {
    dispatch({ type: "loading", payload: false });
  }
};

/**
 * Opens the order status update modal.
 */
export const editOrderReq = (oId, type, status, dispatch) => {
  if (type) {
    dispatch({ type: "updateOrderModalOpen", oId: oId, status: status });
  }
};

/**
 * Deletes an order and immediately refreshes the telemetry log.
 */
export const deleteOrderReq = async (oId, dispatch) => {
  if (window.confirm("Confirm decommissioning of transfer requisition record?")) {
    let responseData = await deleteOrder(oId);
    if (responseData && responseData.success) {
      fetchData(dispatch);
    }
  }
};

/**
 * Filters orders by institutional humanitarian status.
 */
export const filterOrder = async (
  type,
  data,
  dispatch,
  dropdown,
  setDropdown
) => {
  let responseData = await getAllOrder();
  if (responseData && responseData.Orders) {
    let newData;
    if (type === "All") {
      newData = responseData.Orders;
    } else if (type === "Not processed") {
      newData = responseData.Orders.filter(
        (item) => item.status === "Not processed"
      );
    } else if (type === "Under Scrutiny") {
      newData = responseData.Orders.filter(
        (item) => item.status === "Under Scrutiny" || item.status === "Processing"
      );
    } else if (type === "Request Accepted") {
      newData = responseData.Orders.filter(
        (item) => item.status === "Request Accepted" || item.status === "Shipped"
      );
    } else if (type === "Expired") {
      newData = responseData.Orders.filter(
        (item) => item.status === "Expired" || item.status === "Delivered"
      );
    } else if (type === "Cancelled") {
      newData = responseData.Orders.filter(
        (item) => item.status === "Cancelled"
      );
    } else {
      newData = responseData.Orders;
    }
    dispatch({ type: "fetchOrderAndChangeState", payload: newData });
    if (setDropdown) setDropdown(!dropdown);
  }
};
