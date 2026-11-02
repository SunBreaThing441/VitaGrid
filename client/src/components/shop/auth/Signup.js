import React, { Fragment, useState } from "react";
import { signupReq } from "./fetchApi";

const Signup = (props) => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    cPassword: "",
    error: {},
    loading: false,
    success: false,
  });

  const formSubmit = async (e) => {
    if (e) e.preventDefault();
    setData((prev) => ({ ...prev, loading: true }));

    if (data.cPassword !== data.password) {
      return setData({
        ...data,
        loading: false,
        error: {
          cPassword: "Passphrases do not match",
          password: "Passphrases do not match",
        },
      });
    }

    try {
      let responseData = await signupReq({
        name: data.name,
        email: data.email,
        password: data.password,
        cPassword: data.cPassword,
      });
      if (responseData.error) {
        setData({
          ...data,
          loading: false,
          error: typeof responseData.error === "object" ? responseData.error : { general: responseData.error },
          password: "",
          cPassword: "",
        });
      } else if (responseData.success) {
        setData({
          success: responseData.success,
          name: "",
          email: "",
          password: "",
          cPassword: "",
          loading: false,
          error: {},
        });
      }
    } catch (error) {
      console.error(error);
      setData((prev) => ({ ...prev, loading: false }));
    }
  };

  const getErrorMessage = (field) => {
    if (!data.error) return null;
    return data.error[field] || (field === "general" ? data.error.general : null);
  };

  return (
    <Fragment>
      {data.success && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono">
          [ACCREDITATION ISSUED] {data.success} Please proceed to Sign In.
        </div>
      )}

      {getErrorMessage("general") && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-mono">
          [REGISTRATION REJECTED] {getErrorMessage("general")}
        </div>
      )}

      <form onSubmit={formSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
            Hospital / Transplant Center Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Apollo Multi-Specialty Surgical Center"
            value={data.name}
            onChange={(e) =>
              setData({
                ...data,
                success: false,
                error: {},
                name: e.target.value,
              })
            }
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors text-sm"
          />
          {getErrorMessage("name") && (
            <span className="text-[10px] font-mono text-rose-400 mt-1 block">
              {getErrorMessage("name")}
            </span>
          )}
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
            Accredited Institutional Email *
          </label>
          <input
            type="email"
            required
            placeholder="transplant-procurement@hospital.org"
            value={data.email}
            onChange={(e) =>
              setData({
                ...data,
                success: false,
                error: {},
                email: e.target.value,
              })
            }
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors text-sm font-mono"
          />
          {getErrorMessage("email") && (
            <span className="text-[10px] font-mono text-rose-400 mt-1 block">
              {getErrorMessage("email")}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
              Passphrase *
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={data.password}
              onChange={(e) =>
                setData({
                  ...data,
                  success: false,
                  error: {},
                  password: e.target.value,
                })
              }
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors text-sm font-mono"
            />
            {getErrorMessage("password") && (
              <span className="text-[10px] font-mono text-rose-400 mt-1 block">
                {getErrorMessage("password")}
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
              Confirm Passphrase *
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={data.cPassword}
              onChange={(e) =>
                setData({
                  ...data,
                  success: false,
                  error: {},
                  cPassword: e.target.value,
                })
              }
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors text-sm font-mono"
            />
            {getErrorMessage("cPassword") && (
              <span className="text-[10px] font-mono text-rose-400 mt-1 block">
                {getErrorMessage("cPassword")}
              </span>
            )}
          </div>
        </div>

        <div className="text-[11px] font-mono text-slate-400 py-1">
          By accrediting, you confirm compliance with the UNESCO 2026 Declaration on Global Organ Transplantation and Ethical Logistics.
        </div>

        <button
          type="submit"
          disabled={data.loading}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-mono font-bold uppercase tracking-wider shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
        >
          {data.loading ? "Registering Institutional Credentials..." : "Submit Hospital Accreditation"}
        </button>
      </form>
    </Fragment>
  );
};

export default Signup;
