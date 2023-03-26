import React, { useEffect } from "react";
import $ from "jquery";
import { Link, Outlet } from "react-router-dom";
import "./AddSalesTransaction.css";
function AddSalesTransaction() {
  useEffect(() => {
    $(".salesOrCosts").hide();
  }, []);

  let toggleActineness = (e) => {
    console.log(e.target);
    let totalOrsingleSales =
      document.getElementsByClassName("totalOrsingleSales");
    let i = 0;
    for (i = 0; i < totalOrsingleSales.length; i++) {
      console.log(totalOrsingleSales[i]);
      totalOrsingleSales[i].classList.remove("activeClas");
    }
    let currentBtn = e.target;
    currentBtn.classList.toggle("activeClas");
    return "";
  };
  return (
    <div>
      <Link
        onClick={toggleActineness}
        className="totalOrsingleSales"
        to={"addTotalSales"}
      >
        Total Sales
      </Link>
      <Link
        onClick={toggleActineness}
        className="totalOrsingleSales"
        to={"addSingleSales"}
      >
        Single Sales
      </Link>
      <Outlet />
    </div>
  );
}
export default AddSalesTransaction;
