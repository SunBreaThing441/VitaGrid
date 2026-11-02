import React, { Fragment, useState, useContext } from "react";
import Layout from "./Layout";
import { handleChangePassword } from "./Action";
import { DashboardUserContext } from "./Layout";

const SettingComponent = () => {
  const { data, dispatch } = useContext(DashboardUserContext);

  const [fData, setFdata] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    success: false,
    error: false,
    passwordView: false,
    type: "password",
  });

  if (fData.success || fData.error) {
    setTimeout(() => {
      setFdata((prev) => ({ ...prev, success: false, error: false }));
    }, 2500);
  }

  if (data.loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 space-y-4">
        <div className="w-12 h-12 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
        <p className="text-xs font-mono text-cyan-400 uppercase tracking-widest animate-pulse">
          Accessing Cryptographic Vault...
        </p>
      </div>
    );
  }

  return (
    <Fragment>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                CRYPTOGRAPHIC CREDENTIALS
              </span>
            </div>
            <h1 className="text-xl font-bold text-white font-display mt-0.5">
              Access Token & Passphrase Security
            </h1>
            <p className="text-xs text-slate-400">
              Update terminal encryption secret for OPO authorization.
            </p>
          </div>
          <span className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
            AES-256 ENCRYPTED
          </span>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-6 md:p-8 space-y-6">
          {fData.success && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono">
              [KEY UPDATED] {fData.success}
            </div>
          )}
          {fData.error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-mono">
              [SECURITY ALERT] {fData.error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="oldPassword" className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                Current Access Passphrase
              </label>
              <div className="relative">
                <input
                  id="oldPassword"
                  type={fData.type}
                  value={fData.oldPassword}
                  onChange={(e) => setFdata({ ...fData, oldPassword: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors text-sm pr-12 font-mono"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFdata({
                      ...fData,
                      passwordView: !fData.passwordView,
                      type: fData.passwordView ? "password" : "text",
                    })
                  }
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-cyan-400"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {fData.passwordView ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-7 0a7 7 0 1114 0 7 7 0 01-14 0z" />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                New Cryptographic Passphrase
              </label>
              <input
                id="newPassword"
                type="password"
                value={fData.newPassword}
                onChange={(e) => setFdata({ ...fData, newPassword: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors text-sm font-mono"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                Confirm Cryptographic Passphrase
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={fData.confirmPassword}
                onChange={(e) => setFdata({ ...fData, confirmPassword: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors text-sm font-mono"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => handleChangePassword(fData, setFdata, dispatch)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-mono uppercase tracking-wider font-semibold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Re-Key Security Passphrase
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

const SettingUser = (props) => {
  return (
    <Fragment>
      <Layout children={<SettingComponent />} />
    </Fragment>
  );
};

export default SettingUser;
