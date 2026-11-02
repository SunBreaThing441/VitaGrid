import React, { Fragment, useContext, useState, useEffect } from "react";
import { ProductContext } from "./index";
import { createProduct, getAllProduct } from "./FetchApi";
import { getAllCategory } from "../categories/FetchApi";

const AddProductDetail = ({ categories }) => {
  const { data, dispatch } = useContext(ProductContext);

  const [fData, setFdata] = useState({
    pName: "",
    pDescription: "",
    pStatus: "Active",
    pImage: null,
    pCategory: "",
    pPrice: "",
    pOffer: 0,
    pQuantity: "1",
    success: false,
    error: false,
  });

  const fetchData = async () => {
    let responseData = await getAllProduct();
    if (responseData && responseData.Products) {
      dispatch({
        type: "fetchProductsAndChangeState",
        payload: responseData.Products,
      });
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();

    if (!fData.pImage || fData.pImage.length < 2) {
      setFdata({ ...fData, error: "Pathology protocol requires minimum 2 multi-angle graft scans" });
      setTimeout(() => {
        setFdata((prev) => ({ ...prev, error: false }));
      }, 3000);
      return;
    }

    try {
      let responseData = await createProduct(fData);
      if (responseData && responseData.success) {
        fetchData();
        setFdata({
          pName: "",
          pDescription: "",
          pImage: null,
          pStatus: "Active",
          pCategory: "",
          pPrice: "",
          pQuantity: "1",
          pOffer: 0,
          success: responseData.success,
          error: false,
        });
        setTimeout(() => {
          setFdata((prev) => ({
            ...prev,
            success: false,
          }));
          dispatch({ type: "addProductModal", payload: false });
        }, 1500);
      } else if (responseData && responseData.error) {
        setFdata({ ...fData, success: false, error: responseData.error });
        setTimeout(() => {
          setFdata((prev) => ({ ...prev, error: false }));
        }, 3000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!data.addProductModal) return null;

  return (
    <Fragment>
      {/* Backdrop */}
      <div
        onClick={() => dispatch({ type: "addProductModal", payload: false })}
        className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-md transition-opacity cursor-pointer"
      />

      {/* Modal Dialog */}
      <div
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            dispatch({ type: "addProductModal", payload: false });
          }
        }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      >
        <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl shadow-cyan-500/10 p-6 md:p-8 space-y-6 my-8">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                HUMANITARIAN GRAFT INDUCTION
              </span>
              <h2 className="text-xl font-bold text-white font-display">
                Induct Viable Organ Graft
              </h2>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                dispatch({ type: "addProductModal", payload: false });
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
              [TELEMETRY LOGGED] {fData.success}
            </div>
          )}

          <form onSubmit={submitForm} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                  Ischemia Window (Hours) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 24 (Max viability window)"
                  value={fData.pName}
                  onChange={(e) =>
                    setFdata({
                      ...fData,
                      pName: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors text-sm font-mono"
                />
                <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                  Dynamically starts cold ischemia timer
                </span>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                  Donor Node PIN Code *
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 700001"
                  value={fData.pPrice}
                  onChange={(e) =>
                    setFdata({
                      ...fData,
                      pPrice: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors text-sm font-mono"
                />
                <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                  OPO Geolocation Dispatch Node
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                Pathology, HLA Compatibility & Preservation Notes *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Include HLA crossmatch, serology, preservation solution, donor history..."
                value={fData.pDescription}
                onChange={(e) =>
                  setFdata({
                    ...fData,
                    pDescription: e.target.value,
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors text-sm resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                  Anatomical Classification *
                </label>
                <select
                  required
                  value={fData.pCategory}
                  onChange={(e) =>
                    setFdata({
                      ...fData,
                      pCategory: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-white focus:outline-none focus:border-cyan-500 transition-colors text-sm"
                >
                  <option disabled value="">
                    Select Organ Category
                  </option>
                  {categories && categories.length > 0
                    ? categories.map((elem) => (
                        <option value={elem._id} key={elem._id}>
                          {elem.cName}
                        </option>
                      ))
                    : null}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                  Graft Availability Status
                </label>
                <select
                  value={fData.pStatus}
                  onChange={(e) =>
                    setFdata({
                      ...fData,
                      pStatus: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-white focus:outline-none focus:border-cyan-500 transition-colors text-sm"
                >
                  <option value="Active">Active (In Telemetry Network)</option>
                  <option value="Disabled">Disabled (Archived)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                  Available Graft Units *
                </label>
                <input
                  type="number"
                  required
                  value={fData.pQuantity}
                  onChange={(e) =>
                    setFdata({
                      ...fData,
                      pQuantity: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-white focus:outline-none focus:border-cyan-500 transition-colors text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                  Pathology Imaging (Min 2 Scans) *
                </label>
                <input
                  type="file"
                  multiple
                  accept=".jpg, .jpeg, .png"
                  onChange={(e) =>
                    setFdata({
                      ...fData,
                      pImage: [...e.target.files],
                    })
                  }
                  className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-mono file:bg-cyan-500/10 file:text-cyan-400 hover:file:bg-cyan-500/20 cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => dispatch({ type: "addProductModal", payload: false })}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono uppercase tracking-wider transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-mono uppercase tracking-wider font-semibold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Induct Graft to Network
              </button>
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

const AddProductModal = (props) => {
  const [allCat, setAllCat] = useState([]);

  useEffect(() => {
    fetchCategoryData();
  }, []);

  const fetchCategoryData = async () => {
    let responseData = await getAllCategory();
    if (responseData && responseData.Categories) {
      setAllCat(responseData.Categories);
    }
  };

  return (
    <Fragment>
      <AddProductDetail categories={allCat} />
    </Fragment>
  );
};

export default AddProductModal;
