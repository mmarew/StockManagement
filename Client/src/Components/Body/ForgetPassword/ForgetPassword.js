import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import forgetCss from "./Forget.module.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
function ForgetPassword() {
  // const [PhoneNumber, setPhoneNumber] = useState("");
  let serverUrl = localStorage.getItem("targetUrl");
  const [showPasswordField, setshowPasswordField] = useState(false);
  let colllectPhoneNumber = (e) => {
    console.log(e);
    setPhoneNumber(e.target.value);
    e.preventDefault();
  };
  const [PhoneNumber, setPhoneNumber] = useState("");
  let requestBySms = async () => {
    const encodedPhoneNumber = encodeURIComponent(PhoneNumber);
    // alert("PhoneNumber " + PhoneNumber);
    try {
      let Responces = await axios.get(
        `https://sms.masetawosha.com?Phonenumber=${encodedPhoneNumber}`
      );
      console.log("Responces requestBySms === ", Responces);
    } catch (error) {
      console.log("error", error);
    }
  };
  let submitRegistrationRequest = async (e) => {
    e.preventDefault();
    try {
      console.log("setPhoneNumber", PhoneNumber);
      let Responces = await axios.post(serverUrl + "forgetRequest/", {
        PhoneNumber,
      });
      console.log("Responces", Responces.data);
      if (Responces.data.data == "requestedToChangePassword") {
        setshowPincodeField(true);
        requestBySms();
      }
    } catch (error) {
      console.log("error", error.response.data.error);
      if (error.response.data.error == "Phone number not found") {
        alert("This Phone number is not found");
      }
    }
  };

  const [Password, setPassword] = useState({});
  let navigate = useNavigate();
  let updatePassword = async (e) => {
    e.preventDefault();
    console.log("Password", Password);
    // password: "marew123";
    // retypedPassword: "marew123";
    if (Password.password !== Password.retypedPassword) {
      return alert("password mismatch");
    }
    let Responces = await axios.post(serverUrl + "updateChangeInpassword/", {
      PhoneNumber,
      Password,
    });
    console.log("updateChangeInpassword Responces= ", Responces);
    if ((Responces.data.data = "passwordChanged")) {
      setshowPasswordField(false);
      navigate("/login");
      alert("your password is changed");
    }
  };
  let handlPassword = (e) => {
    setPassword({ ...Password, [e.target.name]: e.target.value });
  };
  const [showPincodeField, setshowPincodeField] = useState(false);
  const [pincode, setpincode] = useState("");

  let collectPincode = (e) => {
    setpincode(e.target.value);
  };
  const [PincodeStatus, setPincodeStatus] = useState("");
  let verifyPincode = async (e) => {
    e.preventDefault();
    console.log(pincode);
    let responce = await axios.post(serverUrl + "verifyPin/", {
      PhoneNumber,
      pincode,
    });
    console.log("responce", responce);
    if (responce.data.data == "correctPin") {
      setshowPasswordField(true);
      setPincodeStatus("");
    } else {
      setPincodeStatus("wrong Pincode ");
    }
  };

  return (
    <div className={forgetCss.forgetFormWrapper}>
      {console.log("Password", Password)}
      <form
        onSubmit={submitRegistrationRequest}
        className={forgetCss.forgetForm}
      >
        <h5 className={forgetCss.forgetFormTitle}>
          Password Forget Request Form in Smart Stock Management
        </h5>
        <TextField
          className={forgetCss.phoneNumberInput}
          required
          type="tel"
          onChange={colllectPhoneNumber}
          label="Enter Phone Number"
        />
        <Button
          className={forgetCss.requestButton}
          type="submit"
          variant="contained"
        >
          Request Forget
        </Button>
        <Link className={forgetCss.linkToOthers} to={"/login"}>
          If you have an account, Login here.
        </Link>
        <Link className={forgetCss.linkToOthers} to={"/register"}>
          If you are new, register here.
        </Link>
      </form>
      {showPincodeField && (
        <form className={forgetCss.pincodeWrapper} onSubmit={verifyPincode}>
          <p className={forgetCss.pincodeMessage}>
            Your forget pin has been sent to your phone. Please check your phone
            and enter it in the following input field.
          </p>
          <TextField
            className={forgetCss.pincodeInput}
            required
            onChange={collectPincode}
            type="number"
            label="Enter Pin Code"
          />
          {PincodeStatus}
          <Button
            className={forgetCss.verifyButton}
            variant="contained"
            color="primary"
            type="submit"
          >
            Verify
          </Button>
        </form>
      )}
      {showPasswordField && (
        <form className={forgetCss.passwordForm} onSubmit={updatePassword}>
          <h3 className={forgetCss.passwordFormTitle}>
            Please Enter Your New Password
          </h3>
          <TextField
            className={forgetCss.passwordInput}
            required
            name="password"
            onChange={handlPassword}
            type="password"
            label="Enter Password"
          />
          <TextField
            className={forgetCss.passwordInput}
            required
            name="retypedPassword"
            onChange={handlPassword}
            type="password"
            label="Re-enter Password"
          />
          <Button
            className={forgetCss.updateButton}
            type="submit"
            color="primary"
            variant="contained"
          >
            Update
          </Button>
        </form>
      )}
    </div>
  );
}

export default ForgetPassword;
