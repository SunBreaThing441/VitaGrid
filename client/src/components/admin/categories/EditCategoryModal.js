import React, { Fragment, useContext, useState, useEffect } from "react";
import { CategoryContext } from "./index";
import { editCategory, getAllCategory } from "./FetchApi";

const EditCategoryModal = (props) => {
  const { data, dispatch } = useContext(CategoryContext);

  const [des, setDes] = useState("");
  const [status, setStatus] = useState("");
  const [cId, setCid] = useState("");

  useEffect(() => {
    if (data.editCategoryModal) {
      setDes(data.editCategoryModal.des || "");
      setStatus(data.editCategoryModal.status || "Active");
      setCid(data.editCategoryModal.cId || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.editCategoryModal.modal]);

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
    let edit = await editCategory(cId, des, status);
    if (edit && edit.error) {
      console.error(edit.error);
      dispatch({ type: "loading", payload: false });
    } else if (edit && edit.success) {
      dispatch({ type: "editCategoryModalClose" });
      setTimeout(() => {
        fetchData();
        dispatch({ type: "loading", payload: false });
      }, 600);
    }
  };

  if (!data.editCategoryModal.modal) return null;

  return (
    <Fragment>
      {/* Backdrop */}
      <div
        onClick={() => dispatch({ type: "editCategoryModalClose" })}
        className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-md transition-opacity cursor-pointer"
      />

      {/* Modal Dialog */}
      <div
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            dispatch({ type: "editCategoryModalClose" });
          }
        }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      >
        <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl shadow-cyan-500/10 p-6 md:p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                PROTOCOL MODIFICATION
              </span>
              <h2 className="text-xl font-bold text-white font-display">
                Update Category Classification
              </h2>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                dispatch({ type: "editCategoryModalClose" });
              }}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer z-30"
              aria-label="Close dialog"
            >
              <svg className="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={submitForm} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                Clinical Description & Protocols
              </label>
              <textarea
                value={des}
                onChange={(e) => setDes(e.target.value)}
                rows={4}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors text-sm resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                Registry Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-white focus:outline-none focus:border-cyan-500 transition-colors text-sm"
              >
                <option value="Active">Active (Operational)</option>
                <option value="Disabled">Disabled (Decommissioned)</option>
              </select>
            </div>

            <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => dispatch({ type: "editCategoryModalClose" })}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono uppercase tracking-wider transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-mono uppercase tracking-wider font-semibold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Save Protocols
              </button>
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default EditCategoryModal;
