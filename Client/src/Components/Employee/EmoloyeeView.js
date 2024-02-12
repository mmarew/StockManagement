import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import SuccessOrError from "../Body/Others/SuccessOrError";
import RemoveEmployeeModal from "./EmployeeRemove";

function EmployeeView() {
  const serverAddress = localStorage.getItem("targetUrl");
  const [employeesList, setEmployeesList] = useState([]);
  const [errors, setErrors] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState({
    open: false,
    employeeId: "",
  });

  const getBusinessEmployee = async () => {
    try {
      const businessId = localStorage.getItem("businessId");
      const response = await axios.post(
        serverAddress + "getBusinessEmployee/",
        {
          businessId,
          token: localStorage.getItem("storeToken"),
        }
      );
      setEmployeesList(response.data.data);
      setErrors("");
    } catch (error) {
      setErrors(error.message);
    }
  };

  useEffect(() => {
    getBusinessEmployee();
  }, []);

  return (
    <div>
      {errors && <SuccessOrError setErrors={setErrors} request={errors} />}
      <div>
        {employeesList.length === 0 && (
          <h4 style={{ color: "red" }}>No Employee</h4>
        )}
        {employeesList.map((employee) => (
          <div key={employee.employeeId} className="EmployeeListWrapper">
            <div className="Employee">
              <div> Name</div>
              <div> {employee.employeeName}</div>
            </div>
            <div>
              <div> Phone number</div>
              <div>
                <a href={"tel:+" + employee.phoneNumber}>
                  {employee.phoneNumber}
                </a>
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
                    employeeId: employee.employeeId,
                  });
                }}
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
      {showConfirmDialog.open && (
        <RemoveEmployeeModal
          getBusinessEmployee={getBusinessEmployee}
          employeeId={showConfirmDialog.employeeId}
          removeModal={setShowConfirmDialog}
        />
      )}
    </div>
  );
}

export default EmployeeView;
