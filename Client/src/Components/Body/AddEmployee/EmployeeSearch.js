import axios from "axios";
import React, { useState } from "react";
import $, { each } from "jquery";
import { confirmAlert } from "react-confirm-alert";
import { Button, TextField } from "@mui/material";
import EmployeeSearchCss from "./EmployeeSearch.module.css";
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
    $(".LinearProgress").css("display", "block");
    let response = await axios.post(
      serverAddress + "searchEmployee/",
      InputValue
    );
    $(".LinearProgress").css("display", "none");
    console.log("searchEmployees", response);
    let allEmployee = response.data.data.result,
      connectedEmployees = response.data.data.results1,
      SearchedEmployees = allEmployee.map((item, index1) => {
        allEmployee[index1].connection = "notConnected";
        // filter connected and not connected employees
        connectedEmployees.map((employee, index) => {
          let x = index;
          console.log(employee, item);
          if (employee.userId == item.userId) {
            console.log(employee.userId, item.userId);
            allEmployee[index1].connection = "connected";
            return { ...item, connection: "connected" };
          }
        });
        return item;
      });
    console.log("SearchedEmployees", SearchedEmployees);
    setsearchedEmployee(SearchedEmployees);
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
        <div className={EmployeeSearchCss.searchWrapper}>
          <TextField
            label="Employee Name"
            required
            className={EmployeeSearchCss.MuiInputBase_root1}
            id={EmployeeSearchCss.employeeNameToBeSearched}
            onChange={collectInput}
            name="employeeNameToBeSearched"
            type="search"
          />
          <Button
            className={EmployeeSearchCss.searchButton}
            variant="contained"
            type="submit"
          >
            search
          </Button>
        </div>
      </form>
      {console.log("searchedEmployee", searchedEmployee)}
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
