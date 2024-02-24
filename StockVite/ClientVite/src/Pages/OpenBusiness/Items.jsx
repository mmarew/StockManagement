import AddExpencesItems from "../../Components/Expences/AddExpencesItems";
import AddProducts from "../../Components/Products/AddProducts";
import React, { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

const AddItems = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div>
      <Tabs value={tabValue} onChange={handleChange}>
        <Tab label="PRODUCT" />
        <Tab label="Expenses" />
      </Tabs>
      {tabValue === 0 && <AddProducts />}
      {tabValue === 1 && <AddExpencesItems />}
    </div>
  );
};

export default AddItems;
