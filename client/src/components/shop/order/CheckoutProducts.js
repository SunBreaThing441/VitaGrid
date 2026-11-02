import React, { Fragment, useEffect, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { LayoutContext } from "../layout";
import { quantity, totalCost } from "../partials/Mixins";

import { cartListProduct } from "../partials/FetchApi";
import { getBrainTreeToken, getPaymentProcess } from "./FetchApi";
import { fetchData, fetchbrainTree, pay } from "./Action";
import { getClinicalAsset, getViabilityState } from "../clinicalAssets";

import DropIn from "braintree-web-drop-in-react";

export const CheckoutComponent = (props) => {
  const history = useHistory();
  const { data, dispatch } = useContext(LayoutContext);

  const [state, setState] = useState({
    address: "",
    phone: "",
    error: false,
    success: false,
    clientToken: null,
    instance: {},
  });

  const hasInvalidGraft =
    data.cartProduct &&
    data.cartProduct.some((product) => {
      const v = getViabilityState(product);
      return v.isDisabled;
    });

  useEffect(() => {
    fetchData(cartListProduct, dispatch);
    fetchbrainTree(getBrainTreeToken, setState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (data.loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
        <p className="text-xs font-mono text-cyan-400 uppercase tracking-widest animate-pulse">
          Initializing Requisition Terminal & Cryptographic Token...
        </p>
      </div>
    );
  }

  return (
    <Fragment>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {/* Terminal Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-slate-800 gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
                STAGE 03 / LOGISTICS ALLOCATION & DISPATCH
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white font-display mt-1">
              Secure Requisition Terminal
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              Authorize cryo-transit dispatch, register receiving hospital surgical bay, and sign humanitarian chain of custody.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
              ALLOCATED GRAFTS: <span className="text-cyan-400 font-bold">{data.cartProduct ? data.cartProduct.length : 0}</span>
            </span>
          </div>
        </div>

        {/* 2-Column Terminal Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Requisition Manifest */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono text-slate-400">
              <span>MANIFEST SPECIMEN ITEMS</span>
              <span>COLD ISCHEMIA TOLERANCE</span>
            </div>
            <CheckoutProducts products={data.cartProduct} />
          </div>

          {/* Right Column: Hospital Delivery & Cryptographic Authorization */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl p-6 md:p-8 shadow-2xl shadow-cyan-500/5 space-y-6">
              <div className="pb-4 border-b border-slate-800">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                  DESTINATION REQUISITION
                </span>
                <h2 className="text-lg font-bold text-white font-display mt-0.5">
                  Receiving Surgical Unit
                </h2>
              </div>

              {state.error && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-mono">
                  [DISPATCH ERROR] {state.error}
                </div>
              )}

              {hasInvalidGraft && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
                  [REQUISITION BLOCKED] One or more specimens in the manifest have exceeded cold ischemia tolerance or are decommissioned. Please remove expired grafts to proceed with dispatch.
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="address" className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                    Hospital Delivery Address & Surgical Suite *
                  </label>
                  <textarea
                    rows={2}
                    id="address"
                    value={state.address}
                    onChange={(e) =>
                      setState({
                        ...state,
                        address: e.target.value,
                        error: false,
                      })
                    }
                    placeholder="e.g. AIIMS Trauma Center, Operation Theatre 4, New Delhi"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors text-xs font-mono resize-none"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                    Procurement Officer Hotline (24/7 Phone) *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={state.phone}
                    onChange={(e) =>
                      setState({
                        ...state,
                        phone: e.target.value,
                        error: false,
                      })
                    }
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors text-sm font-mono"
                  />
                </div>
              </div>

              {/* Braintree Drop-in Container */}
              <div className="pt-2">
                <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Cryptographic Protocol Token</span>
                  <span className="text-[10px] text-cyan-400">BRAINTREE SANDBOX</span>
                </label>

                {state.clientToken !== null ? (
                  <div className="rounded-xl p-3 bg-slate-950/90 border border-slate-800 braintree-wrapper">
                    <DropIn
                      options={{
                        authorization: state.clientToken,
                      }}
                      onInstance={(instance) => {
                        state.instance = instance;
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
                    <span className="text-xs font-mono text-slate-500">
                      Negotiating Handshake...
                    </span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                type="button"
                disabled={hasInvalidGraft || !data.cartProduct || data.cartProduct.length === 0}
                onClick={() =>
                  pay(
                    data,
                    dispatch,
                    state,
                    setState,
                    getPaymentProcess,
                    () => (totalCost() > 0 ? String(totalCost()) : "10.00"),
                    history
                  )
                }
                className={`w-full py-3.5 px-6 rounded-xl text-white text-xs font-mono font-bold uppercase tracking-widest transition-all flex items-center justify-center space-x-2 ${
                  hasInvalidGraft || !data.cartProduct || data.cartProduct.length === 0
                    ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                    : "bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.01] active:scale-[0.99]"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Authorize Humanitarian Dispatch</span>
              </button>

              <div className="text-center">
                <span className="text-[10px] font-mono text-slate-500">
                  SECURED VIA UNESCO HUMANITARIAN REGISTRY & HL7 INTEROP
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

const CheckoutProducts = ({ products }) => {
  const history = useHistory();

  if (!products || products.length === 0) {
    return (
      <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-dashed border-slate-800">
        <p className="text-slate-400 font-mono text-sm">
          No organ grafts currently queued for dispatch requisition.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {products.map((product, index) => {
        const viability = getViabilityState(product);
        const {
          isDisabled,
          isCritical,
          statusLabel,
          timeLabel,
        } = viability;

        return (
          <div
            key={product._id || index}
            className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              isDisabled
                ? "bg-rose-950/20 border-rose-900/60 opacity-80"
                : "bg-slate-900/60 border-slate-800 hover:border-cyan-500/30"
            }`}
          >
            <div className="flex items-center space-x-4">
              <div
                onClick={() => history.push(`/products/${product._id}`)}
                className="w-16 h-16 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex-shrink-0 cursor-pointer"
              >
                <img
                  className="w-full h-full object-cover object-center"
                  src={getClinicalAsset(product).primaryImage}
                  alt="Graft Specimen"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = getClinicalAsset(product).fallbackImage;
                  }}
                />
              </div>

              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                  DONOR NODE PIN: {product.pPrice}
                </span>
                <h3
                  onClick={() => history.push(`/products/${product._id}`)}
                  className="text-sm font-bold text-white hover:text-cyan-400 cursor-pointer transition-colors line-clamp-1"
                >
                  {product.pDescription || "Humanitarian Organ Graft"}
                </h3>
                <div className="flex items-center space-x-3 mt-1 text-xs font-mono text-slate-400">
                  <span>Requisition: <strong className="text-white">{quantity(product._id)} Units</strong></span>
                  <span>·</span>
                  <span>Tolerance: <strong className="text-cyan-400">{product.pName}h</strong></span>
                </div>
              </div>
            </div>

            {/* Ischemia Timer Badge */}
            <div className="sm:text-right flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                {statusLabel}
              </span>
              <span
                className={`mt-0.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider ${
                  isDisabled
                    ? "bg-rose-500/10 text-rose-400 border border-rose-500/30 animate-pulse"
                    : isCritical
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                    : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                }`}
              >
                {timeLabel}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CheckoutProducts;
