import React, { Fragment, useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { HomeContext } from "./index";
import { getAllCategory } from "../../admin/categories/FetchApi";
import { getAllProduct } from "../../admin/products/FetchApi";
import { getOrganFallbackImage } from "../clinicalAssets";

const apiURL = process.env.REACT_APP_API_URL;

const CategoryList = () => {
  const history = useHistory();
  const { data } = useContext(HomeContext);
  const [categories, setCategories] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      let responseData = await getAllCategory();
      if (responseData && responseData.Categories) {
        setCategories(responseData.Categories);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!data.categoryListDropdown) return null;

  return (
    <div className="my-4 p-5 rounded-2xl vg-glass-elevated border border-cyan-500/30 shadow-2xl transition-all">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
            Select Anatomical Classification
          </span>
        </div>
        <span className="text-xs font-mono text-cyan-400">
          Total Categories: {categories ? categories.length : 0}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {categories && categories.length > 0 ? (
          categories.map((item, index) => (
            <div
              key={index}
              onClick={() => history.push(`/products/category/${item._id}`)}
              className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-400/60 hover:bg-slate-800/80 transition-all cursor-pointer flex flex-col items-center text-center group"
            >
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-950 border border-slate-700/80 group-hover:scale-105 transition-transform mb-2 flex items-center justify-center">
                <img
                  className="w-full h-full object-cover"
                  src={`${apiURL}/uploads/categories/${item.cImage}`}
                  alt={item.cName}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = getOrganFallbackImage(item.cName);
                  }}
                />
              </div>
              <span className="text-xs font-mono font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                {item.cName}
              </span>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-6 text-xs font-mono text-slate-500">
            No anatomical categories registered in the node.
          </div>
        )}
      </div>
    </div>
  );
};

const Search = () => {
  const { data, dispatch } = useContext(HomeContext);
  const [search, setSearch] = useState("");
  const [productArray, setPa] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      let responseData = await getAllProduct();
      if (responseData && responseData.Products) {
        setPa(responseData.Products);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const searchHandle = (e) => {
    const val = e.target.value;
    setSearch(val);
    dispatch({
      type: "searchHandleInReducer",
      payload: val,
      productArray: productArray,
    });
  };

  const closeSearchBar = () => {
    dispatch({ type: "searchDropdown", payload: false });
    dispatch({ type: "setProducts", payload: productArray });
    setSearch("");
  };

  if (!data.searchDropdown) return null;

  return (
    <div className="my-4 p-4 rounded-xl vg-glass-elevated border border-cyan-500/40 shadow-2xl flex items-center space-x-3">
      <div className="p-2 text-cyan-400">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <input
        value={search}
        onChange={searchHandle}
        autoFocus
        type="text"
        placeholder="Query by Blood Group (e.g. O+, A+), Organ Category, or PIN Node..."
        className="flex-1 bg-transparent border-none text-slate-100 placeholder-slate-500 font-mono text-sm focus:outline-none"
      />

      {search && (
        <button
          onClick={() => {
            setSearch("");
            dispatch({ type: "setProducts", payload: productArray });
          }}
          className="text-xs font-mono text-slate-400 hover:text-white px-2 py-1 rounded"
        >
          CLEAR
        </button>
      )}

      <button
        onClick={closeSearchBar}
        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 transition-colors"
        aria-label="Close search"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

const ProductCategoryDropdown = () => {
  return (
    <Fragment>
      <CategoryList />
      <Search />
    </Fragment>
  );
};

export default ProductCategoryDropdown;
