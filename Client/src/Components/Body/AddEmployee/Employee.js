import React, { useState } from "react";
import "./Employee.css";
import EmployeeSearch from "./EmployeeSearch";
import EmployeeView from "./EmoloyeeView";
const Employee = () => {
  const [RequiredDiv, setRequiredDiv] = useState("");
  let showTargetedDiv = (e, target) => {
    console.log(target);
    let element = document.getElementsByClassName("activeClass");
    console.log(element);
    for (let i = 0; i < element.length; i++) {
      element[i].classList.remove("activeClass");
      // element.classList.remove("mystyle");
    }
    let targetElement = e.target;
    targetElement.classList.add("activeClass");
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
        <div
          className="SearchButton"
          onClick={(e) => {
            showTargetedDiv(e, "search");
          }}
        >
          Add Employee
        </div>
        <div
          onClick={(e) => {
            showTargetedDiv(e, "view");
          }}
          className="ViewButton"
        >
          View
        </div>
      </div>
      {RequiredDiv}
    </div>
  );
};

export default Employee;
