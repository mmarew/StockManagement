import React, { useState } from "react";
import "./Employee.css";
import EmployeeSearch from "./EmployeeSearch";
import EmployeeView from "./EmoloyeeView";
const Employee = () => {
  const [RequiredDiv, setRequiredDiv] = useState("");
  let showTargetedDiv = (target) => {
    console.log(target);
    if (target == "search") {
      setRequiredDiv(<EmployeeSearch />);
    } else {
      setRequiredDiv(<EmployeeView />);
    }
    // setRequiredDiv(target);
  };
  return (
    <div>
      <div className="EmployeeButton">
        <button
          className="SearchButton"
          onClick={() => {
            showTargetedDiv("search");
          }}
        >
          Add Employee
        </button>
        <button
          onClick={() => {
            showTargetedDiv("view");
          }}
          className="ViewButton"
        >
          View
        </button>
      </div>
      {RequiredDiv}
    </div>
  );
};

export default Employee;
