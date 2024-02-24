import React, { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import "../../../CSS/AddSalesTransaction.css";
function AddSalesTransaction() {
  const [selectedValue, setSelectedValue] = useState("default");
  let myNavigate = useNavigate();
  useEffect(() => {
    myNavigate("addSingleSales");
  }, []);

  return (
    <div className="addSalesWrapper">
      <Outlet />
    </div>
  );
}
export default AddSalesTransaction;
