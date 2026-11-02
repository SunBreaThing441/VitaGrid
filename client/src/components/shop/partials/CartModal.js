import React, { Fragment, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { LayoutContext } from "../index";
import { cartListProduct } from "./FetchApi";
import { cartList } from "../productDetails/Mixins";
import { quantity, totalCost } from "./Mixins";
import { getClinicalAsset, getViabilityState } from "../clinicalAssets";

const CartModal = () => {
  const history = useHistory();
  const { data, dispatch } = useContext(LayoutContext);
  const products = data.cartProduct;

  const closeCartModal = () => {
    dispatch({ type: "cartModalToggle", payload: false });
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      let responseData = await cartListProduct();
      if (responseData && responseData.Products) {
        dispatch({ type: "cartProduct", payload: responseData.Products });
        dispatch({ type: "cartTotalCost", payload: totalCost() });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const removeCartProduct = (id) => {
    let cart = localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
    if (cart.length !== 0) {
      cart = cart.filter((item) => item.id !== id);
      localStorage.setItem("cart", JSON.stringify(cart));
      fetchData();
      dispatch({ type: "inCart", payload: cartList() });
      dispatch({ type: "cartTotalCost", payload: totalCost() });
    }
    if (cart.length === 0) {
      dispatch({ type: "cartProduct", payload: null });
      fetchData();
      dispatch({ type: "inCart", payload: cartList() });
    }
  };

  const isModalOpen = Boolean(data.cartModal);
  const hasDecommissionedGraft =
    products &&
    products.some((item) => {
      const v = getViabilityState(item);
      return v.isDisabled;
    });

  return (
    <Fragment>
      {/* Backdrop Blur Overlay */}
      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          closeCartModal();
        }}
        style={{
          opacity: isModalOpen ? 1 : 0,
          visibility: isModalOpen ? "visible" : "hidden",
          pointerEvents: isModalOpen ? "auto" : "none",
        }}
        className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm transition-all duration-300 cursor-pointer"
      />

      {/* Manifest Drawer */}
      <aside
        style={{
          transform: isModalOpen ? "translateX(0)" : "translateX(100%)",
          visibility: isModalOpen ? "visible" : "hidden",
          pointerEvents: isModalOpen ? "auto" : "none",
        }}
        className="transform fixed z-50 top-0 right-0 h-full w-full sm:w-[480px] bg-slate-950/95 vg-glass-elevated border-l border-cyan-500/30 flex flex-col justify-between shadow-2xl transition-all duration-300 ease-out"
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-display font-bold text-slate-100 tracking-wide uppercase">
                Tactical Allocation Manifest
              </h2>
              <div className="text-xs font-mono text-cyan-400">
                Active Biological Grafts: {products ? products.length : 0}
              </div>
            </div>
          </div>
          {/* Close Manifest Cross Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              closeCartModal();
            }}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer z-30"
            aria-label="Close Manifest"
          >
            <svg className="w-6 h-6 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Payload Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {products && products.length > 0 ? (
            products.map((item, index) => {
              const viability = getViabilityState(item);
              const {
                isDisabled,
                isCritical,
                statusLabel,
                timeLabel,
              } = viability;

              return (
                <div
                  key={item._id || index}
                  className={`p-3.5 rounded-xl border transition-all flex flex-col space-y-2.5 relative group ${
                    isDisabled
                      ? "bg-rose-950/20 border-rose-900/60 opacity-80"
                      : "bg-slate-900/80 border-slate-800 hover:border-cyan-500/40"
                  }`}
                >
                  <div className="flex space-x-3.5">
                    <img
                      className="w-20 h-20 rounded-lg object-cover border border-slate-700 bg-slate-950 flex-shrink-0"
                      src={getClinicalAsset(item).primaryImage}
                      alt={item.pDescription}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getClinicalAsset(item).fallbackImage;
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-semibold text-cyan-300 uppercase tracking-wider truncate">
                          {item.pCategory?.cName || "Organ Payload"}
                        </span>
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                          QTY: {quantity(item._id)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                        {item.pDescription}
                      </p>
                      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-800/60 font-mono text-xs">
                        <span className="text-slate-400">
                          Origin Node PIN: <span className="text-slate-200 font-bold">{item.pPrice}</span>
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isDisabled
                            ? "bg-rose-950 text-rose-400 border border-rose-500/50"
                            : isCritical
                            ? "bg-amber-950 text-amber-400 border border-amber-500/50 animate-pulse"
                            : "bg-emerald-950 text-emerald-400 border border-emerald-500/50"
                        }`}>
                          {statusLabel}: {timeLabel}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeCartProduct(item._id)}
                    className="absolute top-2 right-2 text-slate-500 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                    title="Remove from manifest"
                  >
                    <svg className="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              );
            })
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-500">
              <svg className="w-12 h-12 text-slate-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <p className="text-sm font-mono uppercase tracking-wider text-slate-400">
                Manifest Registry Empty
              </p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Select viable donor organs from the active cold-chain registry to initiate requisition.
              </p>
            </div>
          )}
        </div>

        {/* Drawer Footer & Action Terminal */}
        <div className="p-5 border-t border-slate-800 bg-slate-950/80 space-y-4">
          {hasDecommissionedGraft && (
            <div className="p-2.5 rounded-lg bg-rose-950/80 border border-rose-500/50 text-rose-300 font-mono text-[11px] leading-tight">
              <span role="img" aria-label="warning" className="mr-1">⚠️</span> MANIFEST CONTAINS EXPIRED / RETIRED GRAFTS. REMOVE THEM TO INITIATE CLEARANCE.
            </div>
          )}
          <div className="flex items-center justify-between font-mono text-sm">
            <span className="text-slate-400">Routing Clearance Protocol:</span>
            <span className={hasDecommissionedGraft ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"}>
              {hasDecommissionedGraft ? "BLOCKED: REQUISITION VIOLATION" : "READY FOR DISPATCH"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={closeCartModal}
              className="vg-btn-secondary text-xs uppercase font-mono py-2.5 cursor-pointer"
            >
              Continue Review
            </button>
            <button
              type="button"
              disabled={!products || products.length === 0 || hasDecommissionedGraft}
              onClick={() => {
                closeCartModal();
                history.push("/checkout");
              }}
              className={`vg-btn-primary text-xs uppercase font-mono py-2.5 cursor-pointer ${
                !products || products.length === 0 || hasDecommissionedGraft ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
              }`}
            >
              Initiate Protocol
            </button>
          </div>
        </div>
      </aside>
    </Fragment>
  );
};

export default CartModal;
