import React, { useState } from "react";
import AddCostTransaction from "./AddCostTransaction";
import AddSales from "./AddSales";
import "./addTransaction.css";
function AddTransaction({ Time }) {
  const [Transaction, setTransaction] = useState("");
  let setTargatedRegistration = (e) => {
    if (e.target.name == "Sales") setTransaction(<AddSales />);
    if (e.target.name == "Cost") setTransaction(<AddCostTransaction />);
  };

  return (
    <>
      <div className="addTransaction">
        <button name="Sales" onClick={setTargatedRegistration}>
          Sales
        </button>
        <button name="Cost" onClick={setTargatedRegistration}>
          Cost
        </button>
      </div>
      <br />
      <div>{Transaction}</div>
    </>
  );
}
export default AddTransaction;
