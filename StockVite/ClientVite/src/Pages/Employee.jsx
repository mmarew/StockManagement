import React, { useState } from "react";
import "../CSS/Employee.css";
import EmployeeSearch from "../Components/Employee/EmployeeSearch";
import EmployeeView from "../Components/Employee/EmoloyeeView";
import { Tab, Tabs } from "@mui/material";
const Employee = () => {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div>
      <div>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Add Employee" />
          <Tab label="View Employee" />
        </Tabs>

        {value === 0 && (
          <div>
            <EmployeeSearch />
          </div>
        )}
        {value === 1 && (
          <div>
            <EmployeeView />
          </div>
        )}
      </div>
    </div>
  );
};

export default Employee;
