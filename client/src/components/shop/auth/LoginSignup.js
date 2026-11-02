import React, { Fragment, useState, useContext } from "react";
import Login from "./Login";
import Signup from "./Signup";
import { LayoutContext } from "../index";

const LoginSignup = (props) => {
  const { data, dispatch } = useContext(LayoutContext);
  const [login, setLogin] = useState(true);

  const closeLoginModal = () => {
    dispatch({ type: "loginSignupModalToggle", payload: false });
    dispatch({ type: "loginSignupError", payload: false });
  };

  if (!data.loginSignupModal) return null;

  return (
    <Fragment>
      {/* Dark Backdrop */}
      <div
        onClick={closeLoginModal}
        className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-md transition-opacity cursor-pointer"
      />

      {/* Modal Viewport */}
      <section
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            closeLoginModal();
          }
        }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      >
        <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl shadow-cyan-500/10 p-6 md:p-8 space-y-6 my-8">
          {/* Close button with elevated z-index and click isolation */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              closeLoginModal();
            }}
            className="absolute top-5 right-5 z-30 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal dialog"
          >
            <svg className="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Modal Header */}
          <div className="text-center space-y-1 pr-8">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-mono uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>UNESCO LOGISTICS NETWORK · SECURE GATEWAY</span>
            </div>
            <h2 className="text-2xl font-bold text-white font-display">
              {login ? "Hospital Authentication" : "Accredit New Facility"}
            </h2>
            <p className="text-xs text-slate-400">
              {login
                ? "Enter institutional credentials to authorize organ allocation requests."
                : "Register a clinical transplant hospital unit for verified cold-chain logistics."}
            </p>
          </div>

          {/* Tab Form Toggle */}
          <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
            <button
              type="button"
              onClick={() => setLogin(true)}
              className={`flex-1 py-2 text-xs font-mono font-semibold uppercase tracking-wider rounded-lg transition-all ${
                login
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Sign In (Terminal)
            </button>
            <button
              type="button"
              onClick={() => setLogin(false)}
              className={`flex-1 py-2 text-xs font-mono font-semibold uppercase tracking-wider rounded-lg transition-all ${
                !login
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Accredit Hospital
            </button>
          </div>

          {/* Forms */}
          {login ? <Login /> : <Signup />}
        </div>
      </section>
    </Fragment>
  );
};

export default LoginSignup;
