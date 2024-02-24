import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "../../../CSS/addTransaction.css";
import { Button } from "@mui/material";
import { ConsumeableContext } from "../../../Components/Body/UserContext/UserContext";
function AddTransaction({ Time }) {
  let navigate = useNavigate();
  let setTargatedRegistration = (e) => {
    let salesOrCosts = document.getElementsByClassName("salesOrCosts"),
      i = 0;
    for (; i < salesOrCosts.length; i++) {
      salesOrCosts[i].classList.remove("activeClass");
    }
    let currentBtn = e.target;
    currentBtn.classList.toggle("activeClass");
    if (e.target.name == "Sales") {
      navigate("AddSalesTranaction/addSingleSales");
    }
    if (e.target.name == "Cost") {
      navigate("ExpencesTransaction");
    }
  };

  const { ownersName, setownersName } = ConsumeableContext();
  useEffect(() => {
    setownersName(localStorage.getItem("ownersName"));
  }, []);

  return (
    <div className="addTransactionWrapper">
      <div className="addTransaction">
        <Button
          className="salesOrCosts"
          name="Sales"
          onClick={setTargatedRegistration}
          sx={{ marginRight: "10px" }}
        >
          Purchase and Sales
        </Button>
        <Button
          className="salesOrCosts"
          name="Cost"
          onClick={setTargatedRegistration}
        >
          Expenses
        </Button>
      </div>

      <Outlet />
    </div>
  );
}
export default AddTransaction;
