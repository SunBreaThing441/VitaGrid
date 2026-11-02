import { createOrder } from "./FetchApi";

export const fetchData = async (cartListProduct, dispatch) => {
  dispatch({ type: "loading", payload: true });
  try {
    let responseData = await cartListProduct();
    if (responseData && responseData.Products) {
      dispatch({ type: "cartProduct", payload: responseData.Products });
    }
  } catch (error) {
    console.error("Error loading cart products:", error);
  } finally {
    dispatch({ type: "loading", payload: false });
  }
};

export const fetchbrainTree = async (getBrainTreeToken, setState) => {
  try {
    let responseData = await getBrainTreeToken();
    if (responseData && responseData.clientToken) {
      setState((prev) => ({
        ...prev,
        clientToken: responseData.clientToken,
        success: responseData.success,
      }));
    }
  } catch (error) {
    console.error("Error requesting Braintree client token:", error);
  }
};

export const pay = async (
  data,
  dispatch,
  state,
  setState,
  getPaymentProcess,
  totalCost,
  history
) => {
  if (!state.address || !state.address.trim()) {
    return setState((prev) => ({ ...prev, error: "Please provide the receiving hospital surgical bay address." }));
  }
  if (!state.phone || !state.phone.trim()) {
    return setState((prev) => ({ ...prev, error: "Please provide a 24/7 procurement coordinator contact number." }));
  }

  if (!state.instance || typeof state.instance.requestPaymentMethod !== "function") {
    return setState((prev) => ({ ...prev, error: "Payment tokenization provider is initializing. Please wait a moment." }));
  }

  try {
    const paymentMethodData = await state.instance.requestPaymentMethod();
    dispatch({ type: "loading", payload: true });
    const nonce = paymentMethodData.nonce;

    const calculatedCost = typeof totalCost === "function" ? totalCost() : totalCost;
    const paymentData = {
      amountTotal: calculatedCost > 0 ? String(calculatedCost) : "10.00",
      paymentMethod: nonce,
    };

    const res = await getPaymentProcess(paymentData);

    if (res && res.success && res.transaction) {
      let cartItems = [];
      let userId = "";
      try {
        cartItems = JSON.parse(localStorage.getItem("cart")) || [];
        const rawJwt = localStorage.getItem("jwt");
        if (rawJwt) {
          userId = JSON.parse(rawJwt)?.user?._id || "";
        }
      } catch (e) {}

      const orderData = {
        allProduct: cartItems,
        user: userId,
        amount: res.transaction.amount,
        transactionId: res.transaction.id,
        address: state.address.trim(),
        phone: state.phone.trim(),
      };

      const responseData = await createOrder(orderData);
      if (responseData && responseData.success) {
        // Clear local manifest storage and notify context
        localStorage.setItem("cart", JSON.stringify([]));
        dispatch({ type: "inCart", payload: [] });
        dispatch({ type: "cartProduct", payload: null });
        dispatch({ type: "cartTotalCost", payload: null });
        dispatch({ type: "orderSuccess", payload: true });
        setState((prev) => ({ ...prev, clientToken: "", instance: {}, error: false }));
        dispatch({ type: "loading", payload: false });
        return history.push("/user/orders");
      } else {
        dispatch({ type: "loading", payload: false });
        setState((prev) => ({ ...prev, error: responseData?.error || "Transfer order registry could not be saved." }));
      }
    } else {
      dispatch({ type: "loading", payload: false });
      setState((prev) => ({
        ...prev,
        error: res?.message || res?.error || "Transaction authorization declined by payment gateway.",
      }));
    }
  } catch (error) {
    console.error("Payment authorization error:", error);
    dispatch({ type: "loading", payload: false });
    setState((prev) => ({
      ...prev,
      error: error.message || "Failed to tokenize authorization method.",
    }));
  }
};
