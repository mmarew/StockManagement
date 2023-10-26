import React, { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import "./AddSalesTransaction.css";
import { MenuItem, Select } from "@mui/material";
function AddSalesTransaction() {
  const [selectedValue, setSelectedValue] = useState("default");
  let myNavigate = useNavigate();
  useEffect(() => {
    // $(".salesOrCosts").hide();
  }, []);

  let toggleActiveSelections = (e) => {
    setSelectedValue(e.target.value);
    console.log(e.target.value);
    if (e.target.value == "singleSales") {
      myNavigate("addSingleSales");
    }
    if (e.target.value == "totalSales") {
      myNavigate("addTotalSales");
    }
  };

  return (
    <div className="addSalesWrapper">
      <Select
        sx={{ margin: "auto", marginLeft: "20px" }}
        value={selectedValue}
        className="selectSalesMenue"
        onChange={toggleActiveSelections}
      >
        <MenuItem value="default">Choose Sales type</MenuItem>
        <MenuItem value="totalSales">Total Sales</MenuItem>
        <MenuItem value="singleSales">Single Sales</MenuItem>
      </Select>
      <Outlet />
    </div>
  );
}
export default AddSalesTransaction;
