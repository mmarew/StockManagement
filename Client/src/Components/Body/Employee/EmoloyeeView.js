import axios from "axios";
import React, { useEffect, useState } from "react";

import "react-confirm-alert/src/react-confirm-alert.css";
import { Button } from "@mui/material";
import SuccessOrError from "../Others/SuccessOrError";
import RemoveEmployeeModal from "./EmployeeRemove";
function EmployeeView() {
  let serverAddress = localStorage.getItem("targetUrl");
  const [EmployeesList, setEmployeesList] = useState();
  // console.log("first" + employeeId);
  const [Errors, setErrors] = useState();
  const [ShowConfirmDialog, setShowConfirmDialog] = useState({
    open: false,
    employeeId: "",
  });
  // confirmAction,confirmMessages,setRemoveThisEmployee
  const [confirmAction, setconfirmAction] = useState("");
  const [confirmMessages, setconfirmMessages] = useState("");
  const [RemoveEmployee, setRemoveThisEmployee] = useState("");
  useEffect(() => {
    console.log(RemoveEmployee);
    let items = RemoveEmployee.items,
      status = RemoveEmployee.status;
    if (status == "Confirmed") {
      // RemoveThisEmployee(items.employeeId);
    }
  }, [RemoveEmployee]);

  const [noEmployee, setnoEmployee] = useState(<h1>No Employee</h1>);
  let getBusinessEmployee = async () => {
    try {
      let businessId = localStorage.getItem("businessId");
      console.log("businessId is " + businessId);
      let response = await axios.post(serverAddress + "getBusinessEmployee/", {
        businessId,
        token: localStorage.getItem("storeToken"),
      });
      console.log("response", response);
      setEmployeesList(response.data.data);
      setErrors("");
    } catch (error) {
      setErrors(error.message);
      console.log("error", error);
    }
  };
  useEffect(() => {
    getBusinessEmployee();
  }, []);
  return (
    <div>
      {Errors && <SuccessOrError setErrors={setErrors} request={Errors} />}
      <div>
        {console.log(EmployeesList)}

        {EmployeesList?.length == 0 && <>{noEmployee}</>}

        {EmployeesList?.map((items) => {
          console.log(items);
          return (
            <div
              id={items.employeeId}
              key={items.employeeId}
              className="EmployeeListWrapper"
            >
              <div className="Employee">
                <div> Name</div>
                <div> {items.employeeName}</div>
              </div>
              <div>
                <div> Phone number</div>
                <div>
                  <a href={"tel:+" + items.phoneNumber}>{items.phoneNumber}</a>
                </div>
              </div>
              <div>
                <div>Action</div>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    setShowConfirmDialog({
                      open: true,
                      employeeId: items.employeeId,
                    });
                  }}
                >
                  Remove
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      {ShowConfirmDialog.open && (
        <RemoveEmployeeModal
          getBusinessEmployee={getBusinessEmployee}
          employeeId={ShowConfirmDialog.employeeId}
          removeModal={setShowConfirmDialog}
        />
      )}
    </div>
  );
}

export default EmployeeView;
