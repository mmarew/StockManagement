import axios from "axios";
import React, { useState } from "react";
const EmployeeSearch = () => {
  let serverAddress = localStorage.getItem("targetUrl");
  const [InputValue, setInputValue] = useState();
  const [searchedEmployee, setsearchedEmployee] = useState([]);
  let addEmployeeDatas = async (name, phone, userId) => {
    console.log(name, phone, userId);

    let businessId = localStorage.getItem("businessId");
    let response = await axios.post(serverAddress + `addEmployee/`, {
      name,
      businessId,
      phone,
      userId,
    });
    console.log("addEmployeeDatas");
    console.log(response.data.data);
    if (response.data.data == "data is already registered bofore") {
      alert(
        "This Employee is already registered before in this business. Try other employee. Thank you."
      );
    } else {
      alert(name + ` is registered as your employee. Thank you.`);
    }
  };
  let collectInput = (e) => {
    console.log(e.target.value);
    let name = e.target.name,
      value = e.target.value;
    setInputValue({ [name]: value });
  };
  let searchEmployees = async (e) => {
    e.preventDefault();
    console.log("searchEmployees");
    let response = await axios.post(
      serverAddress + "searchEmployee",
      InputValue
    );
    console.log("@searchEmployee response = ", response.data.data);
    setsearchedEmployee(response.data.data);
  };
  return (
    <div>
      <form
        className="employeeSearchForm"
        action=""
        method="post"
        onSubmit={searchEmployees}
      >
        <h4 className="nameLabel">Employee Name / Phone</h4>
        <input
          id="employeeNameToBeSearched"
          onChange={collectInput}
          name="employeeNameToBeSearched"
          type="search"
        />
        <input type="submit" value="search" />
      </form>
      {searchedEmployee?.map((items) => {
        console.log("items " + items.employeeName, items.phoneNumber);
        return (
          <div key={items.userId} className="searchedEmloyee">
            <div>Name {items.employeeName}</div>
            <div>Phone {items.phoneNumber}</div>
            <button
              onClick={() => {
                addEmployeeDatas(
                  items.employeeName,
                  items.phoneNumber,
                  items.userId
                );
              }}
            >
              Add This Employee
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default EmployeeSearch;
