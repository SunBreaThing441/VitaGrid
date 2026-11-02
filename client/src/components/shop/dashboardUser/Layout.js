import React, { Fragment, createContext, useReducer, useEffect } from "react";
import { Navber, Footer, CartModal } from "../partials";
import Sidebar from "./Sidebar";
import {
  dashboardUserState,
  dashboardUserReducer,
} from "./DashboardUserContext";
import { fetchData } from "./Action";

export const DashboardUserContext = createContext();

const Layout = ({ children }) => {
  const [data, dispatch] = useReducer(dashboardUserReducer, dashboardUserState);

  useEffect(() => {
    fetchData(dispatch);
  }, []);

  return (
    <Fragment>
      <DashboardUserContext.Provider value={{ data, dispatch }}>
        <div className="flex-grow min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
          <div>
            <Navber />
            <CartModal />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                <Sidebar />
                <div className="w-full lg:w-9/12">
                  {children}
                </div>
              </div>
            </main>
          </div>
          <Footer />
        </div>
      </DashboardUserContext.Provider>
    </Fragment>
  );
};

export default Layout;
