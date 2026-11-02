import React, { Fragment } from "react";
import { useHistory } from "react-router-dom";
import { isAuthenticate, logout } from "../../shop/auth/fetchApi";

const AdminNavber = () => {
  const history = useHistory();

  const user = isAuthenticate() ? isAuthenticate().user : null;

  return (
    <Fragment>
      <header className="sticky top-0 z-30 vg-glass border-b border-cyan-500/20 px-6 py-4 flex items-center justify-between shadow-2xl">
        <div className="flex items-center space-x-4">
          <div
            onClick={() => history.push("/admin/dashboard")}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-rose-600 to-indigo-700 flex items-center justify-center border border-rose-400/40 shadow-lg shadow-rose-600/30">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-display font-bold text-lg text-white tracking-wider">
                  VitaGrid <span className="text-rose-400">OPO Command</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-500/40">
                  ROOT CLEARANCE
                </span>
              </div>
              <div className="text-[10px] font-mono text-slate-400">
                Organ Procurement & Allocation Terminal
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => history.push("/")}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 text-xs font-mono text-slate-300 transition-colors"
          >
            <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Public Registry</span>
          </button>

          <div className="flex items-center space-x-3 pl-3 border-l border-slate-800">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-semibold text-slate-200">{user?.name || "OPO Director"}</div>
              <div className="text-[10px] font-mono text-cyan-400">Node ID: CENTRAL-01</div>
            </div>

            <button
              onClick={logout}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 transition-colors"
              title="Terminate Admin Session"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>
    </Fragment>
  );
};

export default AdminNavber;
