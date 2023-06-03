import axios from "axios";
import React, { useEffect, useState } from "react";
import $ from "jquery";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
function EmployeeView() {
  let serverAddress = localStorage.getItem("targetUrl");
  const [EmployeesList, setEmployeesList] = useState();
  let RemoveThisEmployee = async (employeeId) => {
    console.log("first" + employeeId);

    confirmAlert({
      title: "Confirm",
      message: "Are you sure to do this.",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            let response = await axios.post(
              serverAddress + "removeEmployees/",
              {
                employeeId,
              }
            );
            console.log("items is ");
            console.log(response.data.Status);
            if (response.data.Status == "deleted") {
              $("#" + response.data.EmployeeId).remove();
            }
          },
        },
        {
          label: "No",
          onClick: () => alert("Click No"),
        },
      ],
    });
  };
  const [noEmployee, setnoEmployee] = useState(<h1>No Employee</h1>);
  let getBusinessEmployee = async () => {
    let businessId = localStorage.getItem("businessId");
    console.log("businessId is " + businessId);
    let response = await axios.post(serverAddress + "getBusinessEmployee/", {
      businessId,
    });
    setEmployeesList(response.data.data);
  };
  useEffect(() => {
    getBusinessEmployee();
  }, []);
  return (
    <div>
      <div>
        {console.log(EmployeesList)}

        {EmployeesList?.length == 0 && (
          <>
            {$("h1").remove()}
            {noEmployee}
          </>
        )}

        {EmployeesList?.map((items) => {
          console.log(items);
          return (
            <div
              id={items.employeeId}
              key={items.employeeId}
              className="employeeList"
            >
              <div> Name:- {items.employeeName}</div>
              <div> Phone number:- {items.phoneNumber}</div>
              <button
                onClick={() => {
                  RemoveThisEmployee(items.employeeId);
                }}
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default EmployeeView;
