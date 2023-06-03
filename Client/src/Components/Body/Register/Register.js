import axios from "axios";
import React, { useState } from "react";
import "./Register.css";
import $ from "jquery";
import { LinearProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
let serverUrl = localStorage.getItem("targetUrl");
function Register() {
  const navigate = useNavigate();
  const [RegisterForm, setRegisterForm] = useState({});
  let handleRegistrationChange = (e) => {
    e.preventDefault();
    let value = e.target.value,
      names = e.target.name;
    setRegisterForm({ ...RegisterForm, [names]: value });
  };
  let handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    $("#LinearProgress2").show();
    let response = await axios.post(serverUrl + "RegisterUsers/", RegisterForm);

    let data = response.data.data;
    console.log("response is ", response);
    if (response.data.data == "This phone number is registered before.")
      alert(response.data.data);
    else if (response.data.data == "Data is inserted well.") {
      alert("You are registered as user in stock management system. Thankyou");
      navigate("/");
    } else navigate("/");
    $("#LinearProgress2").hide();
  };
  return (
    <form
      className="userRegistrationForm"
      onSubmit={handleRegistrationSubmit}
      action=""
    >
      <LinearProgress id="LinearProgress2" />
      <input
        required
        name="fullName"
        onChange={handleRegistrationChange}
        type="text"
        placeholder="Full Name"
      />
      <input
        required
        name="registerPhone"
        onChange={handleRegistrationChange}
        type="tel"
        placeholder="phone number"
      />
      <input
        required
        name="registerPassword"
        onChange={handleRegistrationChange}
        type="tel"
        placeholder="Password"
      />
      <input
        name="submitButton"
        type="submit"
        placeholder=""
        value="Register"
      />
      <a href="/login">Login</a>
    </form>
  );
}

export default Register;
