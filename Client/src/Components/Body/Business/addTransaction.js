import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AddCostTransaction from "./AddCostTransaction";
import AddSalesTranaction from "./AddSalesTranaction";
import "./addTransaction.css";
import $ from "jquery";
import { Button } from "@mui/material";
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
      <h5>Register Sales or Cost Transaction</h5>
      <div className="addTransaction">
        <Button
          className="salesOrCosts"
          name="Sales"
          onClick={setTargatedRegistration}
        >
          Register Sales
        </Button>
        <Button
          className="salesOrCosts"
          name="Cost"
          onClick={setTargatedRegistration}
        >
          Register Cost
        </Button>
      </div>
      <hr />
      <br />
      <div>{Transaction}</div>
      <Outlet />
    </div>
  );
}
export default AddTransaction;
