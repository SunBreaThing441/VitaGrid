import React, { Fragment, useContext } from "react";
import ProductCategoryDropdown from "./ProductCategoryDropdown";
import { HomeContext } from "./index";

const ProductCategory = () => {
  const { data, dispatch } = useContext(HomeContext);

  return (
    <Fragment>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl vg-glass border border-slate-800 shadow-xl">
        {/* Left: Anatomical Category Filter Selector */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() =>
              dispatch({
                type: "categoryListDropdown",
                payload: !data.categoryListDropdown,
              })
            }
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider transition-all ${
              data.categoryListDropdown
                ? "bg-cyan-500 text-gray-950 shadow-lg shadow-cyan-500/30"
                : "bg-slate-900/90 text-slate-300 border border-slate-700 hover:border-cyan-500/50 hover:text-cyan-400"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            <span>Anatomical Categories</span>
            <svg
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                data.categoryListDropdown ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Right: Quick Search Filter Trigger */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() =>
              dispatch({
                type: "searchDropdown",
                payload: !data.searchDropdown,
              })
            }
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider transition-all ${
              data.searchDropdown
                ? "bg-cyan-500 text-gray-950 shadow-lg shadow-cyan-500/30"
                : "bg-slate-900/90 text-slate-300 border border-slate-700 hover:border-cyan-500/50 hover:text-cyan-400"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Omni-Search Filter</span>
          </button>
        </div>
      </div>

      <ProductCategoryDropdown />
    </Fragment>
  );
};

export default ProductCategory;
