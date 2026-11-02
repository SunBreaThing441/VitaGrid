import React, { Fragment } from "react";
import AllReviews from "./AllReviews";
import ReviewForm from "./ReviewForm";
import { isAuthenticate } from "../auth/fetchApi";

const RatingReview = () => {
  return (
    <Fragment>
      <AllReviews />
      {isAuthenticate() ? (
        <ReviewForm />
      ) : (
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center font-mono text-xs text-slate-400">
          Authenticated hospital personnel or OPO officers may submit clinical notes.
        </div>
      )}
    </Fragment>
  );
};

const ProductDetailsSectionTwo = () => {
  return (
    <Fragment>
      <section className="my-8 space-y-6">
        <RatingReview />
      </section>
    </Fragment>
  );
};

export default ProductDetailsSectionTwo;
