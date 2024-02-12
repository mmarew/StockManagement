import React, { useState } from "react";
import "./Employee.css";
import EmployeeSearch from "./EmployeeSearch";
import EmployeeView from "./EmoloyeeView";
import { Tab, Tabs } from "@mui/material";
const Employee = () => {
  const [RequiredDiv, setRequiredDiv] = useState("");

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
