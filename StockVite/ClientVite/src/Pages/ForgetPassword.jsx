import { Box, Button, TextField } from "@mui/material";
import React, { useState } from "react";
import forgetCss from "../CSS/Forget.module.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import SuccessOrError from "../Components/Body/Others/SuccessOrError";

function ForgetPassword() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pincode, setPincode] = useState("");
  const [password, setPassword] = useState({
    password: "",
    retypedPassword: "",
  });
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState(null);
  const [showPincodeField, setShowPincodeField] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);

  let serverUrl = localStorage.getItem("targetUrl");
  let navigate = useNavigate();

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const submitRegistrationRequest = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      const response = await axios.post(serverUrl + "forgetRequest/", {
        phoneNumber,
      });

      if (response.data.data === "requestedToChangePassword") {
        setShowPincodeField(true);
      } else if (response.data.error === "Phone number not found") {
        setErrors("Phone number not found");
      }

      setProcessing(false);
    } catch (error) {
      setProcessing(false);
      if (
        error.response &&
        error.response.data &&
        error.response.data.error === "Phone number not found"
      ) {
        setErrors("Phone number not found");
      } else {
        setErrors(error.message);
      }
    }
  };

  const verifyPincode = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      const response = await axios.post(serverUrl + "verifyPin/", {
        phoneNumber,
        pincode,
      });

      if (response.data.data === "correctPin") {
        setShowPasswordField(true);
        setErrors("");
      } else {
        setErrors("Wrong Pincode");
      }
    } catch (error) {
      setErrors(error.message);
    }
    setProcessing(false);
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    if (password.password !== password.retypedPassword) {
      alert("Password mismatch");
      return;
    }

    setProcessing(true);
    try {
      const response = await axios.post(serverUrl + "updateChangeInpassword/", {
        phoneNumber,
        password,
      });

      if (response.data.data === "passwordChanged") {
        setShowPasswordField(false);
        navigate("/login");
        alert("Your password has been changed");
      }
    } catch (error) {
      setErrors(error.message);
    }
    setProcessing(false);
  };

  return (
    <div className={forgetCss.forgetFormWrapper}>
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
          onChange={handlePhoneNumberChange}
          label="Enter Phone Number"
        />
        <div>
          {processing ? (
            <Button disabled>Processing ..... </Button>
          ) : (
            <Button
              sx={{ display: "block", margin: "auto" }}
              className={forgetCss.requestButton}
              type="submit"
              variant="contained"
            >
              Request Forget
            </Button>
          )}
        </div>
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
            Your forgotten resetting PIN has been sent to your phone. Please
            check your phone and enter it in the following input field.
          </p>
          <TextField
            className={forgetCss.pincodeInput}
            required
            onChange={(e) => setPincode(e.target.value)}
            type="number"
            label="Enter Pin Code"
          />
          {errors && <div>{errors}</div>}
          <div style={{ display: "block", margin: "auto" }}>
            {processing ? (
              <Button disabled>Processing ..... </Button>
            ) : (
              <Button
                className={forgetCss.verifyButton}
                variant="contained"
                color="primary"
                type="submit"
              >
                Verify
              </Button>
            )}
          </div>
        </form>
      )}
      {showPasswordField && (
        <form className={forgetCss.passwordForm} onSubmit={updatePassword}>
          <h3 className={forgetCss.passwordFormTitle}>
            Please Enter Your New Password
          </h3>
          <br />
          <TextField
            className={forgetCss.passwordInput}
            required
            name="password"
            onChange={(e) =>
              setPassword({ ...password, password: e.target.value })
            }
            type="password"
            label="Enter Password"
          />
          <br />
          <TextField
            className={forgetCss.passwordInput}
            required
            name="retypedPassword"
            onChange={(e) =>
              setPassword({ ...password, retypedPassword: e.target.value })
            }
            type="password"
            label="Re-enter Password"
          />
          <br />
          <Box>
            {processing ? (
              <Button disabled>Processing ..... </Button>
            ) : (
              <Button
                sx={{ margin: "auto", display: "block" }}
                className={forgetCss.updateButton}
                type="submit"
                color="primary"
                variant="contained"
              >
                Update
              </Button>
            )}
          </Box>
        </form>
      )}
      {errors && <SuccessOrError request={errors} setErrors={setErrors} />}
    </div>
  );
}

export default ForgetPassword;
