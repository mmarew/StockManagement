import { TextField, Button } from "@material-ui/core";
import axios from "axios";
import React, { useState } from "react";
import RegisterCss from "./Register.module.css";
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
      <TextField
        required
        name="registerPhone"
        onChange={handleRegistrationChange}
        type="tel"
        label="phone number"
      />
      <TextField
        required
        name="registerPassword"
        onChange={handleRegistrationChange}
        type="password"
        label="Password"
      />
      <br />
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
      <br />
      Do you have an account?
      <a style={{ textDecoration: "none" }} href="/login">
        Login here
      </a>
    </form>
  );
}

export default Register;

// function Register() {
//   const styles = {
//     backgroundColor: "white",
//     padding: "20px",
//     borderRadius: "5px",
//     width: "200px",
//     margin: "center",
//   };
//   const [values, setValues] = React.useState({
//     firstName: "",
//     middleName: "",
//     lastName: "",
//     // email: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const handleChange = (prop) => (event) => {
//     setValues({ ...values, [prop]: event.target.value });
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     console.log(values);
//   };

//   return (
//     <form className={RegisterCss.userRegistrationForm} onSubmit={handleSubmit}>
//       <TextField
//         label="First Name"
//         value={values.firstName}
//         onChange={handleChange("firstName")}
//         margin="normal"
//         required
//         fullWidth
//       />
//       <TextField
//         label="Middle Name"
//         value={values.middleName}
//         onChange={handleChange("middleName")}
//         margin="normal"
//         required
//         fullWidth
//       />
//       <TextField
//         label="Last Name"
//         value={values.lastName}
//         onChange={handleChange("lastName")}
//         margin="normal"
//         required
//         fullWidth
//       />
//       {/* <TextField
//         label="Email"
//         type="email"
//         value={values.email}
//         onChange={handleChange("email")}
//         margin="normal"
//         required
//         fullWidth
//       /> */}
//       <TextField
//         label="Password"
//         type="password"
//         value={values.password}
//         onChange={handleChange("password")}
//         margin="normal"
//         required
//         fullWidth
//       />
//       <TextField
//         label="Confirm Password"
//         type="password"
//         value={values.confirmPassword}
//         onChange={handleChange("confirmPassword")}
//         margin="normal"
//         required
//         fullWidth
//       />
//       <br />
//       <Button type="submit" variant="contained" color="primary" fullWidth>
//         Sign Up
//       </Button>
//       <br />
//       <Button color="primary" variant={"contained"}>
//         <a href="/login">Login</a>
//       </Button>
//     </form>
//   );
// }

// export default Register;
