import React, { Fragment, useContext } from "react";
import { CategoryContext } from "./index";
import AddCategoryModal from "./AddCategoryModal";
import EditCategoryModal from "./EditCategoryModal";

const CategoryMenu = (props) => {
  const { dispatch } = useContext(CategoryContext);

  return (
    <Fragment>
      <div className="w-full flex items-center justify-between pb-6 mb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white font-display flex items-center space-x-2">
            <span>Anatomical Classifications</span>
            <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              BIO-REGISTRY
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Standardized graft taxonomies, organ classifications, and biological preservation guidelines.
          </p>
        </div>

        <div>
          <button
            onClick={() => dispatch({ type: "addCategoryModal", payload: true })}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Register New Classification</span>
          </button>
        </div>

        <AddCategoryModal />
        <EditCategoryModal />
      </div>
    </Fragment>
  );
};

export default CategoryMenu;
