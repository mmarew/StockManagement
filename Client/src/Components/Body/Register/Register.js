import axios from "axios";
import React, { useState } from "react";
import "./Register.css";
import { useNavigate } from "react-router-dom";
// it is sign up
function Register() {
  const navigate = useNavigate();
  const [RegisterForm, setRegisterForm] = useState({});
  let handleRegistrationChange = (e) => {
    e.preventDefault();
    // console.log(e.target);
    let value = e.target.value,
      names = e.target.name;
    setRegisterForm({ ...RegisterForm, [names]: value });
  };
  let handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    let response = await axios.post(
      "http://localhost:2020/RegisterUsers",
      RegisterForm
    );
    console.log();
    let data = response.data.data;
    alert(response.data.data);
    navigate("/");
  };
  return (
    <form
      className="userRegistrationForm"
      onSubmit={handleRegistrationSubmit}
      action=""
    >
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
