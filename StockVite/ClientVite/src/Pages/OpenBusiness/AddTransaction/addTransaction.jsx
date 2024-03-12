import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "../../../CSS/addTransaction.css";
import { AppBar, Button, Toolbar } from "@mui/material";
import { ConsumeableContext } from "../../../Components/Body/UserContext/UserContext";
function AddTransaction({ Time }) {
  let navigate = useNavigate();
  let salesOrExpences = "";
  let setTargatedRegistration = (e) => {
    salesOrExpences = document.getElementsByClassName("salesOrExpences");
    let i = 0;
    for (; i < salesOrExpences.length; i++) {
      salesOrExpences[i].classList.remove("activeClass");
    }
    let currentBtn = e.target;
    currentBtn.classList.toggle("activeClass");
    if (e.target.name == "salesOrBuy") {
      navigate("AddSalesTranaction/addSingleSales");
    }
    if (e.target.name == "Expences") {
      navigate("ExpencesTransaction");
    }
  };

  const { ownersName, setownersName } = ConsumeableContext();
  useEffect(() => {
    let getByName = document.getElementsByName("salesOrBuy");
    let firstElement = getByName[0];
    firstElement.click();
    setownersName(localStorage.getItem("ownersName"));
  }, []);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Button
            color="inherit"
            className="salesOrExpences"
            name="salesOrBuy"
            onClick={setTargatedRegistration}
            sx={{ marginRight: "10px" }}
          >
            Purchase and Sales
          </Button>
          <Button
            color="inherit"
            className="salesOrExpences"
            name="Expences"
            onClick={setTargatedRegistration}
          >
            Expenses
          </Button>
          {/* <Button color="inherit">Home</Button>
          <Button color="inherit">About</Button>
          <Button color="inherit">Contact</Button> */}
        </Toolbar>
      </AppBar>
      <div className="addTransactionWrapper">
        <div className="addTransaction"></div>

        <Outlet />
      </div>
    </>
  );
}
export default AddTransaction;
