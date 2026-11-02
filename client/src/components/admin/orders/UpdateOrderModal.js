import React, { Fragment, useContext, useState, useEffect } from "react";
import { OrderContext } from "./index";
import { getAllOrder, editCategory } from "./FetchApi";

const UpdateOrderModal = () => {
  const { data, dispatch } = useContext(OrderContext);
  const [status, setStatus] = useState("");
  const [oId, setOid] = useState("");

  useEffect(() => {
    if (data.updateOrderModal) {
      setOid(data.updateOrderModal.oId);
      setStatus(data.updateOrderModal.status);
    }
  }, [data.updateOrderModal]);

  const fetchData = async () => {
    let responseData = await getAllOrder();
    if (responseData && responseData.Orders) {
      dispatch({
        type: "fetchOrderAndChangeState",
        payload: responseData.Orders,
      });
    }
  };

  const submitForm = async () => {
    dispatch({ type: "loading", payload: true });
    let responseData = await editCategory(oId, status);
    if (responseData && responseData.error) {
      dispatch({ type: "loading", payload: false });
    } else if (responseData && responseData.success) {
      dispatch({ type: "updateOrderModalClose" });
      await fetchData();
      dispatch({ type: "loading", payload: false });
    }
  };

  if (!data.updateOrderModal || !data.updateOrderModal.modal) return null;

  return (
    <Fragment>
      <div
        onClick={() => dispatch({ type: "updateOrderModalClose" })}
        className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm cursor-pointer"
      />

      <div
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            dispatch({ type: "updateOrderModalClose" });
          }
        }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="w-full max-w-md p-6 rounded-2xl vg-glass-elevated border border-cyan-500/40 shadow-2xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-display font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span>Update Requisition State</span>
            </h3>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                dispatch({ type: "updateOrderModalClose" });
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer z-30"
              aria-label="Close dialog"
            >
              <svg className="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-300 uppercase">
              Target State Machine Transition
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-100 font-mono text-xs rounded-xl p-3 focus:outline-none focus:border-cyan-400"
            >
              <option value="Not processed">Not processed - Awaiting Token</option>
              <option value="Under Scrutiny">Under Scrutiny - Cross-Match Audit</option>
              <option value="Request Accepted">Request Accepted - Dispatch Cleared</option>
              <option value="Expired">Expired - Cold Tolerance Limit</option>
              <option value="Cancelled">Cancelled - Incompatibility</option>
            </select>
          </div>

          <div className="pt-2 flex justify-end space-x-3">
            <button
              onClick={() => dispatch({ type: "updateOrderModalClose" })}
              className="vg-btn-secondary text-xs font-mono py-2 px-4"
            >
              Cancel
            </button>
            <button
              onClick={submitForm}
              className="vg-btn-primary text-xs font-mono py-2 px-4 uppercase"
            >
              Commit Transition
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default UpdateOrderModal;
