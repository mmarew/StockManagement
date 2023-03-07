import React, { useState } from "react";
import "./Login.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
function Login() {
  let Navigate = useNavigate();
  const [loginForm, setloginForm] = useState({});
  let submitForm = async (e) => {
    e.preventDefault();
    console.log("submitForm");
    let response = await axios.post("http://localhost:2020/Login", loginForm);
    console.log("response = ");
    console.log(response.data.data);
    if (response.data.data == "loginSuccessFull") {
      console.log(response.data.token);
      let token = response.data.token;
      localStorage.setItem("storeToken", token);
      let getToken = localStorage.getItem("storeToken");
      console.log("getToken");
      Navigate("/Business");
    } else if (response.data.data == "data not found") {
      alert(
        "Your phone number is not registered before. please sign up first or type your number correctly. Thank you."
      );
    } else if (response.data.data == "password mismatch") {
      alert("password mismatch");
    }
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
