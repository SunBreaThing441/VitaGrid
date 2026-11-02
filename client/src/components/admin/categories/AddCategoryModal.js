import React, { Fragment, useContext, useState } from "react";
import { CategoryContext } from "./index";
import { createCategory, getAllCategory } from "./FetchApi";

const AddCategoryModal = (props) => {
  const { data, dispatch } = useContext(CategoryContext);

  const [fData, setFdata] = useState({
    cName: "",
    cDescription: "",
    cImage: "",
    cStatus: "Active",
    success: false,
    error: false,
  });

  const fetchData = async () => {
    let responseData = await getAllCategory();
    if (responseData.Categories) {
      dispatch({
        type: "fetchCategoryAndChangeState",
        payload: responseData.Categories,
      });
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    dispatch({ type: "loading", payload: true });

    if (!fData.cImage) {
      dispatch({ type: "loading", payload: false });
      return setFdata({ ...fData, error: "Please upload an anatomical classification image" });
    }

    try {
      let responseData = await createCategory(fData);
      if (responseData && responseData.success) {
        fetchData();
        setFdata({
          cName: "",
          cDescription: "",
          cImage: "",
          cStatus: "Active",
          success: responseData.success,
          error: false,
        });
        dispatch({ type: "loading", payload: false });
        setTimeout(() => {
          setFdata({
            cName: "",
            cDescription: "",
            cImage: "",
            cStatus: "Active",
            success: false,
            error: false,
          });
          dispatch({ type: "addCategoryModal", payload: false });
        }, 1500);
      } else if (responseData && responseData.error) {
        setFdata({ ...fData, success: false, error: responseData.error });
        dispatch({ type: "loading", payload: false });
      }
    } catch (error) {
      console.error(error);
      dispatch({ type: "loading", payload: false });
    }
  };

  if (!data.addCategoryModal) return null;

  return (
    <Fragment>
      {/* Backdrop */}
      <div
        onClick={() => dispatch({ type: "addCategoryModal", payload: false })}
        className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-md transition-opacity cursor-pointer"
      />

      {/* Modal Dialog */}
      <div
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            dispatch({ type: "addCategoryModal", payload: false });
          }
        }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      >
        <div className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl shadow-cyan-500/10 p-6 md:p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                PROTOCOL REGISTRY
              </span>
              <h2 className="text-xl font-bold text-white font-display">
                Register New Anatomical Classification
              </h2>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                dispatch({ type: "addCategoryModal", payload: false });
              }}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer z-30"
              aria-label="Close dialog"
            >
              <svg className="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Feedback alerts */}
          {fData.error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-mono">
              [ALERT] {fData.error}
            </div>
          )}
          {fData.success && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono">
              [SUCCESS] {fData.success}
            </div>
          )}

          <form onSubmit={submitForm} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                Classification Name (e.g., Renal / Cardiac / Hepatic)
              </label>
              <input
                type="text"
                required
                value={fData.cName}
                onChange={(e) => setFdata({ ...fData, cName: e.target.value })}
                placeholder="Enter anatomical classification title..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                Clinical Description & Protocol Constraints
              </label>
              <textarea
                rows={3}
                required
                value={fData.cDescription}
                onChange={(e) => setFdata({ ...fData, cDescription: e.target.value })}
                placeholder="Preservation protocols, temperature guidelines, tissue typing criteria..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors text-sm resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                  Anatomical Diagram / Imaging
                </label>
                <input
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={(e) =>
                    setFdata({
                      ...fData,
                      cImage: e.target.files[0],
                    })
                  }
                  className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-mono file:bg-cyan-500/10 file:text-cyan-400 hover:file:bg-cyan-500/20 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                  Deployment Status
                </label>
                <select
                  value={fData.cStatus}
                  onChange={(e) => setFdata({ ...fData, cStatus: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-white focus:outline-none focus:border-cyan-500 transition-colors text-sm"
                >
                  <option value="Active">Active (Operational)</option>
                  <option value="Disabled">Disabled (Decommissioned)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => dispatch({ type: "addCategoryModal", payload: false })}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono uppercase tracking-wider transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-mono uppercase tracking-wider font-semibold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Register Classification
              </button>
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default AddCategoryModal;
