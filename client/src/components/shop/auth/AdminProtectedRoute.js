import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isAuthenticate, isAdmin } from "./fetchApi";

/**
 * Procurement Admin Persona Navigation Guard
 * Intercepts navigation to administrative command suites:
 * - Demands a valid JWT in localStorage.
 * - Strictly demands userRole === 1 parsed from the signed JWT payload.
 * - Non-admin users (e.g. Hospital units) or unauthenticated attempts are intercepted immediately
 *   without rendering any sensitive data frames or management controls.
 */
const AdminProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      // 1. Intercept unauthenticated navigation attempts
      if (!isAuthenticate()) {
        return (
          <Redirect
            to={{
              pathname: "/login",
              state: {
                from: props.location,
                reason: "ADMIN_AUTH_REQUIRED",
              },
            }}
          />
        );
      }

      // 2. Strictly verify userRole === 1 parsed from token
      if (!isAdmin()) {
        // Forbidden: Authenticated user is not an OPO Admin
        return (
          <Redirect
            to={{
              pathname: "/user/profile",
              state: {
                from: props.location,
                reason: "FORBIDDEN_ADMIN_ACCESS",
              },
            }}
          />
        );
      }

      // 3. Procurement Admin verified; render secure view frame
      return <Component {...props} />;
    }}
  />
);

export default AdminProtectedRoute;
