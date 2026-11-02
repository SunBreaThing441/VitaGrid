import React, { Fragment } from "react";
import { useLocation, useHistory } from "react-router-dom";

const AdminSidebar = () => {
  const location = useLocation();
  const history = useHistory();

  const navItems = [
    {
      title: "Mission Overview",
      subtitle: "Telemetry & KPIs",
      path: "/admin/dashboard",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      ),
    },
    {
      title: "Organ Registry",
      subtitle: "Viability & Ischemia",
      path: "/admin/dashboard/products",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      ),
    },
    {
      title: "Transfer Orders",
      subtitle: "Requisition Pipeline",
      path: "/admin/dashboard/orders",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      ),
    },
    {
      title: "Organ Categories",
      subtitle: "Anatomical Types",
      path: "/admin/dashboard/categories",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
      ),
    },
  ];

  return (
    <Fragment>
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-gray-950/90 vg-glass border-r border-slate-800 p-4 space-y-2 min-h-screen">
        <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">
          Command Modules
        </div>

        {navItems.map((item, idx) => {
          const isActive = location.pathname === item.path;

          return (
            <button
              key={idx}
              onClick={() => history.push(item.path)}
              className={`w-full flex items-center space-x-3.5 px-3.5 py-3 rounded-xl transition-all text-left group ${
                isActive
                  ? "bg-cyan-950/60 border border-cyan-500/50 text-cyan-300 shadow-lg shadow-cyan-950/50"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-900 border border-transparent"
              }`}
            >
              <div
                className={`p-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-cyan-500/20 text-cyan-400"
                    : "bg-slate-900 text-slate-400 group-hover:text-cyan-400"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {item.icon}
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold font-display tracking-wide">{item.title}</div>
                <div className="text-[10px] font-mono text-slate-400 truncate">{item.subtitle}</div>
              </div>
              {isActive && (
                <span className="w-1.5 h-6 rounded-full bg-cyan-400"></span>
              )}
            </button>
          );
        })}

        {/* Live Network Status Box */}
        <div className="mt-auto pt-6">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 font-mono text-[11px] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">NETWORK NODE:</span>
              <span className="text-cyan-400 font-bold">IN-MUMBAI-01</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">ATLAS REPLICA:</span>
              <span className="text-emerald-400 font-bold">HEALTHY</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">DISPATCH COOLDOWN:</span>
              <span className="text-slate-300">0.00s</span>
            </div>
          </div>
        </div>
      </aside>
    </Fragment>
  );
};

export default AdminSidebar;
