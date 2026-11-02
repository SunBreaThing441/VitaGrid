import React, { Fragment, useContext, useEffect, useState } from "react";
import { getAllProduct, deleteProduct } from "./FetchApi";
import moment from "moment";
import { ProductContext } from "./index";
import { getClinicalAsset, getViabilityState } from "../../shop/clinicalAssets";

const apiURL = process.env.REACT_APP_API_URL;

const AllProduct = () => {
  const { data, dispatch } = useContext(ProductContext);
  const { products } = data;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    setLoading(true);
    let responseData = await getAllProduct();
    setTimeout(() => {
      if (responseData && responseData.Products) {
        dispatch({
          type: "fetchProductsAndChangeState",
          payload: responseData.Products,
        });
        setLoading(false);
      }
    }, 400);
  };

  const deleteProductReq = async (pId) => {
    if (window.confirm("Confirm deletion of biological graft from active registry?")) {
      let deleteC = await deleteProduct(pId);
      if (deleteC && deleteC.success) {
        fetchData();
      }
    }
  };

  const editProduct = (pId, product, type) => {
    if (type) {
      dispatch({
        type: "editProductModalOpen",
        product: { ...product, pId: pId },
      });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center">
        <div className="w-12 h-12 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin"></div>
        <p className="mt-4 text-xs font-mono uppercase text-slate-400">Querying Cold Storage Registry...</p>
      </div>
    );
  }

  return (
    <Fragment>
      <div className="space-y-4 my-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-display font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span>Active Biological Grafts Telemetry</span>
            </h2>
            <p className="text-xs font-mono text-slate-400 mt-0.5">
              Live monitoring of cold ischemia tolerance thresholds and donor center routing nodes
            </p>
          </div>
          <span className="font-mono text-xs font-bold px-3 py-1 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/40">
            Total Grafts: {products ? products.length : 0}
          </span>
        </div>

        {/* Responsive Telemetry Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {products && products.length > 0 ? (
            products.map((product, index) => {
              const asset = getClinicalAsset(product);
              const viability = getViabilityState(product);
              const {
                expirationDate,
                toleranceHours,
                isExpired,
                isStatusDisabled,
                isDisabled,
                isCritical,
                statusLabel,
                timeLabel,
              } = viability;

              const fallbackUrl = `${apiURL}/uploads/products/${product.pImages && product.pImages[0] ? product.pImages[0] : ""}`;
              const primaryImg = asset.primaryImage || fallbackUrl;

              return (
                <div
                  key={index}
                  className={`p-5 rounded-2xl vg-glass-card border flex flex-col justify-between transition-all group ${
                    isDisabled
                      ? "border-rose-950 bg-rose-950/10 opacity-75"
                      : isCritical
                      ? "border-rose-500/50 shadow-lg shadow-rose-950/30"
                      : "border-slate-800 hover:border-cyan-500/40"
                  }`}
                >
                  <div>
                    {/* Top Header Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-cyan-500/30 uppercase">
                          {product.pCategory?.cName || "Organ"}
                        </span>
                        <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-500/40">
                          {asset.bloodGroup}
                        </span>
                      </div>
                      <span className="font-mono text-xs text-slate-400 flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        <span>PIN:</span>
                        <span className="text-white font-bold">{asset.pin}</span>
                      </span>
                    </div>

                    {/* Image & Viability Meter */}
                    <div className="relative h-44 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 mb-3 group-hover:border-cyan-500/40 transition-colors">
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        src={primaryImg}
                        alt={asset.title || product.pDescription}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = asset.fallbackImage;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent"></div>

                      <div className="absolute top-2 left-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950/80 text-cyan-300 border border-cyan-500/30 backdrop-blur-sm">
                          {asset.preservation}
                        </span>
                      </div>

                      <div className="absolute bottom-2 left-2 right-2">
                        <div
                          className={`px-2.5 py-1 rounded font-mono text-[10px] font-bold flex items-center justify-between backdrop-blur-md border ${
                            isDisabled
                              ? "bg-rose-950/90 text-rose-300 border-rose-500/60"
                              : isCritical
                              ? "bg-rose-950/90 text-rose-300 border-rose-500/60 animate-pulse"
                              : "bg-emerald-950/90 text-emerald-300 border-emerald-500/50"
                          }`}
                        >
                          <span>{statusLabel}</span>
                          <span>{timeLabel}</span>
                        </div>
                      </div>
                    </div>

                    <h3 className="font-display text-sm font-bold text-white mb-1">
                      {asset.title}
                    </h3>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">
                      {product.pDescription}
                    </p>

                    {asset.clinicalMetric && (
                      <div className="mb-3 px-2 py-1 rounded bg-slate-900/80 border border-slate-800 text-[10px] font-mono text-cyan-300/90 flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                        <span className="truncate">{asset.clinicalMetric}</span>
                      </div>
                    )}

                    <div className="space-y-1.5 font-mono text-[11px] text-slate-400 p-2.5 rounded-lg bg-slate-950/60 border border-slate-900">
                      <div className="flex justify-between">
                        <span>Logged In:</span>
                        <span className="text-slate-300">{moment(product.createdAt).format("MMM D, HH:mm")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Expires At:</span>
                        <span className={isDisabled ? "text-rose-400 font-bold" : "text-cyan-300 font-bold"}>
                          {expirationDate.format("MMM D, HH:mm")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tolerance Window:</span>
                        <span className="text-slate-200">{toleranceHours} Hours Max</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Controls */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      isDisabled
                        ? "bg-rose-950 text-rose-400 border border-rose-500/40"
                        : "bg-emerald-950 text-emerald-400 border border-emerald-500/40"
                    }`}>
                      {isStatusDisabled ? "Disabled" : isExpired ? "Expired" : product.pStatus || "Active"}
                    </span>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => editProduct(product._id, product, true)}
                        className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 transition-colors"
                        title="Edit Graft Parameters"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>

                      <button
                        onClick={() => deleteProductReq(product._id)}
                        className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-rose-500 text-slate-400 hover:text-rose-400 transition-colors"
                        title="Decommission Organ"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-16 text-center vg-glass-card p-6">
              <p className="font-mono text-sm text-slate-400">No biological grafts currently in active registry.</p>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default AllProduct;
