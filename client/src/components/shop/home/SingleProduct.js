import React, { Fragment, useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { getAllProduct } from "../../admin/products/FetchApi";
import { HomeContext } from "./index";
import { LayoutContext } from "../index";
import { isWishReq, unWishReq, isWish } from "./Mixins";
import { getClinicalAsset, getViabilityState } from "../clinicalAssets";

const SingleProduct = () => {
  const { data, dispatch } = useContext(HomeContext);
  const { dispatch: layoutDispatch } = useContext(LayoutContext);
  const { products } = data;
  const history = useHistory();

  const [wList, setWlist] = useState(
    JSON.parse(localStorage.getItem("wishList")) || []
  );
  const [queuedId, setQueuedId] = useState(null);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    dispatch({ type: "loading", payload: true });
    try {
      let responseData = await getAllProduct();
      setTimeout(() => {
        if (responseData && responseData.Products) {
          dispatch({ type: "setProducts", payload: responseData.Products });
          dispatch({ type: "loading", payload: false });
        } else {
          dispatch({ type: "loading", payload: false });
        }
      }, 300);
    } catch (error) {
      console.error(error);
      dispatch({ type: "loading", payload: false });
    }
  };

  const handleQuickRequisition = (e, product) => {
    e.stopPropagation();
    let cart = localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
    let inCart = cart.find((item) => item.id === product._id);
    if (!inCart) {
      cart.push({ id: product._id, quantitiy: 1 });
      localStorage.setItem("cart", JSON.stringify(cart));
      layoutDispatch({ type: "inCart", payload: cart });
      setQueuedId(product._id);
      setTimeout(() => setQueuedId(null), 2000);
    }
    layoutDispatch({ type: "cartModalToggle", payload: true });
  };

  if (data.loading) {
    return (
      <div className="col-span-full py-24 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
        <p className="text-xs font-mono text-cyan-400 uppercase tracking-widest animate-pulse">
          Synchronizing Live Bio-Logistics Inventory & Telemetry...
        </p>
      </div>
    );
  }

  return (
    <Fragment>
      <div className="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
        {products && products.length > 0 ? (
          products.map((item, index) => {
            const asset = getClinicalAsset(item);
            const viability = getViabilityState(item);
            const {
              isStatusDisabled,
              isDisabled,
              isCritical,
              statusLabel,
              timeLabel,
            } = viability;

            return (
              <div
                key={item._id || index}
                onClick={() => history.push(`/products/${item._id}`)}
                className={`vg-glass-card group cursor-pointer relative overflow-hidden flex flex-col justify-between border rounded-2xl transition-all duration-300 hover:scale-[1.01] ${
                  isDisabled
                    ? "border-rose-950/80 opacity-75"
                    : isCritical
                    ? "border-rose-500/60 shadow-xl shadow-rose-950/20"
                    : "border-slate-800 hover:border-cyan-500/50 shadow-lg hover:shadow-cyan-500/10"
                }`}
              >
                {/* Top Section: Clinical Diagnostic Image & Telemetry Badges */}
                <div className="relative h-56 w-full overflow-hidden bg-slate-950">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95 contrast-105"
                    src={asset.primaryImage}
                    alt={asset.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = asset.fallbackImage;
                    }}
                  />

                  {/* Sterile Diagnostic Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-slate-950/40 pointer-events-none"></div>

                  {/* Top Floating Telemetry Chips */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                    <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                      <span className="font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-950/85 backdrop-blur-md text-cyan-300 border border-cyan-500/40 uppercase tracking-wider">
                        {asset.organType} · {item.pName}h
                      </span>
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900/85 backdrop-blur-md text-emerald-300 border border-emerald-500/30 uppercase">
                        {asset.bloodGroup}
                      </span>
                    </div>

                    {/* Standby Watchlist Toggle */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isWish(item._id, wList)) {
                          unWishReq(e, item._id, setWlist);
                        } else {
                          isWishReq(e, item._id, setWlist);
                        }
                      }}
                      className="p-1.5 rounded-full bg-slate-950/80 backdrop-blur-md text-slate-300 hover:text-rose-500 border border-slate-700/60 transition-colors"
                      aria-label="Toggle Watchlist"
                    >
                      <svg
                        className={`w-4 h-4 ${
                          isWish(item._id, wList)
                            ? "fill-current text-rose-500"
                            : "stroke-current fill-none"
                        }`}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Geographic Node & PIN Banner (Prominently Placed) */}
                  <div className="absolute top-12 left-3 z-10">
                    <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-slate-950/90 backdrop-blur-md border border-cyan-500/40 text-cyan-400 font-mono text-[11px] font-bold shadow-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                      <span>PIN: {item.pPrice}</span>
                      <span className="text-slate-500 text-[10px]">({asset.nodeLocation.split(" ")[0]})</span>
                    </span>
                  </div>

                  {/* Prominent Cold Ischemia Viability Countdown Banner */}
                  <div className="absolute bottom-3 left-3 right-3 z-10">
                    <div
                      className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold flex items-center justify-between backdrop-blur-md border shadow-lg ${
                        isDisabled
                          ? "bg-rose-950/95 text-rose-300 border-rose-500/60"
                          : isCritical
                          ? "bg-rose-950/95 text-rose-300 border-rose-500/70 animate-pulse"
                          : "bg-cyan-950/90 text-cyan-300 border-cyan-500/50"
                      }`}
                    >
                      <span className="flex items-center space-x-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isDisabled
                              ? "bg-rose-500"
                              : isCritical
                              ? "bg-rose-400 animate-ping"
                              : "bg-cyan-400"
                          }`}
                        ></span>
                        <span className="text-[10px] tracking-wider uppercase">
                          {statusLabel}
                        </span>
                      </span>
                      <span className="tracking-wide">
                        {timeLabel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Body: Clinical Spec Sheet & Node Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    {/* Organ Title & Modality Tag */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-base font-bold text-white font-display group-hover:text-cyan-400 transition-colors line-clamp-1">
                          {asset.organType} ({item.pName} hrs window)
                        </h3>
                        <p className="text-[11px] font-mono text-cyan-400/90 mt-0.5">
                          {asset.preservationModality}
                        </p>
                      </div>
                    </div>

                    {/* Clinical Specs Highlight Chip */}
                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-400">CLINICAL INDEX:</span>
                        <span className="text-emerald-400 font-semibold">{asset.clinicalMetricBadge}</span>
                      </div>
                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-sans">
                        {item.pDescription}
                      </p>
                    </div>

                    {/* Geographic Node Metadata */}
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                      <span>GEOGRAPHIC PIN:</span>
                      <span className="text-white font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        {item.pPrice}
                      </span>
                    </div>
                  </div>

                  {/* Prominent Call-To-Action Toolbar */}
                  <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2.5">
                    {/* Prominent View Details CTA */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        history.push(`/products/${item._id}`);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white border border-slate-700 hover:border-cyan-500/40 text-xs font-mono font-semibold uppercase tracking-wider text-center transition-all flex items-center justify-center space-x-1"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>View Details</span>
                    </button>

                    {/* Quick Requisition Button */}
                    <button
                      type="button"
                      disabled={isDisabled}
                      onClick={(e) => handleQuickRequisition(e, item)}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider transition-all flex items-center justify-center space-x-1 ${
                        isDisabled
                          ? "bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-800"
                          : queuedId === item._id
                          ? "bg-emerald-500 text-gray-950 shadow-lg shadow-emerald-500/30"
                          : "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98]"
                      }`}
                    >
                      {isDisabled ? (
                        <span>{isStatusDisabled ? "Decommissioned" : "Preservation Expired"}</span>
                      ) : queuedId === item._id ? (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Manifested</span>
                        </>
                      ) : (
                        <span>Queue Manifest</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-20 text-center vg-glass-card p-8">
            <svg className="w-12 h-12 text-slate-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="font-mono text-sm text-slate-300 uppercase tracking-wider">
              No Viable Grafts Matched
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Adjust search parameters, blood group filter, or reset category selection.
            </p>
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default SingleProduct;
