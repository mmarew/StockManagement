// import { TextField, Button } from "";
import axios from "axios";
import React, { useContext, useState } from "react";
import RegisterCss from "./Register.module.css";
import $ from "jquery";
import { Button, LinearProgress, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { InitialContext } from "../UserContext/UserContext";
import ImgApp from "../../../ImgSlider";
function Register() {
  let serverUrl = localStorage.getItem("targetUrl");
  const navigate = useNavigate();
  const [RegisterForm, setRegisterForm] = useState({});
  let handleRegistrationChange = (e) => {
    e.preventDefault();
    let value = e.target.value,
      names = e.target.name;
    setRegisterForm({ ...RegisterForm, [names]: value });
  };
  const savedContext = useContext(InitialContext);
  const [ownersName, setownersName] = savedContext;
  let handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    $("#LinearProgress2").show();
    console.log("RegisterForm", RegisterForm);

    let response = await axios.post(serverUrl + "RegisterUsers/", RegisterForm);
    let data = response.data.data,
      token = response.data.token;
    console.log("response.data.data is ", data);
    if (data == "This phone number is registered before.") {
      alert(data);
    } else if (data == "Data is inserted successfully.") {
      alert("You are registered as user in stock management system. Thankyou");
      console.log("fullName =", RegisterForm.fullName);
      setownersName(RegisterForm.fullName);
      localStorage.setItem("storeToken", token);
      localStorage.setItem("ownersName", RegisterForm.fullName);
      navigate("/login");
    } else {
      localStorage.setItem("ownersName", RegisterForm.fullName);
      setownersName(RegisterForm.fullName);
      navigate("/login");
    }
    $("#LinearProgress2").hide();
  };
  return (
    <div className={RegisterCss.registerationFormWrapper}>
      <div className={RegisterCss.leftsideWrapper}>
        <br /> <br />
        {/* <div>Registrtion form to smart stock management system</div> */}
        <div className={RegisterCss.titleCreateAccount}>Create an account</div>
        <div className={RegisterCss.subTitleCreateAccount}>
          By creating an account you can administer your shopes
        </div>
        <form
          className={RegisterCss.userRegistrationForm}
          onSubmit={handleRegistrationSubmit}
          action=""
        >
          <LinearProgress id="LinearProgress2" />
          <TextField
            required
            name="fullName"
            onChange={handleRegistrationChange}
            type="text"
            label="Full Name"
          />
          <br />
          <TextField
            required
            name="registerPhone"
            onChange={handleRegistrationChange}
            type="tel"
            label="phone number"
          />
          <br />
          <TextField
            required
            name="registerPassword"
            onChange={handleRegistrationChange}
            type="password"
            label="Password"
          />
          <br />
          <div>
            <span>Already have an account? </span>
            <span
              style={{
                textDecoration: "none",
                color: "#6998ff",
                cursor: "pointer",
              }}
              onClick={() => navigate("/login")}
            >
              Login here
            </span>
          </div>
          <Button
            variant="contained"
            name="submitButton"
            type="submit"
            placeholder=""
            color="primary"
            className={RegisterCss.userRegistrationSubmitBtn}
          >
            Register
          </Button>
        </form>
      </div>
      <div className={RegisterCss.rightSideWrapper}>
        <ImgApp />
      </div>
    </div>
  );
}

export default Register;
