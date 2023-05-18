import React, { useState } from "react";
import "./Login.css";
import axios from "axios";
import $ from "jquery";
import { CircularProgress } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
function Login() {
  let serverAddress = localStorage.getItem("targetUrl");
  let Navigate = useNavigate();
  const [loginForm, setloginForm] = useState({});
  let submitForm = async (e) => {
    e.preventDefault();
    $("#CircularProgress").show();
    console.log("submitForm");
    let response = await axios.post(serverAddress + "Login/", loginForm);
    console.log("response = ", response);
    console.log(response.data.data);
    if (response.data.data == "loginSuccessFull") {
      console.log(response.data.token);
      let token = response.data.token;
      localStorage.setItem("storeToken", token);
      let getToken = localStorage.getItem("storeToken");
      console.log("getToken", getToken);
      Navigate("/Business");
    } else if (response.data.data == "data not found") {
      alert(
        "Your phone number is not registered before. please sign up first or type your number correctly. Thank you."
      );
    } else if (response.data.data == "password mismatch") {
      alert("password mismatch");
    }
    $("#CircularProgress").hide();
  };
  let handleFormData = (e) => {
    let values = e.target.value;
    let names = e.target.name;
    setloginForm({ ...loginForm, [names]: values });
  };
  return (
    <div className="">
      {console.log(loginForm)}
      <form className="loginForm" onSubmit={submitForm} action="">
        <CircularProgress id="CircularProgress" />
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
          type="text"
          placeholder="Password"
        />
        <button className="btnLogin" type="submit">
          Login
        </button>
        <Link className="" to="/register">
          Register / Sign Up?
        </Link>
      </form>
    </div>
  );
}

export default Login;
