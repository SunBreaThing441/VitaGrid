import React, { Fragment, useContext, useEffect } from "react";
import { DashboardContext } from "./";
import { GetAllData } from "./Action";

const DashboardCard = () => {
  const { data, dispatch } = useContext(DashboardContext);

  useEffect(() => {
    GetAllData(dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const total = data ? data.totalData : { Users: 0, Orders: 0, Products: 0, Categories: 0 };

  const cards = [
    {
      title: "Active Biological Grafts",
      subtitle: "Hypothermic Cold Storage",
      val: total.Products,
      accent: "from-cyan-500 to-blue-600",
      border: "border-cyan-500/30",
      glow: "shadow-cyan-500/10",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      ),
    },
    {
      title: "Transfer Requisitions",
      subtitle: "Active Pipeline Orders",
      val: total.Orders,
      accent: "from-rose-500 to-red-600",
      border: "border-rose-500/30",
      glow: "shadow-rose-500/10",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      ),
    },
    {
      title: "Enrolled Medical Centers",
      subtitle: "Verified Transplant Nodes",
      val: total.Users,
      accent: "from-emerald-500 to-teal-600",
      border: "border-emerald-500/30",
      glow: "shadow-emerald-500/10",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      ),
    },
    {
      title: "Anatomical Categories",
      subtitle: "Preserved Tissue Classifications",
      val: total.Categories,
      accent: "from-amber-500 to-orange-600",
      border: "border-amber-500/30",
      glow: "shadow-amber-500/10",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
      ),
    },
  ];

  return (
    <Fragment>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 my-6">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-2xl vg-glass-card border ${card.border} shadow-xl ${card.glow} flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                {card.subtitle}
              </span>
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${card.accent} flex items-center justify-center text-white shadow-md`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {card.icon}
                </svg>
              </div>
            </div>

            <div>
              <div className="text-3xl font-display font-extrabold text-white tracking-tight">
                {card.val}
              </div>
              <div className="text-xs font-semibold text-slate-200 mt-1">
                {card.title}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span>LIVE ATLAS SYNC</span>
              <span className="text-emerald-400 font-bold">● OK</span>
            </div>
          </div>
        ))}
      </div>
    </Fragment>
  );
};

export default DashboardCard;
