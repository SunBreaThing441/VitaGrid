import React, { Fragment, useContext, useState, useEffect } from "react";
import { ProductContext } from "./index";
import { editProduct, getAllProduct } from "./FetchApi";
import { getAllCategory } from "../categories/FetchApi";

const apiURL = process.env.REACT_APP_API_URL;

const EditProductModal = (props) => {
  const { data, dispatch } = useContext(ProductContext);

  const [categories, setCategories] = useState([]);

  const [editformData, setEditformdata] = useState({
    pId: "",
    pName: "",
    pDescription: "",
    pImages: null,
    pEditImages: null,
    pStatus: "",
    pCategory: "",
    pQuantity: "",
    pPrice: "",
    pOffer: 0,
    error: false,
    success: false,
  });

  useEffect(() => {
    fetchCategoryData();
  }, []);

  const fetchCategoryData = async () => {
    let responseData = await getAllCategory();
    if (responseData && responseData.Categories) {
      setCategories(responseData.Categories);
    }
  };

  useEffect(() => {
    if (data.editProductModal) {
      setEditformdata({
        pId: data.editProductModal.pId || "",
        pName: data.editProductModal.pName || "",
        pDescription: data.editProductModal.pDescription || "",
        pImages: data.editProductModal.pImages || null,
        pEditImages: null,
        pStatus: data.editProductModal.pStatus || "Active",
        pCategory: data.editProductModal.pCategory || "",
        pQuantity: data.editProductModal.pQuantity || "",
        pPrice: data.editProductModal.pPrice || "",
        pOffer: data.editProductModal.pOffer || 0,
        error: false,
        success: false,
      });
    }
  }, [data.editProductModal]);

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
    try {
      let responseData = await editProduct(editformData);
      if (responseData && responseData.success) {
        fetchData();
        setEditformdata((prev) => ({ ...prev, success: responseData.success }));
        setTimeout(() => {
          setEditformdata((prev) => ({ ...prev, success: false }));
          dispatch({ type: "editProductModalClose" });
        }, 1500);
      } else if (responseData && responseData.error) {
        setEditformdata((prev) => ({ ...prev, error: responseData.error }));
        setTimeout(() => {
          setEditformdata((prev) => ({ ...prev, error: false }));
        }, 3000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!data.editProductModal.modal) return null;

  return (
    <Fragment>
      {/* Backdrop */}
      <div
        onClick={() => dispatch({ type: "editProductModalClose" })}
        className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-md transition-opacity cursor-pointer"
      />

      {/* Modal Dialog */}
      <div
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            dispatch({ type: "editProductModalClose" });
          }
        }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      >
        <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl shadow-cyan-500/10 p-6 md:p-8 space-y-6 my-8">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                GRAFT PROTOCOL RECONFIGURATION
              </span>
              <h2 className="text-xl font-bold text-white font-display">
                Update Cryo-Graft Telemetry
              </h2>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                dispatch({ type: "editProductModalClose" });
              }}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer z-30"
              aria-label="Close dialog"
            >
              <svg className="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Alerts */}
          {editformData.error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-mono">
              [ALERT] {editformData.error}
            </div>
          )}
          {editformData.success && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono">
              [TELEMETRY UPDATED] {editformData.success}
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
                  value={editformData.pName}
                  onChange={(e) =>
                    setEditformdata({
                      ...editformData,
                      pName: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                  Donor Node PIN Code *
                </label>
                <input
                  type="number"
                  required
                  value={editformData.pPrice}
                  onChange={(e) =>
                    setEditformdata({
                      ...editformData,
                      pPrice: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors text-sm font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                Pathology & Clinical Preservation Notes *
              </label>
              <textarea
                rows={3}
                required
                value={editformData.pDescription}
                onChange={(e) =>
                  setEditformdata({
                    ...editformData,
                    pDescription: e.target.value,
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors text-sm resize-none"
              />
            </div>

            {/* Current Images preview & upload replacement */}
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                Current Diagnostic Imaging
              </label>
              {editformData.pImages && editformData.pImages.length > 0 ? (
                <div className="flex items-center space-x-3 mb-2">
                  {editformData.pImages.map((img, i) => (
                    <img
                      key={i}
                      className="h-16 w-16 object-cover rounded-lg border border-slate-800"
                      src={`${apiURL}/uploads/products/${img}`}
                      alt="Graft Scan"
                    />
                  ))}
                </div>
              ) : null}
              <input
                type="file"
                multiple
                accept=".jpg, .jpeg, .png"
                onChange={(e) =>
                  setEditformdata({
                    ...editformData,
                    pEditImages: [...e.target.files],
                  })
                }
                className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-mono file:bg-cyan-500/10 file:text-cyan-400 hover:file:bg-cyan-500/20 cursor-pointer"
              />
              <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                Leave empty to retain existing scans, or upload 2 replacements
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                  Anatomical Classification *
                </label>
                <select
                  value={
                    editformData.pCategory && editformData.pCategory._id
                      ? editformData.pCategory._id
                      : editformData.pCategory
                  }
                  onChange={(e) =>
                    setEditformdata({
                      ...editformData,
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
                  value={editformData.pStatus}
                  onChange={(e) =>
                    setEditformdata({
                      ...editformData,
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

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                Available Units *
              </label>
              <input
                type="number"
                required
                value={editformData.pQuantity}
                onChange={(e) =>
                  setEditformdata({
                    ...editformData,
                    pQuantity: e.target.value,
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-white focus:outline-none focus:border-cyan-500 transition-colors text-sm font-mono"
              />
            </div>

            <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => dispatch({ type: "editProductModalClose" })}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono uppercase tracking-wider transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-mono uppercase tracking-wider font-semibold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Save Telemetry Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default EditProductModal;
