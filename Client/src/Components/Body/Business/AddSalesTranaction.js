import React from "react";
import { Link, Outlet } from "react-router-dom";
import "./AddSalesTranaction.css";
function AddSalesTranaction() {
  return (
    <div className="AddSalesTranactionWrapper">
      <Link className="singleOrTotal" to={"totalSalestransaction"}>
        Total Sales
      </Link>
      <Link className="singleOrTotal" to={"singleSalestransaction"}>
        Single Sales
      </Link>
      <Outlet />
    </div>
  );
}

export default AddSalesTranaction;
