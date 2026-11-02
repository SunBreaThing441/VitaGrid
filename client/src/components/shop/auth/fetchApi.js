import axios from "axios";
const apiURL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/**
 * Safely parses Base64URL-encoded JSON Web Token payloads.
 */
export const parseJwt = (token) => {
  if (!token || typeof token !== "string") return null;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    return null;
  }
};

/**
 * Retrieves the raw JWT token string from localStorage.
 */
export const getStoredToken = () => {
  try {
    const rawJwt = localStorage.getItem("jwt");
    if (!rawJwt) return null;
    // Check if stored as JSON object { token, user } or direct token string
    if (rawJwt.startsWith("{")) {
      const parsed = JSON.parse(rawJwt);
      return parsed.token || null;
    }
    return rawJwt;
  } catch (err) {
    return null;
  }
};

/**
 * Returns parsed JWT payload while strictly verifying expiry.
 */
export const getDecodedToken = () => {
  const token = getStoredToken();
  if (!token) return null;
  const decoded = parseJwt(token);
  if (!decoded) return null;

  // Verify expiry timestamp if present
  if (decoded.exp && decoded.exp * 1000 < Date.now()) {
    // Token expired; automatically flush sensitive keys
    logout();
    return null;
  }
  return decoded;
};

/**
 * Extracts and strictly parses userRole from the signed JWT payload.
 * Role 1 = Procurement / OPO Admin
 * Role 0 = Hospital / Clinical Transplant Center
 */
export const getUserRole = () => {
  const decoded = getDecodedToken();
  if (decoded) {
    if (typeof decoded.role === "number") return decoded.role;
    if (typeof decoded.userRole === "number") return decoded.userRole;
  }

  // Fallback to stored JSON object metadata if token payload omitted it
  try {
    const rawJwt = localStorage.getItem("jwt");
    if (rawJwt && rawJwt.startsWith("{")) {
      const parsed = JSON.parse(rawJwt);
      if (parsed.user && typeof parsed.user.role === "number") {
        return parsed.user.role;
      }
      if (parsed.user && typeof parsed.user.userRole === "number") {
        return parsed.user.userRole;
      }
    }
    const rawUser = localStorage.getItem("user");
    if (rawUser) {
      const parsedUser = JSON.parse(rawUser);
      if (typeof parsedUser.role === "number") return parsedUser.role;
      if (typeof parsedUser.userRole === "number") return parsedUser.userRole;
    }
  } catch (e) {}

  return null;
};

/**
 * Intercept navigation: Valid access requires a valid, unexpired JWT in localStorage.
 */
export const isAuthenticate = () => {
  const decoded = getDecodedToken();
  if (!decoded) return false;

  try {
    const rawJwt = localStorage.getItem("jwt");
    if (rawJwt && rawJwt.startsWith("{")) {
      return JSON.parse(rawJwt);
    }
    return { token: getStoredToken(), user: decoded };
  } catch (err) {
    return false;
  }
};

/**
 * Navigation Guard: Strictly demands userRole === 1 parsed from the stored token.
 */
export const isAdmin = () => {
  if (!isAuthenticate()) return false;
  const role = getUserRole();
  return role === 1;
};

/**
 * Navigation Guard: Verifies hospital persona (authenticated, non-admin).
 */
export const isHospital = () => {
  return isAuthenticate() && !isAdmin();
};

/**
 * Unified, secure logout action:
 * Flushes jwt, user, cart, and wishList keys from localStorage,
 * and immediately redirects unauthorized attempts to the public gateway without rendering sensitive data frames.
 */
export const logout = (redirectPath = "/") => {
  try {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    localStorage.removeItem("wishList");
    // Clear any temporary requisition tokens
    sessionStorage.clear();
  } catch (err) {
    console.error("Logout clearance exception:", err);
  }

  // Force clean redirection to eliminate cached view state
  window.location.replace(redirectPath);
};

/**
 * Submits authentication credentials to POST /api/signin.
 */
export const loginReq = async ({ email, password }) => {
  const data = { email, password };
  try {
    let res = await axios.post(`${apiURL}/api/signin`, data);
    return res.data;
  } catch (error) {
    return {
      error:
        error.response?.data?.error ||
        "Authentication server unreachable. Please verify network.",
    };
  }
};

/**
 * Submits facility registration to POST /api/signup.
 */
export const signupReq = async ({ name, email, password, cPassword }) => {
  const data = { name, email, password, cPassword };
  try {
    let res = await axios.post(`${apiURL}/api/signup`, data);
    return res.data;
  } catch (error) {
    return {
      error:
        error.response?.data?.error ||
        "Registration server unreachable. Please verify network.",
    };
  }
};
