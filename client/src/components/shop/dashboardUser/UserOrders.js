import React, { Fragment, useEffect, useContext } from "react";
import moment from "moment";
import { fetchOrderByUser } from "./Action";
import Layout, { DashboardUserContext } from "./Layout";
import { getClinicalAsset } from "../clinicalAssets";

const OrdersComponent = () => {
  const { data, dispatch } = useContext(DashboardUserContext);
  const { OrderByUser: orders } = data;

  useEffect(() => {
    fetchOrderByUser(dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (data.loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 space-y-4">
        <div className="w-12 h-12 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
        <p className="text-xs font-mono text-cyan-400 uppercase tracking-widest animate-pulse">
          Synchronizing Active Requisition Streams...
        </p>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "Request Accepted":
        return {
          label: "DISPATCH AUTHORIZED",
          bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
          step: 3,
        };
      case "Under Scrutiny":
        return {
          label: "OPO CLINICAL SCRUTINY",
          bg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
          step: 2,
        };
      case "Expired":
        return {
          label: "COLD ISCHEMIA EXPIRED",
          bg: "bg-rose-500/10 text-rose-400 border-rose-500/30",
          step: 0,
        };
      case "Cancelled":
        return {
          label: "MISSION CANCELLED",
          bg: "bg-slate-500/10 text-slate-400 border-slate-500/30",
          step: 0,
        };
      default:
        return {
          label: "REQUISITION PENDING",
          bg: "bg-amber-500/10 text-amber-400 border-amber-500/30",
          step: 1,
        };
    }
  };

  return (
    <Fragment>
      <div className="space-y-6">
        {/* Header telemetry summary */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                HUMANITARIAN TRANSIT PIPELINE
              </span>
            </div>
            <h1 className="text-xl font-bold text-white font-display mt-0.5">
              Hospital Requisition Missions
            </h1>
            <p className="text-xs text-slate-400">
              Active telemetry tracking for requested human organs and cryo-specimens.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
            <span className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-cyan-400">
              TOTAL MISSIONS: {orders ? orders.length : 0}
            </span>
          </div>
        </div>

        {/* Orders Card Stream */}
        <div className="space-y-4">
          {orders && orders.length > 0 ? (
            orders.map((order, idx) => {
              const statusInfo = getStatusBadge(order.status);

              return (
                <div
                  key={order._id || idx}
                  className="rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/30 transition-all p-6 space-y-5"
                >
                  {/* Top Row: Mission ID & Status Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/80 gap-3">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                        MISSION TRANSACTION TXID
                      </span>
                      <div className="text-xs font-mono font-bold text-cyan-400">
                        {order.transactionId || `#VITA-${order._id ? order._id.slice(-8).toUpperCase() : idx}`}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border ${statusInfo.bg}`}
                      >
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>

                  {/* Specimen items list */}
                  <div className="space-y-3">
                    {order.allProduct &&
                      order.allProduct.map((product, pIdx) => {
                        const graft = product.id;
                        if (!graft) return null;

                        return (
                          <div
                            key={pIdx}
                            className="flex items-center space-x-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80"
                          >
                            <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-900 border border-slate-800 flex-shrink-0">
                              <img
                                className="w-full h-full object-cover object-center"
                                src={getClinicalAsset(graft).primaryImage}
                                alt="Graft scan"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = getClinicalAsset(graft).fallbackImage;
                                }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <span className="text-[10px] font-mono text-cyan-400 uppercase">
                                  DONOR NODE PIN: {graft.pPrice}
                                </span>
                                <span className="text-slate-600">·</span>
                                <span className="text-[10px] font-mono text-slate-400">
                                  TOLERANCE: {graft.pName}h
                                </span>
                              </div>
                              <h4 className="text-sm font-semibold text-white truncate">
                                {graft.pDescription || "Humanitarian Organ Graft"}
                              </h4>
                              <span className="text-xs font-mono text-slate-400">
                                Allocated Quantity: <strong className="text-white">{product.quantitiy || 1} Unit</strong>
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  {/* Logistics Dispatch Metadata */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800/80 text-xs font-mono">
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase">
                        RECEIVING REQUISITION ADDRESS
                      </span>
                      <span className="text-slate-200 mt-0.5 block truncate">
                        {order.address || "Unspecified Hospital Suite"}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase">
                        SURGICAL BAY HOTLINE
                      </span>
                      <span className="text-slate-200 mt-0.5 block font-mono">
                        {order.phone || "No contact logged"}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase">
                        DISPATCH TIMESTAMPS
                      </span>
                      <span className="text-slate-200 mt-0.5 block">
                        {moment(order.createdAt).format("DD MMM YYYY · HH:mm")}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-16 text-center rounded-2xl bg-slate-900/40 border border-dashed border-slate-800">
              <p className="text-slate-400 font-mono text-sm">
                No active hospital requisition orders logged in mission ledger.
              </p>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

const UserOrders = (props) => {
  return (
    <Fragment>
      <Layout children={<OrdersComponent />} />
    </Fragment>
  );
};

export default UserOrders;
