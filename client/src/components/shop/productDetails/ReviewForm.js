import React, { Fragment, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { reviewSubmitHanlder } from "./Action";
import { LayoutContext } from "../layout";
import { isAuthenticate } from "../auth/fetchApi";
import { getSingleProduct } from "./FetchApi";

const ReviewForm = () => {
  const { data, dispatch } = useContext(LayoutContext);
  let { id } = useParams();

  const [fData, setFdata] = useState({
    rating: "5",
    review: "",
    error: false,
    success: false,
    pId: id,
  });

  if (fData.error || fData.success) {
    setTimeout(() => {
      setFdata({ ...fData, error: false, success: false });
    }, 3000);
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

  const ratingUserList =
    data.singleProductDetail && data.singleProductDetail.pRatingsReviews
      ? data.singleProductDetail.pRatingsReviews.map((item) =>
          item.user ? item.user._id : ""
        )
      : [];

  const currentUser = isAuthenticate() ? isAuthenticate().user : null;

  if (currentUser && ratingUserList.includes(currentUser._id)) {
    return null;
  }

  return (
    <Fragment>
      <div className="p-6 rounded-2xl vg-glass border border-slate-800 shadow-xl my-6">
        {fData.error && <div className="mb-4 text-xs font-mono text-rose-400">{fData.error}</div>}
        {fData.success && <div className="mb-4 text-xs font-mono text-emerald-400">{fData.success}</div>}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-mono uppercase tracking-wider text-slate-200 font-bold">
              Submit Clinical Cross-Match / Pathology Assessment
            </h4>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-slate-400">Viability Score:</span>
              <select
                value={fData.rating}
                onChange={(e) => setFdata({ ...fData, rating: e.target.value })}
                className="bg-slate-900 border border-slate-700 text-cyan-300 font-mono text-xs rounded px-2 py-1 focus:outline-none"
              >
                <option value="5">5/5 - Optimal Viability</option>
                <option value="4">4/5 - High Compatibility</option>
                <option value="3">3/5 - Acceptable with Monitoring</option>
                <option value="2">2/5 - Borderline Cold Tolerance</option>
                <option value="1">1/5 - High Risk</option>
              </select>
            </div>
          </div>

          <div>
            <textarea
              onChange={(e) => setFdata({ ...fData, review: e.target.value })}
              value={fData.review}
              rows={3}
              placeholder="Enter HLA crossmatch observations, perfusion notes, donor organ biopsy findings..."
              className="w-full vg-input font-mono text-xs leading-relaxed"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => reviewSubmitHanlder(fData, setFdata, fetchData)}
              className="vg-btn-primary text-xs font-mono py-2 px-4 uppercase"
            >
              Sign & Commit Clinical Entry
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ReviewForm;
