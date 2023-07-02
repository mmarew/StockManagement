import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AddCostTransaction from "./AddCostTransaction";
import AddSalesTranaction from "./AddSalesTranaction";
import "./addTransaction.css";
import $ from "jquery";
function AddTransaction({ Time }) {
  let navigate = useNavigate();
  const [Transaction, setTransaction] = useState("");
  let setTargatedRegistration = (e) => {
    let salesOrCosts = document.getElementsByClassName("salesOrCosts"),
      i = 0;
    for (; i < salesOrCosts.length; i++) {
      console.log(salesOrCosts[i]);
      salesOrCosts[i].classList.remove("activeClass");
    }
    let currentBtn = e.target;
    currentBtn.classList.toggle("activeClass");
    if (e.target.name == "Sales") {
      navigate("AddSalesTranaction");
    }
    //  setTransaction(<AddSalesTranaction />);
    if (e.target.name == "Cost") {
      navigate("AddCostTransaction");
    }
    // setTransaction(<AddCostTransaction />);
  };
  useEffect(() => {
    $(".salesOrCosts").show();
  }, []);
  return (
    <div className="addTransactionWrapper">
      <div className="addTransaction">
        <button
          className="salesOrCosts"
          name="Sales"
          onClick={setTargatedRegistration}
        >
          Sales
        </button>
        <button
          className="salesOrCosts"
          name="Cost"
          onClick={setTargatedRegistration}
        >
          Cost
        </button>
      </div>
      <hr />
      <br />
      <div>{Transaction}</div>
      <Outlet />
    </div>
  );
}
export default AddTransaction;
