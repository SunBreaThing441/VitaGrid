import React, { Fragment, useContext, useEffect } from "react";
import { getAllCategory, deleteCategory } from "./FetchApi";
import { CategoryContext } from "./index";
import moment from "moment";
import { getOrganFallbackImage } from "../../shop/clinicalAssets";

const apiURL = process.env.REACT_APP_API_URL;

const AllCategory = (props) => {
  const { data, dispatch } = useContext(CategoryContext);
  const { categories, loading } = data;

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    dispatch({ type: "loading", payload: true });
    let responseData = await getAllCategory();
    setTimeout(() => {
      if (responseData && responseData.Categories) {
        dispatch({
          type: "fetchCategoryAndChangeState",
          payload: responseData.Categories,
        });
        dispatch({ type: "loading", payload: false });
      }
    }, 600);
  };

  const deleteCategoryReq = async (cId) => {
    if (window.confirm("CONFIRM DECOMMISSION: Decommission this organ anatomical registry?")) {
      let deleteC = await deleteCategory(cId);
      if (deleteC && deleteC.error) {
        console.error(deleteC.error);
      } else {
        fetchData();
      }
    }
  };

  /* Method to call editmodal & dispatch category context */
  const editCategory = (cId, type, des, status) => {
    if (type) {
      dispatch({
        type: "editCategoryModalOpen",
        cId: cId,
        des: des,
        status: status,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 space-y-4">
        <div className="w-12 h-12 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
        <p className="text-xs font-mono text-cyan-400 uppercase tracking-widest animate-pulse">
          Synchronizing Anatomical Registry...
        </p>
      </div>
    );
  }

  return (
    <Fragment>
      <div className="w-full space-y-6">
        {/* Header telemetry summary */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center space-x-3">
            <span className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </span>
            <div>
              <h2 className="text-base font-semibold text-slate-100 font-display">
                Anatomical Graft Classifications
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Active Categories: {categories ? categories.length : 0} Registry Nodes
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>STANDARDS: WHO-ONT-2026 / UNESCO</span>
          </div>
        </div>

        {/* Categories Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {categories && categories.length > 0 ? (
            categories.map((item, idx) => (
              <CategoryCard
                key={item._id || idx}
                category={item}
                editCat={(cId, type, des, status) =>
                  editCategory(cId, type, des, status)
                }
                deleteCat={(cId) => deleteCategoryReq(cId)}
              />
            ))
          ) : (
            <div className="col-span-full py-16 text-center rounded-2xl bg-slate-900/40 border border-dashed border-slate-800">
              <p className="text-slate-400 font-mono text-sm">
                No anatomical categories cataloged in registry.
              </p>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

/* Modern Futuristic Category Card */
const CategoryCard = ({ category, deleteCat, editCat }) => {
  const isActive = category.cStatus === "Active";

  return (
    <div className="relative group rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-lg hover:shadow-cyan-500/10">
      {/* Top Banner & Status */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex-shrink-0 relative">
              <img
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                src={`${apiURL}/uploads/categories/${category.cImage}`}
                alt={category.cName}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = getOrganFallbackImage(category.cName);
                }}
              />
            </div>
            <div>
              <span className="text-[10px] font-mono text-cyan-400/80 uppercase tracking-widest">
                CLASS ID: #{category._id ? category._id.slice(-6).toUpperCase() : "OPO"}
              </span>
              <h3 className="text-lg font-bold text-slate-100 font-display">
                {category.cName}
              </h3>
            </div>
          </div>
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider ${
              isActive
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
            }`}
          >
            {isActive ? "ACTIVE" : "DISABLED"}
          </span>
        </div>

        {/* Description */}
        <p className="mt-4 text-xs text-slate-400 line-clamp-3 leading-relaxed">
          {category.cDescription || "No clinical description registered for this biological category."}
        </p>

        {/* Timestamps */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>CATALOGED</span>
          <span className="text-slate-400">{moment(category.createdAt).format("DD MMM YYYY · HH:mm")}</span>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="px-5 py-3 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between">
        <span className="text-[11px] font-mono text-slate-500">
          PROTOCOL ACTIONS
        </span>
        <div className="flex items-center space-x-2">
          <button
            onClick={() =>
              editCat(category._id, true, category.cDescription, category.cStatus)
            }
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-950 text-slate-300 hover:text-cyan-400 border border-slate-700 hover:border-cyan-500/40 transition-colors"
            title="Edit Protocol Parameters"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => deleteCat(category._id)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-400 border border-slate-700 hover:border-rose-500/40 transition-colors"
            title="Decommission Category"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllCategory;
