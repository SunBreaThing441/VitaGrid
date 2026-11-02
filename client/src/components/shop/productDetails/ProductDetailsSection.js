import React, { Fragment, useState, useEffect, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import { ProductDetailsContext } from "./index";
import { LayoutContext } from "../layout";
import Submenu from "./Submenu";
import { getSingleProduct } from "./FetchApi";
import { cartListProduct } from "../partials/FetchApi";
import { isWishReq, unWishReq, isWish } from "../home/Mixins";
import { addToCart, cartList } from "./Mixins";
import { totalCost } from "../partials/Mixins";
import { getClinicalAsset, getViabilityState } from "../clinicalAssets";

const ProductDetailsSection = () => {
  let { id } = useParams();
  const history = useHistory();

  const { data, dispatch } = useContext(ProductDetailsContext);
  const { data: layoutData, dispatch: layoutDispatch } = useContext(LayoutContext);

  const sProduct = layoutData.singleProductDetail;
  const [count, setCount] = useState(0);
  const [quantitiy, setQuantitiy] = useState(1);
  const [, setAlertq] = useState(false);

  const [wList, setWlist] = useState(
    JSON.parse(localStorage.getItem("wishList")) || []
  );

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchData = async () => {
    dispatch({ type: "loading", payload: true });
    try {
      let responseData = await getSingleProduct(id);
      setTimeout(() => {
        if (responseData && responseData.Product) {
          layoutDispatch({
            type: "singleProductDetail",
            payload: responseData.Product,
          });
          dispatch({ type: "loading", payload: false });
          layoutDispatch({ type: "inCart", payload: cartList() });
        }
      }, 300);
    } catch (error) {
      console.error(error);
      dispatch({ type: "loading", payload: false });
    }
    fetchCartProduct();
  };

  const fetchCartProduct = async () => {
    try {
      let responseData = await cartListProduct();
      if (responseData && responseData.Products) {
        layoutDispatch({ type: "cartProduct", payload: responseData.Products });
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (data.loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-center">
        <div className="w-16 h-16 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin"></div>
        <p className="mt-4 text-xs font-mono uppercase tracking-widest text-slate-400">
          Loading Biological Graft Telemetry...
        </p>
      </div>
    );
  } else if (!sProduct) {
    return (
      <div className="p-8 text-center vg-glass-card my-12">
        <p className="text-sm font-mono text-slate-300">Biological Graft Record Not Found in Active Registry.</p>
        <button
          onClick={() => history.push("/")}
          className="mt-4 vg-btn-primary text-xs font-mono"
        >
          Return to Registry
        </button>
      </div>
    );
  }

  const asset = getClinicalAsset(sProduct, count);
  const viability = getViabilityState(sProduct);
  const {
    isExpired,
    isStatusDisabled,
    isDisabled,
    isCritical,
    statusLabel,
    timeLabel,
  } = viability;
  const inManifest = layoutData.inCart && layoutData.inCart.includes(sProduct._id);

  const galleryImages = [asset.primaryImage, asset.secondaryImage];

  return (
    <Fragment>
      <Submenu
        value={{
          categoryId: sProduct.pCategory ? sProduct.pCategory._id : "",
          product: `${asset.organType} (${sProduct.pName}h)`,
          category: sProduct.pCategory ? sProduct.pCategory.cName : "Organ",
        }}
      />

      <section className="my-6">
        <div className="p-6 md:p-8 rounded-2xl vg-glass-elevated border border-slate-800 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Thumbnail & Main Imagery Gallery */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails Column */}
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible">
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCount(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden bg-slate-950 border transition-all flex-shrink-0 cursor-pointer ${
                    count === i
                      ? "border-cyan-400 ring-2 ring-cyan-400/30 scale-105"
                      : "border-slate-800 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    className="w-full h-full object-cover"
                    src={img}
                    alt={`Scan angle ${i + 1}`}
                  />
                </button>
              ))}
            </div>

            {/* Main Stage Display */}
            <div className="flex-1 relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 h-80 sm:h-96 md:h-[440px] group">
              <img
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95 contrast-105"
                src={galleryImages[count] || asset.primaryImage}
                alt={sProduct.pDescription}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = asset.fallbackImage;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none"></div>

              {/* Status Overlay */}
              <div className="absolute top-4 left-4 z-10 flex items-center space-x-2 flex-wrap gap-y-1">
                <span className="font-mono text-xs font-bold px-3 py-1 rounded-md bg-slate-950/85 backdrop-blur-md text-cyan-300 border border-cyan-500/40 uppercase">
                  {asset.organType} · {sProduct.pName}h Window
                </span>
                <span className="font-mono text-xs font-bold px-3 py-1 rounded-md bg-slate-900/85 backdrop-blur-md text-emerald-300 border border-emerald-500/30 uppercase">
                  {asset.bloodGroup}
                </span>
              </div>

              {/* Geographic PIN Badge on Top Corner */}
              <div className="absolute top-4 right-14 z-10">
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-md bg-slate-950/90 backdrop-blur-md border border-cyan-500/40 text-cyan-400 font-mono text-xs font-bold shadow-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                  <span>PIN: {sProduct.pPrice}</span>
                </span>
              </div>

              {/* Countdown Banner */}
              <div className="absolute bottom-4 left-4 right-4 z-10">
                <div
                  className={`px-3 py-2 rounded-xl font-mono text-xs font-bold flex items-center justify-between backdrop-blur-md border shadow-lg ${
                    isDisabled
                      ? "bg-rose-950/90 text-rose-300 border-rose-500/50"
                      : isCritical
                      ? "bg-rose-950/90 text-rose-300 border-rose-500/50 animate-pulse"
                      : "bg-cyan-950/90 text-cyan-300 border-cyan-500/50"
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full ${isDisabled ? "bg-rose-500" : "bg-cyan-400 animate-pulse"}`}></span>
                    <span>{statusLabel}</span>
                  </span>
                  <span>
                    {timeLabel}
                  </span>
                </div>
              </div>

              {/* Wishlist Button */}
              <div className="absolute top-4 right-4 z-10">
                <button
                  type="button"
                  onClick={(e) => {
                    if (isWish(sProduct._id, wList)) {
                      unWishReq(e, sProduct._id, setWlist);
                    } else {
                      isWishReq(e, sProduct._id, setWlist);
                    }
                  }}
                  className="p-2 rounded-full bg-slate-950/80 backdrop-blur-md text-slate-300 hover:text-rose-500 transition-colors"
                >
                  <svg
                    className={`w-5 h-5 ${isWish(sProduct._id, wList) ? "fill-current text-rose-500" : "fill-none stroke-current"}`}
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
            </div>
          </div>

          {/* Right: Biological Specs, Cold-Chain Telemetry & Requisition Action */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 font-mono text-xs text-slate-400">
                <span>GRAFT_ID:</span>
                <span className="text-cyan-400 font-bold">{sProduct._id}</span>
                <span className="text-slate-600">·</span>
                <span>NODE:</span>
                <span className="text-slate-200">{asset.nodeLocation}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-wide">
                {asset.title}
              </h1>

              {/* Clinical Specs Box */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 flex items-center justify-between">
                  <span>Donor Pathology & Compatibility Profile</span>
                  <span className="text-emerald-400 font-bold">{asset.clinicalMetricBadge}</span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed font-sans">
                  {sProduct.pDescription}
                </p>
                <div className="pt-2 text-xs font-mono text-slate-400 border-t border-slate-800">
                  <span className="text-cyan-300">Spec Details:</span> {asset.clinicalSpecs}
                </div>
              </div>

              {/* Telemetry Matrix Grid */}
              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                  <div className="text-slate-400 text-[10px] uppercase">Cold Ischemia Tolerance</div>
                  <div className="text-cyan-400 font-bold text-base mt-0.5">{sProduct.pName} Hours Max</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                  <div className="text-slate-400 text-[10px] uppercase">Donor Center PIN Node</div>
                  <div className="text-emerald-400 font-bold text-base mt-0.5">{sProduct.pPrice}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                  <div className="text-slate-400 text-[10px] uppercase">Preservation Modality</div>
                  <div className="text-slate-200 font-semibold mt-0.5 truncate">{asset.preservationModality}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                  <div className="text-slate-400 text-[10px] uppercase">Registry Status</div>
                  <div className="text-indigo-400 font-semibold mt-0.5">{sProduct.pStatus || "Active"}</div>
                </div>
              </div>
            </div>

            {/* Protocol Action Trigger */}
            <div className="pt-6 border-t border-slate-800 space-y-3">
              {inManifest ? (
                <div className="p-3.5 rounded-xl bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 font-mono text-xs text-center font-bold flex items-center justify-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>SPECIMEN ALLOCATED TO ACTIVE REQUISITION MANIFEST</span>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={isDisabled}
                  onClick={() =>
                    addToCart(
                      sProduct._id,
                      quantitiy,
                      sProduct.pPrice,
                      layoutDispatch,
                      setQuantitiy,
                      setAlertq,
                      totalCost
                    )
                  }
                  className={`w-full py-4 rounded-xl text-xs font-mono font-bold uppercase tracking-widest shadow-xl transition-all ${
                    isDisabled
                      ? "bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed"
                      : "bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                  }`}
                >
                  {isStatusDisabled
                    ? "Listing Decommissioned by OPO Network"
                    : isExpired
                    ? "Ischemic Tolerance Elapsed - Graft Retired"
                    : "Allocate Specimen to Requisition Manifest"}
                </button>
              )}

              <p className="text-[10px] font-mono text-center text-slate-500">
                STANDARDS: WHO-ONT-2026 / UNESCO HUMANITARIAN LOGISTICS ARCHITECTURE
              </p>
            </div>

          </div>
        </div>
      </section>
    </Fragment>
  );
};

export default ProductDetailsSection;
