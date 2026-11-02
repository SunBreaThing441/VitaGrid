import React, { Fragment, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { wishListProducts } from "./FetchApi";
import { getClinicalAsset, getViabilityState } from "../clinicalAssets";

const Product = () => {
  const history = useHistory();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    let responseData = await wishListProducts();
    setTimeout(() => {
      if (responseData && responseData.Products) {
        setProducts(responseData.Products);
        setLoading(false);
      } else {
        setLoading(false);
      }
    }, 100);
  };

  const removeFromWishList = (id) => {
    let list = localStorage.getItem("wishList")
      ? JSON.parse(localStorage.getItem("wishList"))
      : [];
    if (list.length > 0) {
      if (list.includes(id) === true) {
        list.splice(list.indexOf(id), 1);
        localStorage.setItem("wishList", JSON.stringify(list));
        fetchData();
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-24 space-y-4">
        <div className="w-12 h-12 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
        <p className="text-xs font-mono text-cyan-400 uppercase tracking-widest animate-pulse">
          Synchronizing Standby Watchlist...
        </p>
      </div>
    );
  }

  return (
    <Fragment>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-slate-800 gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
                CLINICAL STANDBY WATCHLIST
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white font-display mt-1">
              Pinned Graft Standby Queue
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              Monitored cryo-grafts flagged for potential recipient matching and surgical standby.
            </p>
          </div>
          <span className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400">
            PINNED GRAFTS: {products ? products.length : 0}
          </span>
        </div>

        {/* Watchlist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.length > 0 ? (
            products.map((product, index) => {
              const asset = getClinicalAsset(product);
              const viability = getViabilityState(product);
              const {
                isDisabled,
                isStatusDisabled,
                statusLabel,
                timeLabel,
              } = viability;
              const isAvailable = product.pQuantity > 0 && !isDisabled;

              return (
                <div
                  key={product._id || index}
                  className={`rounded-2xl border transition-all flex flex-col justify-between overflow-hidden shadow-lg group ${
                    isDisabled
                      ? "bg-slate-900/40 border-rose-950/70 opacity-75"
                      : "bg-slate-900/70 border-slate-800 hover:border-cyan-500/40"
                  }`}
                >
                  <div className="p-5">
                    {/* Sterile Image & Header */}
                    <div className="relative w-full h-48 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 mb-4">
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                        src={asset.primaryImage}
                        alt={asset.title}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = asset.fallbackImage;
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeFromWishList(product._id)}
                        className="absolute top-3 right-3 p-2 rounded-lg bg-slate-950/80 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors z-10"
                        title="Remove from Watchlist"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex items-center space-x-1.5 z-10">
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-950/85 backdrop-blur-md text-cyan-300 border border-cyan-500/40 uppercase">
                          {asset.organType} · {product.pName}h
                        </span>
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900/85 backdrop-blur-md text-emerald-300 border border-emerald-500/30 uppercase">
                          {asset.bloodGroup}
                        </span>
                      </div>

                      {/* Viability Countdown */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider backdrop-blur-md border ${
                            isDisabled
                              ? "bg-rose-950/80 text-rose-400 border-rose-500/30"
                              : "bg-cyan-950/80 text-cyan-400 border border-cyan-500/30"
                          }`}
                        >
                          {statusLabel}: {timeLabel}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400 uppercase tracking-widest mb-1.5">
                      <span className="font-bold text-white bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        PIN: {product.pPrice}
                      </span>
                      <span className={isAvailable ? "text-emerald-400 font-semibold" : "text-rose-400 font-semibold"}>
                        {isAvailable ? "AVAILABLE" : isDisabled ? (isStatusDisabled ? "DISABLED" : "EXPIRED") : "DEPLETED"}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white font-display line-clamp-1">
                      {asset.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {product.pDescription}
                    </p>
                  </div>

                  {/* Actions: View Details CTA */}
                  <div className="p-5 pt-0">
                    <button
                      type="button"
                      onClick={() => history.push(`/products/${product._id}`)}
                      className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white border border-slate-700 hover:border-cyan-500/40 text-xs font-mono font-semibold uppercase tracking-wider transition-all text-center flex items-center justify-center space-x-1.5"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>View Details</span>
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-16 text-center rounded-2xl bg-slate-900/40 border border-dashed border-slate-800">
              <p className="text-slate-400 font-mono text-sm">
                No cryo-grafts currently on standby watchlist.
              </p>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default Product;
