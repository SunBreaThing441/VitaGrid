import React, { Fragment, useContext } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { logout } from "./Action";
import { DashboardUserContext } from "./Layout";

const Sidebar = (props) => {
  const { data } = useContext(DashboardUserContext);
  const history = useHistory();
  const location = useLocation();

  const navItems = [
    {
      name: "Requisition Missions",
      path: "/user/orders",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
    },
    {
      name: "Hospital Facility Profile",
      path: "/user/profile",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      name: "Security & Credentials",
      path: "/user/setting",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
    },
  ];

  return (
    <Fragment>
      <div className="w-full lg:w-3/12 space-y-6">
        {/* User Card */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 backdrop-blur-xl">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 font-display font-bold text-lg">
              {data.userDetails && data.userDetails.name ? data.userDetails.name.charAt(0).toUpperCase() : "H"}
            </div>
            <div className="overflow-hidden">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block">
                CREDENTIALED REQUISITION UNIT
              </span>
              <h2 className="text-sm font-bold text-white font-display truncate">
                {data.userDetails ? data.userDetails.name : "Authorized Hospital"}
              </h2>
              <span className="text-[11px] font-mono text-slate-400 block truncate">
                {data.userDetails ? data.userDetails.email : ""}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>NETWORK STATUS</span>
            <span className="text-emerald-400 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>ONLINE</span>
            </span>
          </div>
        </div>

        {/* Navigation Rail */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden divide-y divide-slate-800/60">
          {navItems.map((item, idx) => {
            const isActive = location.pathname === item.path;
            return (
              <div
                key={idx}
                onClick={() => history.push(item.path)}
                className={`flex items-center space-x-3 px-4 py-3.5 cursor-pointer text-xs font-mono transition-all ${
                  isActive
                    ? "bg-cyan-500/10 text-cyan-400 border-l-2 border-cyan-400 font-semibold"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </div>
            );
          })}

          <div
            onClick={() => logout()}
            className="flex items-center space-x-3 px-4 py-3.5 cursor-pointer text-xs font-mono text-rose-400/80 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Terminate Mission Session</span>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Sidebar;
