import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import forgetCss from "./Forget.module.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
function ForgetPassword() {
  const [PhoneNumber, setPhoneNumber] = useState("");
  let serverUrl = localStorage.getItem("targetUrl");
  const [showPasswordField, setshowPasswordField] = useState(false);
  let colllectPhoneNumber = (e) => {
    console.log(e);
    setPhoneNumber(e.target.value);
    e.preventDefault();
  };
  let submitRegistrationRequest = async (e) => {
    e.preventDefault();
    console.log("setPhoneNumber", PhoneNumber);
    let Responces = await axios.post(serverUrl + "forgetRequest/", {
      PhoneNumber,
    });
    console.log("Responces", Responces.data);
    if (Responces.data.data == "requestedToChangePassword") {
      setshowPincodeField(true);
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
    console.log(Responces);
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
    <div>
      {console.log("Password", Password)}
      <form
        onSubmit={submitRegistrationRequest}
        className={forgetCss.forgetForm}
      >
        {" "}
        <h5 className={forgetCss.ForgefForMTitle}>
          password Forget Request form in smart stock management
        </h5>
        <TextField
          required
          type="tel"
          onChange={colllectPhoneNumber}
          label="Enter phone number"
        />
        <Button type="submit" variant="contained">
          Request forget
        </Button>
        <Link className={forgetCss.linkToOthers} to={"/login"}>
          If you have an account Login here.
        </Link>
        <Link className={forgetCss.linkToOthers} to={"/register"}>
          If you are new register here.
        </Link>
      </form>
      {showPincodeField && (
        <form className={forgetCss.pincodeWrapper} onSubmit={verifyPincode}>
          Your forget pin is sent to your phone. so please see your phone and
          enter it in the following input field.
          <TextField
            required
            onChange={collectPincode}
            type="number"
            label="type pin code"
          />
          {PincodeStatus}
          <Button variant="contained" color="primary" type="submit">
            verify
          </Button>
        </form>
      )}
      {showPasswordField && (
        <>
          <br />

          <form className={forgetCss.retypePassword} onSubmit={updatePassword}>
            <h3>Please enter your password</h3>
            <TextField
              required
              name="password"
              onChange={handlPassword}
              type="password"
              label="Type password"
            />
            <TextField
              required
              name="retypedPassword"
              onChange={handlPassword}
              type="password"
              label="Re Type password"
            />
            <Button type="submit" color="primary" variant="contained">
              Update
            </Button>
          </form>
        </>
      )}
    </div>
  );
}

export default ForgetPassword;
