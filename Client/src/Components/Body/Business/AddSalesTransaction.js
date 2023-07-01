import React, { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import "./AddSalesTransaction.css";
import { MenuItem, Select } from "@mui/material";
function AddSalesTransaction() {
  let myNavigate = useNavigate();
  useEffect(() => {
    // $(".salesOrCosts").hide();
  }, []);

  let toggleActiveSelections = (e) => {
    console.log(e.target.value);
    if (e.target.value == "singleSales") {
      myNavigate("addSingleSales");
    }
    if (e.target.value == "totalSales") {
      myNavigate("addTotalSales");
    }
  };
  return (
    <>
      <div value="default">Choose Sales type</div>
      <Select className="selectSalesMenue" onChange={toggleActiveSelections}>
        <MenuItem value="totalSales">Total Sales</MenuItem>
        <MenuItem value="singleSales">Single Sales</MenuItem>
      </Select>
      <Outlet />
    </>
  );
}
export default AddSalesTransaction;
