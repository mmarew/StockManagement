import React, { useContext, useEffect, useState } from "react";
import Loginmodulecss from "./Login.module.css";
import axios from "axios";
import $ from "jquery";
import { Button, LinearProgress, TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import ImgApp from "../../../ImgSlider";
import { ConsumeableContext } from "../UserContext/UserContext";
import Localstorage from "../LocalStorage/Localstorage";

function Login() {
  let serverAddress = localStorage.getItem("targetUrl");
  let Navigate = useNavigate();
  const [loginForm, setloginForm] = useState({});
  const { ownersName, setownersName } = ConsumeableContext();
  let submitForm = async (e) => {
    e.preventDefault();
    $("#LinearProgress").css("display", "block");
    // $("#LinearProgress").css("display", "block");
    let response = await axios.post(serverAddress + "Login/", loginForm);
    // console.log("response", response.data);
    localStorage.setItem("ownersName", response.data.usersFullName);
    if (response.data.data == "loginSuccessFull") {
      let token = response.data.token;
      localStorage.setItem("storeToken", token);
      let getToken = localStorage.getItem("storeToken");
      Navigate("/Business");
    } else if (response.data.data == "data not found") {
      alert(
        "Your phone number is not registered before. please sign up first or type your number correctly. Thank you."
      );
    } else if (response.data.data == "password mismatch") {
      alert("password mismatch");
    } else {
      alert(response.data);
    }
    $("#LinearProgress").hide();
  };
  let handleFormData = (e) => {
    let values = e.target.value;
    let names = e.target.name;
    setloginForm({ ...loginForm, [names]: values });
  };

  let savedToken = localStorage.getItem("storeToken");
  let navigate = useNavigate();
  let VerifyLogin = async () => {
    console.log("savedStore ===== " + savedToken);
    if (savedToken == null || savedToken == "") {
      // navigate("/login");
      return;
    }
    let response = await axios.post(serverAddress + "verifyLogin/", {
      token: savedToken,
    });
    console.log("in verifyLogin response", response);
    if (response.data.data == "alreadyConnected") {
      let employeeName = response.data.result[0].employeeName;
      employeeName = employeeName.split(" ")[0];
      setownersName(employeeName);
      navigate("/");
    } else {
      // Navigate("/Login");
    }
  };
  useEffect(() => {
    console.log("verify login");
    VerifyLogin();
    Localstorage();
    $("#LinearProgress").hide();
  }, []);
  return (
    <div className={Loginmodulecss.loginWrapper}>
      <div className={Loginmodulecss.LeftSide}>
        <div className={Loginmodulecss.gladMessage}>Glad to see you back</div>
        <div className={Loginmodulecss.greetingToLogin}>
          Login to your account to see how your shops are doing?
        </div>
        <LinearProgress id="LinearProgress" />
        <br />
        <form
          className={Loginmodulecss.loginForm}
          onSubmit={submitForm}
          action=""
        >
          <TextField
            required
            name="phoneNumber"
            onChange={handleFormData}
            type="text"
            label="phone number"
          />
          <br />
          <TextField
            required
            name="Password"
            onChange={handleFormData}
            type="password"
            label="Password"
          />

          <Link
            className={Loginmodulecss.passwordForgotten}
            to={"/forgetPaassword"}
          >
            Forgot Password?
          </Link>

          <Button
            variant="contained"
            color="primary"
            className={Loginmodulecss.btnLogin}
            type="submit"
          >
            Login
          </Button>
          <Link className={Loginmodulecss.signupRegister} to="/register">
            <div className={Loginmodulecss.titleTohaveAccount}>
              <span> Don't have an account? </span>
              <span className={Loginmodulecss.RegisterTex}>
                &nbsp; Register.
              </span>
            </div>
          </Link>
          <div className={Loginmodulecss.helpClass}>
            <br />
            <span>If you need help please </span>

            <span
              to="/register"
              className={Loginmodulecss.help}
              onClick={(e) => {
                e.preventDefault();
                Navigate("/help");
              }}
            >
              click here?
            </span>
          </div>
        </form>
      </div>
      <div className={Loginmodulecss.loginRightSide}>
        {/* <img src={loginimg} /> */}

        <ImgApp />
      </div>
    </div>
  );
}

export default Login;
