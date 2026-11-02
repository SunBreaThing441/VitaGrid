import React, { Fragment, useContext, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { LayoutContext } from "../index";
import { isAdmin, isAuthenticate, logout } from "../auth/fetchApi";

const Navber = () => {
  const history = useHistory();
  const location = useLocation();
  const { data, dispatch } = useContext(LayoutContext);
  const [userDropdown, setUserDropdown] = useState(false);

  const navberToggleOpen = () =>
    dispatch({ type: "hamburgerToggle", payload: !data.navberHamburger });

  const loginModalOpen = () =>
    dispatch({ type: "loginSignupModalToggle", payload: !data.loginSignupModal });

  const cartModalOpen = () =>
    dispatch({ type: "cartModalToggle", payload: !data.cartModal });

  const loggedUser = isAuthenticate() ? isAuthenticate() : null;
  const userIsAdmin = isAdmin();
  const manifestCount = data.inCart ? data.inCart.length : 0;

  return (
    <Fragment>
      <header className="fixed top-0 left-0 right-0 z-30 vg-glass border-b border-cyan-500/20 shadow-2xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left: Branding & UNESCO Node ID */}
            <div className="flex items-center space-x-4">
              <button
                onClick={navberToggleOpen}
                className="lg:hidden p-2 text-slate-300 hover:text-cyan-400 focus:outline-none"
                aria-label="Toggle Navigation"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <div
                onClick={() => history.push("/")}
                className="flex items-center space-x-3 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-cyan-400/40 group-hover:scale-105 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2">
                    <span className="font-display font-bold text-xl sm:text-2xl tracking-wider vg-text-gradient-cyan">
                      VitaGrid
                    </span>
                    <span className="hidden sm:inline-block text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">
                      UNESCO Node
                    </span>
                  </div>
                  <span className="text-[10px] tracking-widest uppercase font-mono text-slate-400 hidden sm:inline">
                    Humanitarian Logistics Network
                  </span>
                </div>
              </div>
            </div>

            {/* Middle: Desktop Navigation & Live Telemetry Pill */}
            <nav className="hidden lg:flex items-center space-x-8">
              <button
                onClick={() => history.push("/")}
                className={`text-sm font-medium transition-colors hover:text-cyan-400 flex items-center space-x-1.5 ${
                  location.pathname === "/" ? "text-cyan-400 font-semibold" : "text-slate-300"
                }`}
              >
                <span>Organ Registry</span>
              </button>

              <button
                onClick={() => history.push("/wish-list")}
                className={`text-sm font-medium transition-colors hover:text-cyan-400 flex items-center space-x-1.5 ${
                  location.pathname === "/wish-list" ? "text-cyan-400 font-semibold" : "text-slate-300"
                }`}
              >
                <span>Monitored Grafts</span>
              </button>

              {userIsAdmin && (
                <button
                  onClick={() => history.push("/admin/dashboard")}
                  className="text-xs font-mono px-3 py-1.5 rounded-md bg-rose-950/50 text-rose-300 border border-rose-500/40 hover:bg-rose-900/40 transition-colors flex items-center space-x-1.5"
                >
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                  <span>OPO Command Hub</span>
                </button>
              )}

              {/* Real-time Telemetry Pill */}
              <div className="hidden xl:flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/60 text-xs font-mono text-slate-300">
                <span className="vg-pulse-beacon"></span>
                <span>NET_STATUS:</span>
                <span className="text-emerald-400 font-semibold">SYNCHRONIZED</span>
              </div>
            </nav>

            {/* Right: Actions, Manifest Requisition & Profile */}
            <div className="flex items-center space-x-4">
              {/* Tactical Manifest Requisition (Cart) */}
              <button
                onClick={cartModalOpen}
                className="relative p-2.5 rounded-lg bg-slate-900/70 border border-slate-700/60 hover:border-cyan-400/50 hover:bg-slate-800 transition-all flex items-center space-x-2 group"
                title="Tactical Allocation Manifest"
              >
                <svg className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span className="hidden md:inline text-xs font-mono uppercase text-slate-300">Manifest</span>
                {manifestCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white font-mono text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg shadow-rose-600/50 animate-pulse">
                    {manifestCount}
                  </span>
                )}
              </button>

              {/* User Authentication / Profile Terminal */}
              {loggedUser ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdown(!userDropdown)}
                    className="flex items-center space-x-2 p-1.5 sm:px-3 sm:py-2 rounded-lg bg-slate-900/80 border border-cyan-500/30 hover:border-cyan-400 text-xs text-slate-200 transition-all"
                  >
                    <div className="w-6 h-6 rounded-full bg-cyan-600/30 border border-cyan-400 text-cyan-300 flex items-center justify-center font-bold text-xs uppercase">
                      {loggedUser.name ? loggedUser.name.charAt(0) : "U"}
                    </div>
                    <span className="hidden md:inline font-mono font-medium truncate max-w-[120px]">
                      {loggedUser.name || "Station"}
                    </span>
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdown && (
                    <div className="absolute right-0 mt-2 w-56 rounded-xl vg-glass-elevated border border-cyan-500/30 shadow-2xl py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-700/50">
                        <div className="text-xs text-slate-400 font-mono">Logged in as:</div>
                        <div className="text-sm font-semibold text-slate-100 truncate">{loggedUser.name}</div>
                        <div className="text-[10px] font-mono text-cyan-400 mt-0.5">
                          {userIsAdmin ? "ROLE: OPO_ADMINISTRATOR" : "ROLE: TRANSPLANT_HOSPITAL"}
                        </div>
                      </div>

                      {userIsAdmin ? (
                        <button
                          onClick={() => { setUserDropdown(false); history.push("/admin/dashboard"); }}
                          className="w-full text-left px-4 py-2 text-xs font-mono text-slate-200 hover:bg-cyan-950/60 hover:text-cyan-300 flex items-center space-x-2"
                        >
                          <span role="img" aria-label="gear">⚙️</span>
                          <span>OPO Command Center</span>
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => { setUserDropdown(false); history.push("/user/orders"); }}
                            className="w-full text-left px-4 py-2 text-xs font-mono text-slate-200 hover:bg-cyan-950/60 hover:text-cyan-300 flex items-center space-x-2"
                          >
                            <span role="img" aria-label="package">📦</span>
                            <span>Requisition Pipeline</span>
                          </button>
                          <button
                            onClick={() => { setUserDropdown(false); history.push("/user/profile"); }}
                            className="w-full text-left px-4 py-2 text-xs font-mono text-slate-200 hover:bg-cyan-950/60 hover:text-cyan-300 flex items-center space-x-2"
                          >
                            <span role="img" aria-label="hospital">🏥</span>
                            <span>Hospital Account</span>
                          </button>
                        </>
                      )}

                      <div className="border-t border-slate-700/50 my-1"></div>
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-xs font-mono text-rose-400 hover:bg-rose-950/40 flex items-center space-x-2"
                      >
                        <span role="img" aria-label="lock">🔒</span>
                        <span>Terminate Session</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={loginModalOpen}
                  className="vg-btn-primary text-xs uppercase tracking-wider font-mono py-2 px-4 shadow-lg shadow-cyan-500/20"
                >
                  <span>Authenticate</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {data.navberHamburger && (
          <div className="lg:hidden border-t border-slate-800 bg-gray-950/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3">
            <button
              onClick={() => { navberToggleOpen(); history.push("/"); }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-900 hover:text-cyan-400"
            >
              Organ Registry
            </button>
            <button
              onClick={() => { navberToggleOpen(); history.push("/wish-list"); }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-900 hover:text-cyan-400"
            >
              Monitored Grafts
            </button>
            {userIsAdmin && (
              <button
                onClick={() => { navberToggleOpen(); history.push("/admin/dashboard"); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-950/30"
              >
                OPO Command Hub
              </button>
            )}
            {!loggedUser && (
              <button
                onClick={() => { navberToggleOpen(); loginModalOpen(); }}
                className="w-full text-center mt-2 vg-btn-primary py-2 text-xs font-mono"
              >
                Hospital / Admin Sign In
              </button>
            )}
          </div>
        )}
      </header>
    </Fragment>
  );
};

export default Navber;
