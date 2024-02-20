import React, { useContext, useEffect, useState } from "react";
import Loginmodulecss from "./Login.module.css";
import axios from "axios";

import { Button, LinearProgress, TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import ImgApp from "../ImgSlider";
import { ConsumeableContext } from "../Components/Body/UserContext/UserContext";
import Localstorage from "../Components/Body/LocalStorage/Localstorage";
import VerifyLogin from "./VerifyLogin";
import DecodeJWT from "../Components/Utilities/DecodeJWT";

function Login() {
  let serverAddress = localStorage.getItem("targetUrl");
  let Navigate = useNavigate();
  const [loginErrors, setloginErrors] = useState(null);
  const [loginForm, setloginForm] = useState({});
  const { setownersName } = ConsumeableContext();
  let submitForm = async (e) => {
    try {
      e.preventDefault();
      setProcess(true);
      let response = await axios.post(serverAddress + "Login/", loginForm);
      setProcess(false);

      let { Message, token } = response.data;
      let { usersFullName } = DecodeJWT(token);

      if (Message == "login successfully.") {
        localStorage.setItem("ownersName", usersFullName);
        localStorage.setItem("storeToken", token);
        localStorage.getItem("storeToken");
        Navigate("/Business");
      } else {
        setloginErrors(Message);
      }
    } catch (error) {
      setProcess(false);
      setloginErrors(error.message);
    }
  };
  let handleFormData = (e) => {
    setloginErrors(null);
    let values = e.target.value;
    let names = e.target.name;
    setloginForm({ ...loginForm, [names]: values });
  };

  let savedToken = localStorage.getItem("storeToken");
  let navigate = useNavigate();
  useEffect(() => {
    Localstorage();
    setProcess(true);
    let data = VerifyLogin();
    // console.log("data", data);
    data
      .then((response) => {
        if (response?.data == "alreadyConnected") {
          let employeeName = response.result[0].employeeName;
          employeeName = employeeName.split(" ")[0];
          setownersName(employeeName);
          navigate("/");
        }
        setProcess(false);
      })
      .catch((error) => {
        console.log(error);
        setProcess(false);
        setloginErrors(error.message);
      });
  }, []);
  const [Process, setProcess] = useState(false);
  return (
    <div className={Loginmodulecss.loginWrapper}>
      <div className={Loginmodulecss.LeftSide}>
        <div className={Loginmodulecss.gladMessage}>Glad to see you back</div>
        <div className={Loginmodulecss.greetingToLogin}>
          Login to your account to see how your shops are doing?
        </div>

        <br />
        {loginErrors && (
          <div style={{ color: "red", padding: "10px" }}>{loginErrors}</div>
        )}
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "500px",
          }}
          // className={Loginmodulecss.loginForm}
          onSubmit={submitForm}
          action=""
        >
          <TextField
            fullWidth
            required
            name="phoneNumber"
            onChange={handleFormData}
            type="text"
            label="phone number"
          />
          <br />

          <TextField
            fullWidth
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
          {Process ? (
            <LinearProgress id="LinearProgress" />
          ) : (
            <Button
              fullWidth
              variant="contained"
              color="primary"
              // className={Loginmodulecss.btnLogin}
              type="submit"
            >
              Login
            </Button>
          )}
          <div className={Loginmodulecss.signupRegister}>
            <div className={Loginmodulecss.titleTohaveAccount}>
              <span> Don't have an account? </span>
              <Link to="/register" className={Loginmodulecss.RegisterTex}>
                &nbsp; Register.
              </Link>
            </div>
          </div>
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
