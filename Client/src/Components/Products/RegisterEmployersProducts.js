import React from "react";
import AddExpencesTransaction from "../Expences/AddExpencesTransaction";
import AddTotalSales from "../Transaction/AddTrans/AddTotalSales";
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
