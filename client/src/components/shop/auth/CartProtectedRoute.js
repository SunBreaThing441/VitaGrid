import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isAuthenticate } from "./fetchApi";

/**
 * Tactical Requisition Manifest Navigation Guard (/checkout)
 * Valid access requires:
 * 1. An authenticated Hospital or Procurement session.
 * 2. Active biological graft items queued in the requisition manifest.
 */
const CartProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      // 1. Intercept unauthenticated requisition attempts
      if (!isAuthenticate()) {
        return (
          <Redirect
            to={{
              pathname: "/login",
              state: {
                from: props.location,
                reason: "CHECKOUT_AUTH_REQUIRED",
              },
            }}
          />
        );
      }

      // 2. Validate active payload items in requisition queue
      let hasCartItems = false;
      try {
        const rawCart = localStorage.getItem("cart");
        if (rawCart) {
          const parsed = JSON.parse(rawCart);
          hasCartItems = Array.isArray(parsed) && parsed.length > 0;
        }
      } catch (e) {
        hasCartItems = false;
      }

      if (!hasCartItems) {
        return (
          <Redirect
            to={{
              pathname: "/",
              state: { from: props.location, reason: "EMPTY_MANIFEST" },
            }}
          />
        );
      }

      return <Component {...props} />;
    }}
  />
);

export default CartProtectedRoute;
