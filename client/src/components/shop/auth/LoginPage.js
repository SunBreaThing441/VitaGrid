import React, { useState, useEffect } from "react";
import { useHistory, useLocation, Link } from "react-router-dom";
import { loginReq, isAuthenticate, isAdmin } from "./fetchApi";

const LoginPage = () => {
  const history = useHistory();
  const location = useLocation();

  // If already authenticated, redirect to appropriate destination
  useEffect(() => {
    if (isAuthenticate()) {
      if (isAdmin()) {
        history.replace("/admin/dashboard");
      } else {
        const from = location.state?.from?.pathname || "/user/profile";
        history.replace(from);
      }
    }
  }, [history, location]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Parse intercept notice from navigation guards
  const interceptReason = location.state?.reason;
  const fromPath = location.state?.from?.pathname;

  const handlePreFill = (email, password) => {
    setFormData({ email, password });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation checks
    if (!formData.email.trim() || !formData.password.trim()) {
      return setError("All credentials fields are required.");
    }

    setLoading(true);
    try {
      const responseData = await loginReq({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (responseData.error) {
        setLoading(false);
        setError(responseData.error);
      } else if (responseData.token) {
        // Persist auth artifacts securely
        localStorage.setItem("jwt", JSON.stringify(responseData));
        if (responseData.user) {
          localStorage.setItem("user", JSON.stringify(responseData.user));
        }

        const role =
          responseData.user?.role !== undefined
            ? responseData.user.role
            : responseData.user?.userRole;

        // Route strictly by persona
        if (role === 1) {
          window.location.replace("/admin/dashboard");
        } else {
          const dest = fromPath || "/user/profile";
          window.location.replace(dest);
        }
      } else {
        setLoading(false);
        setError("Invalid response from authorization node.");
      }
    } catch (err) {
      setLoading(false);
      setError("Authorization gateway error. Please verify server connectivity.");
    }
  };

  return (
    <div className="min-h-screen bg-[#050B14] text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 vg-cyber-grid opacity-30 pointer-events-none"></div>
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <Link to="/" className="inline-flex items-center space-x-3 group mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center border border-cyan-400/40 shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-transform">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="text-left">
            <span className="font-display font-extrabold text-xl tracking-tight text-white block">
              Vita<span className="text-cyan-400">Grid</span>
            </span>
            <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase block -mt-1">
              UNESCO Logistics Network
            </span>
          </div>
        </Link>

        <h2 className="text-2xl font-display font-extrabold text-white tracking-tight">
          Terminal Access Gateway
        </h2>
        <p className="mt-1 text-xs font-mono text-slate-400">
          Cryptographic node clearance for transplant hospitals & OPO commanders
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="vg-glass-card rounded-2xl border border-cyan-500/30 shadow-2xl p-6 sm:p-8 space-y-5">
          {/* Intercept Notice if redirected by guards */}
          {interceptReason === "AUTHENTICATION_REQUIRED" && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-start space-x-2">
              <span role="img" aria-label="warning" className="text-amber-400 font-bold">⚠️</span>
              <span>[ACCESS INTERCEPTED] Please sign in with verified hospital credentials to access the requested telemetry terminal.</span>
            </div>
          )}

          {interceptReason === "ADMIN_AUTH_REQUIRED" && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-start space-x-2">
              <span role="img" aria-label="stop" className="text-rose-400 font-bold">⛔</span>
              <span>[ADMIN CLEARANCE REQUIRED] The requested route requires Procurement Admin credentials (`userRole === 1`).</span>
            </div>
          )}

          {interceptReason === "FORBIDDEN_ADMIN_ACCESS" && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-start space-x-2">
              <span role="img" aria-label="forbidden" className="text-rose-400 font-bold">⛔</span>
              <span>[AUTHORIZATION VIOLATION] Standard hospital accounts cannot access administrative OPO controls.</span>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-start space-x-2">
              <span role="img" aria-label="cross" className="text-rose-400 font-bold">✕</span>
              <span>[SECURITY ERROR] {error}</span>
            </div>
          )}

          {/* Quick Demo Credentials */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase tracking-widest">
              <span>ONE-CLICK ROLE PRESETS</span>
              <span className="text-cyan-400">DEMO VERIFIED</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handlePreFill("admin@organease.com", "admin123")}
                className="px-2.5 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-500/30 text-[11px] font-mono transition-colors text-center"
              >
                <span role="img" aria-label="lightning">⚡</span> Procurement Admin
              </button>
              <button
                type="button"
                onClick={() => handlePreFill("hospital@organease.com", "user123")}
                className="px-2.5 py-1.5 rounded-lg bg-blue-950/60 hover:bg-blue-900/80 text-blue-300 border border-blue-500/30 text-[11px] font-mono transition-colors text-center"
              >
                <span role="img" aria-label="hospital">🏥</span> Hospital Unit
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                Institutional Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="officer@hospital.org"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition-colors text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                Passphrase *
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition-colors text-sm font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-mono font-bold uppercase tracking-wider shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Authenticating Cryptographic Key..." : "Authorize Terminal Access"}
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>New hospital unit?</span>
            <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
              Accredit Facility →
            </Link>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-4 text-center">
          <Link to="/" className="text-xs font-mono text-slate-500 hover:text-slate-300 transition-colors">
            ← Return to Public Cold-Chain Registry
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
