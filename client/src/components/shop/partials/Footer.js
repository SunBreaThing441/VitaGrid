import React, { Fragment } from "react";
import moment from "moment";

const Footer = () => {
  return (
    <Fragment>
      <footer className="mt-auto border-t border-slate-800/80 bg-gray-950/90 backdrop-blur-md py-8 px-4 sm:px-6 lg:px-8 text-xs font-mono text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-center md:text-left">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 flex items-center justify-center font-bold text-sm">
              VG
            </div>
            <div>
              <div className="font-semibold text-slate-200">
                VitaGrid Humanitarian Logistics Network
              </div>
              <div className="text-[11px] text-slate-500">
                Operating under UNESCO Global Life-Critical Allocation Directives
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-[11px]">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>NODE_LINK: PORT_5000_LIVE</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span>ISCHEMIC_VALIDATOR: ACTIVE</span>
            </div>
            <div className="text-slate-500">
              © {moment().format("YYYY")} VitaGrid International. All Rights Reserved.
            </div>
          </div>
        </div>
      </footer>
    </Fragment>
  );
};

export default Footer;
