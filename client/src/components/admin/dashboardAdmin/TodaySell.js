import React, { Fragment, useContext, useEffect } from "react";
import moment from "moment";
import { DashboardContext } from "./";
import { todayAllOrders } from "./Action";
import { getClinicalAsset } from "../../shop/clinicalAssets";

const TodayOrderCard = ({ order }) => {
  const statusColor = (status) => {
    switch (status) {
      case "Request Accepted":
        return "bg-emerald-950 text-emerald-300 border-emerald-500/50";
      case "Under Scrutiny":
        return "bg-amber-950 text-amber-300 border-amber-500/50 animate-pulse";
      case "Expired":
        return "bg-rose-950 text-rose-300 border-rose-500/50";
      default:
        return "bg-slate-900 text-slate-300 border-slate-700";
    }
  };

  return (
    <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center space-x-3.5">
        {order.allProduct && order.allProduct[0] && order.allProduct[0].id ? (
          <img
            className="w-14 h-14 rounded-lg object-cover border border-slate-700 bg-slate-950"
            src={getClinicalAsset(order.allProduct[0].id).primaryImage}
            alt="Organ Thumbnail"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = getClinicalAsset(order.allProduct[0].id).fallbackImage;
            }}
          />
        ) : (
          <div className="w-14 h-14 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-xs font-mono text-slate-500">
            N/A
          </div>
        )}

        <div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-bold text-slate-200">
              TXN: {order.transactionId || "MANUAL_ALLOCATION"}
            </span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold ${statusColor(order.status)}`}>
              {order.status}
            </span>
          </div>

          <div className="text-xs text-slate-400 mt-1 flex items-center space-x-2">
            <span>Destination:</span>
            <span className="text-slate-200 font-semibold">{order.address}</span>
          </div>
        </div>
      </div>

      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto font-mono text-xs text-slate-400">
        <span className="text-cyan-400 font-bold">Node PIN: {order.phone || order.amount}</span>
        <span className="text-[11px] text-slate-500">{moment(order.createdAt).format("LT, ll")}</span>
      </div>
    </div>
  );
};

const TodaySell = () => {
  const { data, dispatch } = useContext(DashboardContext);

  useEffect(() => {
    todayAllOrders(dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const orders = data && data.totalOrders && data.totalOrders.Orders ? data.totalOrders.Orders : [];

  return (
    <Fragment>
      <div className="my-6 p-6 rounded-2xl vg-glass-elevated border border-slate-800 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-display font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span>Today's Critical Transfer Pipeline</span>
            </h2>
            <p className="text-xs font-mono text-slate-400 mt-0.5">
              Real-time feed of organ dispatch requests logged within the current operation cycle
            </p>
          </div>
          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/40">
            Total Logged: {orders.length}
          </span>
        </div>

        <div className="space-y-3">
          {orders.length > 0 ? (
            orders.map((order, idx) => <TodayOrderCard key={idx} order={order} />)
          ) : (
            <div className="py-12 text-center font-mono text-xs text-slate-500">
              No new transfer requisitions initiated in the current cycle.
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default TodaySell;
