import React, { Fragment } from "react";
import moment from "moment";

const AdminFooter = () => {
  return (
    <Fragment>
      <footer className="mt-auto border-t border-slate-800 bg-gray-950/90 py-4 px-6 text-center text-xs font-mono text-slate-400">
        VitaGrid OPO Command System • UNESCO Humanitarian Logistics Protocol © {moment().format("YYYY")}
      </footer>
    </Fragment>
  );
};

export default AdminFooter;
