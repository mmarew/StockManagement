import axios from "axios";
import React, { useEffect, useState } from "react";
import $ from "jquery";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import ConfirmDialog from "../Others/Confirm";
function EmployeeView() {
  let serverAddress = localStorage.getItem("targetUrl");
  const [EmployeesList, setEmployeesList] = useState();
  // console.log("first" + employeeId);
  const [ShowConfirmDialog, setShowConfirmDialog] = useState(false);
  // confirmAction,confirmMessages,setRemoveThisEmployee
  const [confirmAction, setconfirmAction] = useState("");
  const [confirmMessages, setconfirmMessages] = useState("");
  const [RemoveEmployee, setRemoveThisEmployee] = useState("");
  useEffect(() => {
    console.log(RemoveEmployee);
    let items = RemoveEmployee.items,
      status = RemoveEmployee.status;
    if (status == "Confirmed") {
      RemoveThisEmployee(items.employeeId);
    }
  }, [RemoveEmployee]);

  let RemoveThisEmployee = async (employeeId) => {
    let response = await axios.post(serverAddress + "removeEmployees/", {
      employeeId,
    });
    console.log("items is ");
    console.log(response.data.Status);
    if (response.data.Status == "deleted") {
      $("#" + response.data.EmployeeId).remove();
    }
  };
  const [noEmployee, setnoEmployee] = useState(<h1>No Employee</h1>);
  let getBusinessEmployee = async () => {
    let businessId = localStorage.getItem("businessId");
    console.log("businessId is " + businessId);
    let response = await axios.post(serverAddress + "getBusinessEmployee/", {
      businessId,
    });
    console.log("response", response);
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
                  setShowConfirmDialog(true);
                  setconfirmMessages("Are you sure to remove this employee?");
                  setconfirmAction("removeEmployee");
                  setRemoveThisEmployee({ items, status: "notConfirmed" });

                  // RemoveThisEmployee(items.employeeId);
                }}
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>
      {ShowConfirmDialog && (
        <ConfirmDialog
          action={confirmAction}
          message={confirmMessages}
          open={ShowConfirmDialog}
          setShowConfirmDialog={setShowConfirmDialog}
          onConfirm={setRemoveThisEmployee}
        />
      )}
    </div>
  );
}

export default EmployeeView;
