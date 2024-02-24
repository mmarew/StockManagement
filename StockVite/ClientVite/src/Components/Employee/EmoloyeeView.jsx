import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Button,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import SuccessOrError from "../Body/Others/SuccessOrError";
import RemoveEmployeeModal from "./EmployeeRemove";
import { ButtonProcessing } from "../Utilities/Utility";

function EmployeeView() {
  const [Processing, setProcessing] = useState(true);
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
      setProcessing(false);
      setEmployeesList(response.data.data);
      setErrors("");
    } catch (error) {
      setProcessing(false);
      setErrors(error.message);
    }
  };

  useEffect(() => {
    getBusinessEmployee();
  }, []);

  return (
    <div>
      {Processing && (
        <div style={{ marginTop: "10px" }}>
          <LinearProgress />{" "}
        </div>
      )}
      {errors && <SuccessOrError setErrors={setErrors} request={errors} />}
      <div>
        {employeesList.length === 0 && (
          <h4 style={{ color: "red" }}>No Employee</h4>
        )}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employeesList.map((employee) => (
                <TableRow key={employee.employeeId}>
                  <TableCell>{employee.employeeName}</TableCell>
                  <TableCell>
                    <a href={"tel:+" + employee.phoneNumber}>
                      {employee.phoneNumber}
                    </a>
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
