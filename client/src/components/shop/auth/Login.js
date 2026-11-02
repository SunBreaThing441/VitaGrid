import React, { Fragment, useState, useContext } from "react";
import { loginReq } from "./fetchApi";
import { LayoutContext } from "../index";

const Login = (props) => {
  const layoutCtx = useContext(LayoutContext) || {};
  const layoutData = layoutCtx.data || {};
  const layoutDispatch = layoutCtx.dispatch;

  const [data, setData] = useState({
    email: "",
    password: "",
    error: false,
    loading: false,
  });

  const formSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!data.email.trim() || !data.password.trim()) {
      return setData((prev) => ({
        ...prev,
        error: "Both institutional email and security passphrase are required.",
      }));
    }

    setData((prev) => ({ ...prev, loading: true, error: false }));
    try {
      let responseData = await loginReq({
        email: data.email.trim(),
        password: data.password,
      });

      if (responseData.error) {
        setData({
          ...data,
          loading: false,
          error: responseData.error,
          password: "",
        });
      } else if (responseData.token) {
        setData({ email: "", password: "", loading: false, error: false });

        // Secure persistence of authenticated tokens and user persona
        localStorage.setItem("jwt", JSON.stringify(responseData));
        if (responseData.user) {
          localStorage.setItem("user", JSON.stringify(responseData.user));
        }

        const role =
          responseData.user?.role !== undefined
            ? responseData.user.role
            : responseData.user?.userRole;

        // Redirect according to authenticated persona
        if (role === 1) {
          window.location.replace("/admin/dashboard");
        } else {
          const fromPath = props.location?.state?.from?.pathname || "/user/profile";
          window.location.replace(fromPath);
        }
      } else {
        setData((prev) => ({
          ...prev,
          loading: false,
          error: "Authorization failed. Unknown response from gateway.",
        }));
      }
    } catch (error) {
      console.error(error);
      setData((prev) => ({
        ...prev,
        loading: false,
        error: "Network error communicating with authentication service.",
      }));
    }
  };

  const handlePreFill = (email, password) => {
    setData({
      email,
      password,
      error: false,
      loading: false,
    });
    if (layoutDispatch) {
      layoutDispatch({ type: "loginSignupError", payload: false });
    }
  };

  return (
    <Fragment>
      {layoutData.loginSignupError && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono">
          [AUTHENTICATION REQUIRED] Please sign in with verified credentials to requisition organ grafts.
        </div>
      )}

      {data.error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-mono">
          [ACCESS DENIED] {data.error}
        </div>
      )}

      {/* Demo Credentials Quick Fill Bar */}
      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase tracking-widest">
          <span>ONE-CLICK ROLE PRESETS</span>
          <span className="text-cyan-400">DEMO VERIFIED</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handlePreFill("admin@organease.com", "admin123")}
            className="px-2.5 py-1.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/30 text-[11px] font-mono transition-colors text-center"
          >
            <span role="img" aria-label="lightning">⚡</span> OPO Admin Officer
          </button>
          <button
            type="button"
            onClick={() => handlePreFill("hospital@organease.com", "user123")}
            className="px-2.5 py-1.5 rounded-lg bg-blue-950/40 hover:bg-blue-900/60 text-blue-300 border border-blue-500/30 text-[11px] font-mono transition-colors text-center"
          >
            <span role="img" aria-label="hospital">🏥</span> Transplant Unit
          </button>
        </div>
      </div>

      <form onSubmit={formSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
            Institutional Email Address *
          </label>
          <input
            type="email"
            required
            placeholder="officer@hospital.org"
            value={data.email}
            onChange={(e) => {
              setData({ ...data, email: e.target.value, error: false });
              if (layoutDispatch) {
                layoutDispatch({ type: "loginSignupError", payload: false });
              }
            }}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors text-sm font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
            Security Passphrase *
          </label>
          <input
            type="password"
            required
            placeholder="••••••••"
            value={data.password}
            onChange={(e) => {
              setData({ ...data, password: e.target.value, error: false });
              if (layoutDispatch) {
                layoutDispatch({ type: "loginSignupError", payload: false });
              }
            }}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors text-sm font-mono"
          />
        </div>

        <button
          type="submit"
          disabled={data.loading}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-mono font-bold uppercase tracking-wider shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
        >
          {data.loading ? "Authenticating Cryptographic Key..." : "Authorize Terminal Access"}
        </button>
      </form>
    </Fragment>
  );
};

export default Login;
