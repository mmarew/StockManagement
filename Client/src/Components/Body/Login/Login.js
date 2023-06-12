import React, { useEffect, useState } from "react";
import "./Login.css";
import axios from "axios";
import $ from "jquery";
import { LinearProgress } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
function Login() {
  let serverAddress = localStorage.getItem("targetUrl");
  let Navigate = useNavigate();
  const [loginForm, setloginForm] = useState({});
  let submitForm = async (e) => {
    e.preventDefault();
    $("#LinearProgress").show();
    let response = await axios.post(serverAddress + "Login/", loginForm);
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
  useEffect(() => {
    console.log("verify login");
  }, []);

  return (
    <div className="">
      {console.log(loginForm)}
      <form className="loginForm" onSubmit={submitForm} action="">
        <LinearProgress id="LinearProgress" />
        <input
          required
          name="phoneNumber"
          onChange={handleFormData}
          type="text"
          placeholder="phone number"
        />
        <input
          required
          name="Password"
          onChange={handleFormData}
          type="password"
          placeholder="Password"
        />
        <button className="btnLogin" type="submit">
          Login
        </button>
        <Link className="signupRegister" to="/register">
          Register / Sign Up?
        </Link>
        <a
          className="help"
          onClick={() => {
            Navigate("/help");
          }}
        >
          Help
        </a>
      </form>
    </div>
  );
}

export default Login;
