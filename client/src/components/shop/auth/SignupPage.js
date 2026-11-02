import React, { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import { signupReq, isAuthenticate, isAdmin } from "./fetchApi";

const SignupPage = () => {
  const history = useHistory();

  // If already authenticated, redirect
  useEffect(() => {
    if (isAuthenticate()) {
      if (isAdmin()) {
        history.replace("/admin/dashboard");
      } else {
        history.replace("/user/profile");
      }
    }
  }, [history]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    cPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({});
    setSuccess(null);

    // Front-end validation checks
    const validationErrors = {};
    if (!formData.name || formData.name.trim().length < 3 || formData.name.trim().length > 25) {
      validationErrors.name = "Hospital/Facility name must be between 3 and 25 characters.";
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      validationErrors.email = "Please provide a valid institutional email address.";
    }
    if (!formData.password || formData.password.length < 8) {
      validationErrors.password = "Security passphrase must be at least 8 characters.";
    }
    if (formData.password !== formData.cPassword) {
      validationErrors.cPassword = "Passphrases do not match.";
    }

    if (Object.keys(validationErrors).length > 0) {
      return setError(validationErrors);
    }

    setLoading(true);
    try {
      const responseData = await signupReq({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        cPassword: formData.cPassword,
      });

      if (responseData.error) {
        setLoading(false);
        setError(
          typeof responseData.error === "object"
            ? responseData.error
            : { general: responseData.error }
        );
      } else if (responseData.success) {
        setLoading(false);
        setSuccess(responseData.success);
        setFormData({
          name: "",
          email: "",
          password: "",
          cPassword: "",
        });
      } else {
        setLoading(false);
        setError({ general: "Invalid response from accreditation service." });
      }
    } catch (err) {
      setLoading(false);
      setError({ general: "Accreditation gateway unreachable." });
    }
  };

  return (
    <div className="min-h-screen bg-[#050B14] text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 vg-cyber-grid opacity-30 pointer-events-none"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-lg relative z-10 text-center">
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
          Facility Accreditation Portal
        </h2>
        <p className="mt-1 text-xs font-mono text-slate-400">
          Register an accredited clinical transplant hospital for cold-chain requisition clearance
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg relative z-10">
        <div className="vg-glass-card rounded-2xl border border-cyan-500/30 shadow-2xl p-6 sm:p-8 space-y-5">
          {success && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono space-y-2">
              <div className="flex items-center space-x-2 font-bold text-sm">
                <span>✓</span>
                <span>[ACCREDITATION ISSUED] {success}</span>
              </div>
              <p className="text-slate-300 text-[11px]">
                Your clinical entity has been enrolled in the VitaGrid node registry. Please proceed to authenticate.
              </p>
              <Link
                to="/login"
                className="inline-block mt-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Proceed to Terminal Login →
              </Link>
            </div>
          )}

          {error.general && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-start space-x-2">
              <span className="text-rose-400 font-bold">✕</span>
              <span>[REJECTED] {error.general}</span>
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                  Hospital / Transplant Center Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Apollo Multi-Specialty Surgical Center"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition-colors text-sm font-mono"
                />
                {error.name && (
                  <span className="text-[10px] font-mono text-rose-400 mt-1 block">
                    {error.name}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                  Institutional Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="transplant-procurement@hospital.org"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition-colors text-sm font-mono"
                />
                {error.email && (
                  <span className="text-[10px] font-mono text-rose-400 mt-1 block">
                    {error.email}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                    Security Passphrase *
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Min 8 characters"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition-colors text-sm font-mono"
                  />
                  {error.password && (
                    <span className="text-[10px] font-mono text-rose-400 mt-1 block">
                      {error.password}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                    Confirm Passphrase *
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.cPassword}
                    onChange={(e) => setFormData({ ...formData, cPassword: e.target.value })}
                    placeholder="Re-enter passphrase"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition-colors text-sm font-mono"
                  />
                  {error.cPassword && (
                    <span className="text-[10px] font-mono text-rose-400 mt-1 block">
                      {error.cPassword}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-[11px] font-mono text-slate-400 py-1 leading-relaxed">
                By submitting accreditation, your clinical unit affirms adherence to UNESCO Humanitarian Protocol #418-VITA and national organ allocation directives.
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-mono font-bold uppercase tracking-wider shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Registering Institutional Credentials..." : "Submit Hospital Accreditation"}
              </button>
            </form>
          )}

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Already accredited?</span>
            <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
              Access Terminal →
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

export default SignupPage;
