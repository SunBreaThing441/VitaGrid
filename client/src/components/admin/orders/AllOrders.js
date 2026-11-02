import React, { Fragment, useContext, useEffect } from "react";
import moment from "moment";
import { OrderContext } from "./index";
import { fetchData, deleteOrderReq } from "./Actions";
import { getClinicalAsset } from "../../shop/clinicalAssets";

const AllOrders = () => {
  const { data, dispatch } = useContext(OrderContext);
  const { orders, loading } = data;

  useEffect(() => {
    fetchData(dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const editOrder = (oId, type, status) => {
    if (type) {
      dispatch({
        type: "updateOrderModalOpen",
        oId: oId,
        status: status,
      });
    }
  };

  const statusBadge = (status) => {
    switch (status) {
      case "Request Accepted":
        return "bg-emerald-950 text-emerald-300 border-emerald-500/50";
      case "Under Scrutiny":
        return "bg-amber-950 text-amber-300 border-amber-500/50 animate-pulse";
      case "Expired":
        return "bg-rose-950 text-rose-300 border-rose-500/50";
      case "Cancelled":
        return "bg-slate-900 text-rose-400 border-rose-800/50";
      default:
        return "bg-slate-900 text-slate-300 border-slate-700";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center">
        <div className="w-12 h-12 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin"></div>
        <p className="mt-4 text-xs font-mono uppercase text-slate-400">Loading Requisition Pipeline...</p>
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
              <span>Hospital Requisition Orders & Allocation Log</span>
            </h2>
            <p className="text-xs font-mono text-slate-400 mt-0.5">
              Review and advance transfer status across procurement centers
            </p>
          </div>
          <span className="font-mono text-xs font-bold px-3 py-1 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/40">
            Total Requisitions: {orders ? orders.length : 0}
          </span>
        </div>

        <div className="space-y-4">
          {orders && orders.length > 0 ? (
            orders.map((order, index) => (
              <div
                key={index}
                className="p-5 rounded-2xl vg-glass-card border border-slate-800 hover:border-cyan-500/40 shadow-xl transition-all space-y-4"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center space-x-2.5">
                    <span className="font-mono text-xs font-bold text-slate-200">
                      MISSION_ID: {order.transactionId}
                    </span>
                    <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-bold ${statusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="font-mono text-xs text-slate-400 flex items-center space-x-3">
                    <span>Logged: {moment(order.createdAt).format("LLL")}</span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  {/* Left: Organ Payloads */}
                  <div className="md:col-span-5 flex items-center space-x-3">
                    {order.allProduct && order.allProduct[0] && order.allProduct[0].id ? (
                      <div className="flex items-center space-x-3">
                        <img
                          className="w-16 h-16 rounded-xl object-cover bg-slate-950 border border-slate-700 flex-shrink-0"
                          src={getClinicalAsset(order.allProduct[0].id).primaryImage}
                          alt="Graft"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = getClinicalAsset(order.allProduct[0].id).fallbackImage;
                          }}
                        />
                        <div>
                          <div className="text-xs font-mono font-bold text-cyan-300">
                            {order.allProduct[0].id.pCategory?.cName || "Biological Graft"}
                          </div>
                          <div className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                            {order.allProduct[0].id.pDescription}
                          </div>
                          <div className="text-[11px] font-mono text-slate-500 mt-1">
                            Node PIN: {order.allProduct[0].id.pPrice}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs font-mono text-slate-500">Unspecified Payload</div>
                    )}
                  </div>

                  {/* Middle: Hospital Details */}
                  <div className="md:col-span-5 font-mono text-xs space-y-1 p-3 rounded-xl bg-slate-950/60 border border-slate-900">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Recipient Center:</span>
                      <span className="text-slate-200 font-semibold">{order.user ? order.user.name : "Hospital"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Official Contact:</span>
                      <span className="text-slate-300">{order.phone || (order.user && order.user.email)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Delivery Address:</span>
                      <span className="text-slate-300 truncate max-w-[200px]">{order.address}</span>
                    </div>
                  </div>

                  {/* Right: State Action Controls */}
                  <div className="md:col-span-2 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                    <button
                      onClick={() => editOrder(order._id, true, order.status)}
                      className="vg-btn-primary text-xs font-mono py-2 px-3 w-full text-center"
                    >
                      Update Status
                    </button>

                    <button
                      onClick={() => deleteOrderReq(order._id, dispatch)}
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-500 hover:text-rose-400 hover:border-rose-500/40 transition-colors"
                      title="Purge Order Record"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center vg-glass-card p-6">
              <p className="font-mono text-sm text-slate-400">No transfer requisitions found in pipeline.</p>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default AllOrders;
