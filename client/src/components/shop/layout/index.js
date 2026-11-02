import React, { Fragment, createContext } from "react";
import { Navber, Footer, CartModal } from "../partials";
import LoginSignup from "../auth/LoginSignup";

export const LayoutContext = createContext();

const Layout = ({ children }) => {
  return (
    <Fragment>
      <div className="min-h-screen flex flex-col bg-gray-950 vg-cyber-grid text-slate-100">
        <Navber />
        <LoginSignup />
        <CartModal />
        {/* Main Operational Viewport */}
        <main className="flex-grow pt-20 pb-12 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </main>
        <Footer />
      </div>
    </Fragment>
  );
};

export default Layout;
