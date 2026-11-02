import React, { Fragment, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import { LayoutContext } from "../layout";
import { deleteReview } from "./Action";
import { isAuthenticate } from "../auth/fetchApi";
import { getSingleProduct } from "./FetchApi";

const AllReviews = () => {
  const { data, dispatch } = useContext(LayoutContext);
  const { pRatingsReviews } = data.singleProductDetail || { pRatingsReviews: [] };
  let { id } = useParams();

  const [fData, setFdata] = useState({ success: false });

  if (fData.success) {
    setTimeout(() => {
      setFdata({ ...fData, success: false });
    }, 2000);
  }

  const fetchData = async () => {
    try {
      let responseData = await getSingleProduct(id);
      if (responseData && responseData.Product) {
        dispatch({
          type: "singleProductDetail",
          payload: responseData.Product,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Fragment>
      <div className="space-y-4 my-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-mono uppercase tracking-wider text-slate-300 font-bold flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>Clinical Pathology Validation Log</span>
          </h3>
          <span className="text-xs font-mono text-cyan-400">
            Validated Reports: {pRatingsReviews ? pRatingsReviews.length : 0}
          </span>
        </div>

        {pRatingsReviews && pRatingsReviews.length > 0 ? (
          pRatingsReviews.map((item, index) => {
            const isAuthor =
              item.user &&
              isAuthenticate() &&
              item.user._id === isAuthenticate().user._id;

            return (
              <div
                key={index}
                className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/90 flex flex-col sm:flex-row items-start justify-between gap-4"
              >
                <div className="flex space-x-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 flex items-center justify-center font-bold text-xs uppercase flex-shrink-0">
                    {item.user ? item.user.name?.charAt(0) : "M"}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold text-slate-200">
                        {item.user ? item.user.name : "Procurement Officer"}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {moment(item.createdAt).format("LLL")}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      {item.review}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 self-end sm:self-start">
                  {/* Rating Stars */}
                  <div className="flex text-cyan-400">
                    {[...Array(Number(item.rating) || 5)].map((_, i) => (
                      <svg key={i} className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  {isAuthor && (
                    <button
                      onClick={() =>
                        deleteReview(
                          item._id,
                          data.singleProductDetail._id,
                          fetchData,
                          setFdata
                        )
                      }
                      className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                      title="Delete Entry"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 text-center text-xs font-mono text-slate-500">
            No pathologist notes logged yet for this biological graft.
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default AllReviews;
