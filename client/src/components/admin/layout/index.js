import React, { Fragment } from "react";
import AdminNavber from "../partials/AdminNavber";
import AdminSidebar from "../partials/AdminSidebar";
import AdminFooter from "../partials/AdminFooter";

const AdminLayout = ({ children }) => {
  return (
    <Fragment>
      <div className="min-h-screen flex flex-col bg-gray-950 vg-cyber-grid text-slate-100">
        <AdminNavber />
        <div className="flex-1 flex">
          <AdminSidebar />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
            {children}
          </main>
        </div>
        <AdminFooter />
      </div>
    </Fragment>
  );
};

export default AdminLayout;
