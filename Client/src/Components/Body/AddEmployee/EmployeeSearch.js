import axios from "axios";
import React, { useState } from "react";
import $, { each } from "jquery";
import { confirmAlert } from "react-confirm-alert";
const EmployeeSearch = () => {
  let serverAddress = localStorage.getItem("targetUrl");
  const [InputValue, setInputValue] = useState();
  const [searchedEmployee, setsearchedEmployee] = useState([]);
  let addEmployeeDatas = async (name, phone, userId) => {
    let businessId = localStorage.getItem("businessId");
    let storeToken = localStorage.getItem("storeToken");

    confirmAlert({
      title: "Confirm to submit",
      message: "Are you sure to do this.",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            let response = await axios.post(serverAddress + `addEmployee/`, {
              name,
              businessId,
              phone,
              storeToken,
              userId,
            });
            if (response.data.data == "data is already registered bofore") {
              alert(
                "This Employee is already registered before in this business. Try other employee. Thank you."
              );
            } else {
              alert(name + ` is registered as your employee. Thank you.`);
              searchEmployees("noEvent", "");
            }
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };
  let collectInput = (e) => {
    let name = e.target.name,
      value = e.target.value;
    let businessId = localStorage.getItem("businessId");
    setInputValue({ [name]: value, businessId });
  };
  let searchEmployees = async (e, employeeName) => {
    if (e != "noEvent") e.preventDefault();
    console.log("InputValue", InputValue);

    let response = await axios.post(
      serverAddress + "searchEmployee/",
      InputValue
    );
    console.log("searchEmployees", response);
    let allEmployee = response.data.data.result;
    let connectedEmployees = response.data.data.results1;
    allEmployee.map((item, index1) => {
      allEmployee[index1].connection = "notConnected";
      connectedEmployees.map((employee, index) => {
        let x = index;

        if (employee.userId == item.userId) {
          allEmployee[index1].connection = "connected";
        }
      });
    });

    setsearchedEmployee(allEmployee);
  };
  // useEffect( , [searchedEmployee]);
  return (
    <div>
      <form
        className="employeeSearchForm"
        action=""
        method="post"
        onSubmit={(e) => {
          searchEmployees(e, "noData");
        }}
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
        return (
          <div
            id={"employeId_" + items.userId}
            key={items.userId}
            className="searchedEmloyee"
          >
            <div>Name {items.employeeName}</div>
            <div>Phone {items.phoneNumber}</div>
            {items.connection == "connected" ? (
              <button className="EmployeeToBusiness">
                Employee To This Business
              </button>
            ) : (
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
            )}
          </div>
        );
      })}
    </div>
  );
};

export default EmployeeSearch;
