import React from "react";
import AddExpencesTransaction from "../Components/Transaction/ExpencesTransaction";
import AddTotalSales from "./OpenBusiness/AddTransaction/AddTotalSales";
function RegisterEmployersProducts() {
  return (
    <>
      <AddTotalSales />
      <br /> <br />
      <h3>Cost Transaction</h3>
      <br />
      <AddExpencesTransaction />
    </>
  );
}
export default RegisterEmployersProducts;
