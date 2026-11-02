import React, { Fragment, useEffect, useState, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import Layout from "../layout";
import { LayoutContext } from "../index";
import { productByCategory } from "../../admin/products/FetchApi";
import { getClinicalAsset, getViabilityState } from "../clinicalAssets";

const Submenu = ({ category }) => {
  const history = useHistory();
  return (
    <div className="flex items-center justify-between pb-6 mb-8 border-b border-slate-800">
      <div className="flex items-center space-x-3 text-xs font-mono">
        <span
          className="text-slate-400 hover:text-cyan-400 cursor-pointer transition-colors"
          onClick={() => history.push("/")}
        >
          Active Bio-Logistics Inventory
        </span>
        <span className="text-slate-600">/</span>
        <span className="text-cyan-400 font-bold uppercase tracking-wider">{category || "Classification Stream"}</span>
      </div>
      <button
        onClick={() => history.push("/")}
        className="text-xs font-mono text-slate-400 hover:text-white flex items-center space-x-1.5 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Return to Telemetry Hub</span>
      </button>
    </div>
  );
};

const AllProduct = ({ products }) => {
  const history = useHistory();
  const { dispatch: layoutDispatch } = useContext(LayoutContext);
  const [queuedId, setQueuedId] = useState(null);

  const category =
    products && products.length > 0 && products[0].pCategory
      ? products[0].pCategory.cName
      : "Biological Registry";

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

  return (
    <Fragment>
      <Submenu category={category} />

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
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
                {/* Clinical Diagnostic Image Container */}
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

                  {/* Gradient Shadow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-slate-950/40 pointer-events-none"></div>

                  {/* Top Header Tags */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                    <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                      <span className="font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-950/85 backdrop-blur-md text-cyan-300 border border-cyan-500/40 uppercase tracking-wider">
                        {asset.organType} · {item.pName}h
                      </span>
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900/85 backdrop-blur-md text-emerald-300 border border-emerald-500/30 uppercase">
                        {asset.bloodGroup}
                      </span>
                    </div>
                  </div>

                  {/* Geographic Node & PIN Banner (Prominent) */}
                  <div className="absolute top-12 left-3 z-10">
                    <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-slate-950/90 backdrop-blur-md border border-cyan-500/40 text-cyan-400 font-mono text-[11px] font-bold shadow-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                      <span>PIN: {item.pPrice}</span>
                      <span className="text-slate-500 text-[10px]">({asset.nodeLocation.split(" ")[0]})</span>
                    </span>
                  </div>

                  {/* Viability Window Countdown Banner (Prominent) */}
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

                {/* Card Body & Specs */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div>
                      <h3 className="text-base font-bold text-white font-display group-hover:text-cyan-400 transition-colors line-clamp-1">
                        {asset.organType} ({item.pName} hrs window)
                      </h3>
                      <p className="text-[11px] font-mono text-cyan-400/90 mt-0.5">
                        {asset.preservationModality}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-400">CLINICAL INDEX:</span>
                        <span className="text-emerald-400 font-semibold">{asset.clinicalMetricBadge}</span>
                      </div>
                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                        {item.pDescription}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                      <span>GEOGRAPHIC PIN:</span>
                      <span className="text-white font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        {item.pPrice}
                      </span>
                    </div>
                  </div>

                  {/* Action Toolbar */}
                  <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2.5">
                    {/* View Details CTA */}
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
          <div className="col-span-full py-20 text-center vg-glass-card p-8 rounded-2xl">
            <svg className="w-12 h-12 text-slate-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="font-mono text-sm text-slate-300 uppercase tracking-wider">
              No Viable Grafts Cataloged in this Category
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Select another anatomical classification from the registry menu.
            </p>
          </div>
        )}
      </section>
    </Fragment>
  );
};

const PageComponent = () => {
  const [products, setProducts] = useState(null);
  const { catId } = useParams();

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catId]);

  const fetchData = async () => {
    try {
      let responseData = await productByCategory(catId);
      if (responseData && responseData.Products) {
        setProducts(responseData.Products);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Fragment>
      <AllProduct products={products} />
    </Fragment>
  );
};

const ProductByCategory = (props) => {
  return (
    <Fragment>
      <Layout children={<PageComponent />} />
    </Fragment>
  );
};

export default ProductByCategory;
