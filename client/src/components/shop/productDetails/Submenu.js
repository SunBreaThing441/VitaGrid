import React, { Fragment } from "react";
import { useHistory } from "react-router-dom";

const Submenu = (props) => {
  const { categoryId, category, product } = props.value;
  const history = useHistory();

  return (
    <Fragment>
      <section className="my-4 font-mono text-xs">
        <div className="flex items-center space-x-2 text-slate-400">
          <span
            className="hover:text-cyan-400 cursor-pointer transition-colors"
            onClick={() => history.push("/")}
          >
            Organ Registry
          </span>
          <span className="text-slate-600">/</span>
          <span
            className="hover:text-cyan-400 cursor-pointer transition-colors"
            onClick={() => history.push(`/products/category/${categoryId}`)}
          >
            {category}
          </span>
          <span className="text-slate-600">/</span>
          <span className="text-cyan-400 font-semibold">{product}h Tolerance</span>
        </div>
      </section>
    </Fragment>
  );
};

export default Submenu;
