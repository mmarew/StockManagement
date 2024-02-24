import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import EmployeeSearchCss from "./EmployeeSearch.module.css";
import { Chip } from "@mui/material";
import SuccessOrError from "../Body/Others/SuccessOrError";
import ConfirmDialog from "../Body/Others/Confirm";
import { ButtonProcessing } from "../Utilities/Utility";
const EmployeeSearch = () => {
  const [Processing, setProcessing] = useState(false);

  const [ShowConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setconfirmAction] = useState("");
  const [PersonAsEmployee, setThisPersonAsEmployee] = useState({});
  const [Errors, setErrors] = useState("");
  useEffect(() => {
    let items = PersonAsEmployee.items,
      status = PersonAsEmployee.status;
    if (status == "Confirmed")
      addEmployeeDatas(items.employeeName, items.phoneNumber, items.userId);
  }, [PersonAsEmployee]);
  const [confirmMessages, setconfirmMessages] = useState("");
  let serverAddress = localStorage.getItem("targetUrl");
  const [InputValue, setInputValue] = useState({
    token: localStorage.getItem("storeToken"),
  });
  // const [first, setfirst] = useState(second)
  const [searchedEmployee, setsearchedEmployee] = useState({
    noOfEmployees: [],
    status: null,
  });
  let addEmployeeDatas = async (name, phone, userId) => {
    try {
      let businessId = localStorage.getItem("businessId");
      let token = localStorage.getItem("storeToken");
      setProcessing(true);
      let response = await axios.post(serverAddress + `addEmployee/`, {
        name,
        businessId,
        phone,
        token,
        userId,
      });
      // setProcessing(false);
      if (response.data.data == "data is already registered bofore") {
        setErrors(
          "This Employee is already registered before in this business. Try other employee. Thank you."
        );
      } else {
        setErrors(`SUCCESS`);
        searchEmployees("noEvent", "");
      }
    } catch (error) {
      setProcessing(false);
    }
  };
  let collectInput = (e) => {
    let name = e.target.name,
      value = e.target.value;
    let businessId = localStorage.getItem("businessId");
    setInputValue({ ...InputValue, [name]: value, businessId });
  };
  let searchEmployees = async (e, employeeName) => {
    if (e != "noEvent") e.preventDefault();
    try {
      setProcessing(true);
      let response = await axios.post(
        serverAddress + "searchEmployee/",
        InputValue
      );
      setProcessing(false);
      const allEmployee = response.data.data.result,
        connectedEmployees = response.data.data.result1;

      const targetedEmployees = allEmployee?.map((item, index1) => {
        allEmployee[index1].connection = "notConnected";
        // filter connected and not connected employees
        connectedEmployees?.map((employee, index) => {
          let x = index;
          if (employee.userId == item.userId) {
            allEmployee[index1].connection = "connected";
            return (item.connection = "connected");
          }
        });
        return item;
      });

      setsearchedEmployee({
        ...searchedEmployee,
        noOfEmployees: targetedEmployees,
        status: targetedEmployees.length == 0 ? "noData" : "DataFound",
      });
    } catch (error) {
      setErrors(error.message);
    }
  };
  const [deviceWidth, setDeviceWidth] = useState(window.innerWidth);
  return (
    <div>
      {Errors && <SuccessOrError setErrors={setErrors} request={Errors} />}
      <form
        className={EmployeeSearchCss.employeeSearchForm}
        action=""
        method="post"
        onSubmit={(e) => {
          searchEmployees(e, "noData");
        }}
      >
        <h4 className="nameLabel">Employee Name / Phone</h4>
        <br />
        <div className={EmployeeSearchCss.searchWrapper}>
          <TextField
            fullWidth
            label="Employee Name"
            required
            className={EmployeeSearchCss.MuiInputBase_root1}
            id={EmployeeSearchCss.employeeNameToBeSearched}
            onChange={collectInput}
            name="employeeNameToBeSearched"
            type="search"
          />
          <br /> <br />
          {Processing ? (
            <ButtonProcessing />
          ) : (
            <Button
              fullWidth
              className={EmployeeSearchCss.searchButton}
              variant="contained"
              type="submit"
              color="primary"
            >
              search
            </Button>
          )}
        </div>
      </form>

      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {searchedEmployee.noOfEmployees?.length > 0 ? (
          deviceWidth > 500 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {searchedEmployee.noOfEmployees?.map((items) => (
                    <TableRow key={items.userId}>
                      <TableCell>{items.employeeName}</TableCell>
                      <TableCell>{items.phoneNumber}</TableCell>
                      <TableCell>
                        {items.connection === "connected" ? (
                          <Chip
                            label="Employee To This Business"
                            color="info"
                            disabled
                          />
                        ) : (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                              setShowConfirmDialog(true);
                              setconfirmAction("addAsEmployee");
                              setconfirmMessages(
                                "are you sure to add this person as employee"
                              );
                              setThisPersonAsEmployee({
                                items,
                                status: "notConfirmed",
                              });
                            }}
                          >
                            Add This Employee
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            searchedEmployee.noOfEmployees?.map((items) => {
              return (
                <div
                  id={"employeId_" + items.userId}
                  key={items.userId}
                  className="searchedEmloyee"
                >
                  <div>Name :- {items.employeeName}</div>
                  <div>Phone :- {items.phoneNumber}</div>
                  {items.connection == "connected" ? (
                    <Chip
                      label=" Employee To This Business"
                      color="info"
                      disabled
                    />
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        setShowConfirmDialog(true);
                        setconfirmAction("addAsEmployee");
                        setconfirmMessages(
                          "are you sure to add this person as employee"
                        );
                        setThisPersonAsEmployee({
                          items,
                          status: "notConfirmed",
                        });
                      }}
                    >
                      Add This Employee
                    </Button>
                  )}
                </div>
              );
            })
          )
        ) : (
          searchedEmployee.status == "noData" && (
            <div style={{ color: "red" }}>No employee data found</div>
          )
        )}
      </div>
      {ShowConfirmDialog && (
        <ConfirmDialog
          action={confirmAction}
          message={confirmMessages}
          open={ShowConfirmDialog}
          setShowConfirmDialog={setShowConfirmDialog}
          onConfirm={setThisPersonAsEmployee}
        />
      )}
    </div>
  );
};

export default EmployeeSearch;
