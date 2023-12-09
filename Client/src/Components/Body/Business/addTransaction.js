import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "./addTransaction.css";
import $ from "jquery";
import { Button } from "@mui/material";
import { ConsumeableContext } from "../UserContext/UserContext";
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
      navigate("AddSalesTranaction/addSingleSales");
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
  const { ownersName, setownersName } = ConsumeableContext();
  setownersName(localStorage.getItem("ownersName"));
  return (
    <div className="addTransactionWrapper">
      <div className="addTransaction">
        <Button
          className="salesOrCosts"
          name="Sales"
          onClick={setTargatedRegistration}
          // variant="contained"
          // color="success"
          sx={{ marginRight: "10px" }}
        >
          Purchase and Sales
        </Button>
        <Button
          className="salesOrCosts"
          name="Cost"
          onClick={setTargatedRegistration}
          // variant="contained"
          // color="warning"
        >
          Expenses
        </Button>
      </div>
      {/* <hr style={{ borderTop: "1px solid #ccc", margin: "20px 0" }} /> */}

      <div>{Transaction}</div>
      <Outlet />
    </div>
  );
}
export default AddTransaction;
