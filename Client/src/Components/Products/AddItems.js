// import React, { useState } from "react";
import AddExpencesItems from "../Expences/AddExpencesItems";
// import "./AddItems.css";
import AddProducts from "./AddProducts";
import React, { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Button } from "@mui/material";
import SearchExpencesItem from "../Expences/SearchExpencesItem";
import AddExpencesTransaction from "../Expences/AddExpencesTransaction";

const SalesAndExpensesTabs = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const [AddExpences, setAddExpences] = useState(false);
  return (
    <div>
      <Tabs value={tabValue} onChange={handleChange}>
        <Tab label="PRODUCT" />
        <Tab label="Expenses" />
      </Tabs>
      {tabValue === 0 && <AddProducts />}
      {tabValue === 1 && (
        <>
          <br />
          <Button variant="contained" onClick={() => setAddExpences(true)}>
            Add expence Item
          </Button>
          <br />
          <br />
          {AddExpences && (
            <AddExpencesItems data={{ setAddExpences, AddExpences }} />
          )}
          <AddExpencesTransaction />
        </>
      )}
    </div>
  );
};

export default SalesAndExpensesTabs;
