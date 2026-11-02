import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isAuthenticate, isAdmin } from "./fetchApi";

/**
 * Hospital Persona Navigation Guard
 * Intercepts navigation to user/hospital dashboards:
 * - Demands a valid, unexpired JWT in localStorage.
 * - Redirects unauthenticated attempts immediately to /login without rendering sensitive data frames.
 * - Redirects Admin officers to their designated command suite (/admin/dashboard).
 */
const ProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      // 1. Intercept unauthenticated users
      if (!isAuthenticate()) {
        return (
          <Redirect
            to={{
              pathname: "/login",
              state: {
                from: props.location,
                reason: "AUTHENTICATION_REQUIRED",
              },
            }}
          />
        );
      }

      // 2. Intercept Admin users navigating to hospital portal
      if (isAdmin()) {
        return (
          <Redirect
            to={{
              pathname: "/admin/dashboard",
              state: { from: props.location },
            }}
          />
        );
      }

      // 3. Authorized Hospital Persona access granted
      return <Component {...props} />;
    }}
  />
);

export default ProtectedRoute;
